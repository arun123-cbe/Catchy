import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { DEFAULT_STORE_DATA } from './src/data/defaultStoreData';
import { connectMongoDB, isMongoDBConnected } from './src/db/mongodb';
import { ProductModel } from './src/db/models/ProductModel';
import { OrderModel } from './src/db/models/OrderModel';
import { StoreConfigModel } from './src/db/models/StoreConfigModel';

// Store Data File Path for persistent storage across devices
const DATA_FILE_PATH = path.join(process.cwd(), 'store_data.json');

// In-Memory store cache initialized from disk if available
let serverStoreCache: Record<string, any> = {};

try {
  if (fs.existsSync(DATA_FILE_PATH)) {
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const diskData = JSON.parse(raw);
    serverStoreCache = { ...DEFAULT_STORE_DATA, ...diskData };
    console.log('Successfully loaded persistent store data from disk.');
  } else {
    serverStoreCache = DEFAULT_STORE_DATA;
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DEFAULT_STORE_DATA, null, 2), 'utf-8');
  }
} catch (err) {
  console.warn('Could not read persistent store_data.json file, initializing clean state:', err);
  serverStoreCache = DEFAULT_STORE_DATA;
}

const saveStoreDataToDisk = (data: Record<string, any>) => {
  try {
    const now = Date.now();
    serverStoreCache = { ...DEFAULT_STORE_DATA, ...serverStoreCache, ...data, _updatedAt: now };
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(serverStoreCache, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error writing store data to disk:', err);
  }
};

function sanitizeMongoDoc(doc: any) {
  if (!doc) return doc;
  const { _id, __v, createdAt, updatedAt, ...clean } = doc;
  return clean;
}

function sanitizeProductForMongo(p: any): any {
  if (!p || typeof p !== 'object') return null;
  const clean = sanitizeMongoDoc(p);
  const id = clean.id ? String(clean.id).trim() : `prod-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const name = clean.name ? String(clean.name).trim() : 'Untitled Product';
  const category = clean.category ? String(clean.category).trim() : 'Beauty & Skincare';
  const price = typeof clean.price === 'number' && !isNaN(clean.price) ? clean.price : (parseFloat(String(clean.price || 0)) || 0);
  const originalPrice = clean.originalPrice !== undefined && clean.originalPrice !== null ? (typeof clean.originalPrice === 'number' && !isNaN(clean.originalPrice) ? clean.originalPrice : (parseFloat(String(clean.originalPrice)) || undefined)) : undefined;
  const stock = typeof clean.stock === 'number' && !isNaN(clean.stock) ? clean.stock : (parseInt(String(clean.stock || 0)) || 0);
  const rating = typeof clean.rating === 'number' && !isNaN(clean.rating) ? clean.rating : (parseFloat(String(clean.rating || 5)) || 5);
  const reviewCount = typeof clean.reviewCount === 'number' && !isNaN(clean.reviewCount) ? clean.reviewCount : (parseInt(String(clean.reviewCount || 0)) || 0);
  const reorderPoint = typeof clean.reorderPoint === 'number' && !isNaN(clean.reorderPoint) ? clean.reorderPoint : (parseInt(String(clean.reorderPoint || 10)) || 10);

  return {
    ...clean,
    id,
    name,
    category,
    price,
    originalPrice,
    stock,
    rating,
    reviewCount,
    reorderPoint,
    tagline: clean.tagline ? String(clean.tagline) : 'Premium wellness formula',
    image: clean.image ? String(clean.image) : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: clean.description ? String(clean.description) : 'Natural organic formula.',
    benefits: Array.isArray(clean.benefits) ? clean.benefits.map(String) : [],
    ingredients: Array.isArray(clean.ingredients) ? clean.ingredients.map(String) : [],
    specialities: Array.isArray(clean.specialities) ? clean.specialities.map(String) : [],
    concernsHandled: Array.isArray(clean.concernsHandled) ? clean.concernsHandled.map(String) : [],
    isBestSeller: Boolean(clean.isBestSeller),
    isNewArrival: Boolean(clean.isNewArrival),
    isOrganic: Boolean(clean.isOrganic),
    isSuperSaver: Boolean(clean.isSuperSaver),
    isMostlyBought: Boolean(clean.isMostlyBought),
    isCustomersFavorite: Boolean(clean.isCustomersFavorite),
  };
}

// Sync memory/disk cache to MongoDB database
async function syncToMongoDB(data: Record<string, any>) {
  if (!isMongoDBConnected()) return;
  try {
    // 1. Sync Products cleanly
    if (Array.isArray(data.products)) {
      const sanitizedProducts = data.products
        .map(sanitizeProductForMongo)
        .filter(Boolean);

      await ProductModel.deleteMany({});
      if (sanitizedProducts.length > 0) {
        await ProductModel.insertMany(sanitizedProducts, { ordered: false });
      }
      console.log(`[MongoDB Sync] ✅ Successfully synced ${sanitizedProducts.length} products to MongoDB!`);
    }

    // 2. Sync Orders cleanly
    if (Array.isArray(data.orders)) {
      const activeOrderIds = data.orders.map((o: any) => o.id).filter(Boolean);
      if (activeOrderIds.length > 0) {
        await OrderModel.deleteMany({ id: { $nin: activeOrderIds } });
      }
      for (const ord of data.orders) {
        if (ord.id) {
          const cleanOrd = sanitizeMongoDoc(ord);
          await OrderModel.findOneAndUpdate({ id: ord.id }, cleanOrd, { upsert: true, new: true });
        }
      }
    }

    // 3. Sync Store Config
    await StoreConfigModel.findOneAndUpdate(
      { key: 'store_config' },
      {
        categories: data.categories || DEFAULT_STORE_DATA.categories,
        categoryThumbnails: data.categoryThumbnails || DEFAULT_STORE_DATA.categoryThumbnails,
        heroSlides: data.heroSlides || DEFAULT_STORE_DATA.heroSlides,
        heroBannerConfig: data.heroBannerConfig || DEFAULT_STORE_DATA.heroBannerConfig,
        homepageBanners: data.homepageBanners || DEFAULT_STORE_DATA.homepageBanners,
        customLogoUrl: data.customLogoUrl || null,
        updatedAtTimestamp: Date.now(),
      },
      { upsert: true, returnDocument: 'after' }
    );
  } catch (err: any) {
    console.error('[MongoDB Sync Error] Failed to persist data to MongoDB:', err?.message || err);
  }
}

// Fetch current state from MongoDB if connected
async function fetchFromMongoDB(): Promise<Record<string, any> | null> {
  if (!isMongoDBConnected()) return null;
  try {
    const rawProducts = await ProductModel.find({}).lean();
    const rawOrders = await OrderModel.find({}).lean();
    const configDoc = await StoreConfigModel.findOne({ key: 'store_config' }).lean();

    if (rawProducts.length === 0 && serverStoreCache.products && serverStoreCache.products.length > 0) {
      console.log('[MongoDB] Product collection is empty in MongoDB. Seeding initial store cache to MongoDB...');
      await syncToMongoDB(serverStoreCache);
      return serverStoreCache;
    }

    const cleanProducts = rawProducts.map(sanitizeMongoDoc);
    const cleanOrders = rawOrders.map(sanitizeMongoDoc);

    return {
      products: cleanProducts,
      orders: cleanOrders.length ? cleanOrders : serverStoreCache.orders,
      categories: configDoc?.categories || serverStoreCache.categories,
      categoryThumbnails: configDoc?.categoryThumbnails || serverStoreCache.categoryThumbnails,
      heroSlides: configDoc?.heroSlides || serverStoreCache.heroSlides,
      heroBannerConfig: configDoc?.heroBannerConfig || serverStoreCache.heroBannerConfig,
      homepageBanners: configDoc?.homepageBanners || serverStoreCache.homepageBanners,
      customLogoUrl: configDoc?.customLogoUrl ?? serverStoreCache.customLogoUrl,
      _updatedAt: configDoc?.updatedAtTimestamp || serverStoreCache._updatedAt || Date.now(),
    };
  } catch (err) {
    console.error('[MongoDB Fetch Error]:', err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Attempt MongoDB Connection at server startup
  const mongoOk = await connectMongoDB();
  if (mongoOk) {
    const existing = await fetchFromMongoDB();
    if (!existing) {
      console.log('[MongoDB] MongoDB is empty. Seeding initial store data to MongoDB...');
      await syncToMongoDB(serverStoreCache);
      console.log('[MongoDB] ✅ Initial store data seeded successfully!');
    } else {
      serverStoreCache = { ...serverStoreCache, ...existing };
      // Always sync back to ensure schemas/collections exist
      await syncToMongoDB(serverStoreCache);
      console.log('[MongoDB] ✅ Loaded existing data and synced to MongoDB!');
    }
  }

  // Support large base64 image payloads
  app.use(express.json({ limit: '50mb' }));

  // Initialize Gemini AI Client lazily or safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not configured yet. AI quiz fallback will be used.');
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), mongoConnected: isMongoDBConnected() });
  });

  // MongoDB Status Endpoint
  app.get('/api/mongodb/status', async (req, res) => {
    const connected = isMongoDBConnected();
    const mongoUri = process.env.MONGODB_URI;
    let counts = { products: 0, orders: 0 };

    if (connected) {
      try {
        counts.products = await ProductModel.countDocuments();
        counts.orders = await OrderModel.countDocuments();
      } catch (_) {}
    }

    res.json({
      connected,
      configured: Boolean(mongoUri),
      databaseType: 'MongoDB (Mongoose)',
      collectionCounts: counts,
      connectionUriFormat: 'mongodb://<username>:<password>@<hostinger-ip>:27017/auraglow_db',
    });
  });

  // Store Data Sync API Endpoints for Cross-Device Synchronization
  app.get('/api/store-data', async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Attempt to read from MongoDB first
    if (isMongoDBConnected()) {
      const dbData = await fetchFromMongoDB();
      if (dbData) {
        serverStoreCache = { ...serverStoreCache, ...dbData };
        return res.json(dbData);
      }
    }

    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        const diskData = JSON.parse(raw);
        serverStoreCache = { ...serverStoreCache, ...diskData };
      }
    } catch (_) {}

    res.json(serverStoreCache);
  });

  app.post('/api/store-data', async (req, res) => {
    try {
      const updates = req.body || {};
      saveStoreDataToDisk(updates);

      // Async sync to MongoDB
      if (isMongoDBConnected()) {
        await syncToMongoDB(serverStoreCache);
      }

      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        syncedToMongoDB: isMongoDBConnected(),
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to persist store data', details: err?.message });
    }
  });

  app.post('/api/store-data/reset', async (req, res) => {
    try {
      serverStoreCache = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(serverStoreCache, null, 2), 'utf-8');

      if (isMongoDBConnected()) {
        await syncToMongoDB(serverStoreCache);
      }

      res.json({ success: true, storeData: serverStoreCache });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to reset store data', details: err?.message });
    }
  });

  // Direct REST API for MongoDB Products
  app.get('/api/mongodb/products', async (req, res) => {
    if (!isMongoDBConnected()) {
      return res.status(503).json({ error: 'MongoDB is not connected. Please set MONGODB_URI env var.' });
    }
    try {
      const products = await ProductModel.find({}).lean();
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch products from MongoDB', details: err.message });
    }
  });

  app.post('/api/mongodb/products', async (req, res) => {
    if (!isMongoDBConnected()) {
      return res.status(503).json({ error: 'MongoDB is not connected. Please set MONGODB_URI env var.' });
    }
    try {
      const productData = req.body;
      const product = await ProductModel.findOneAndUpdate({ id: productData.id }, productData, {
        upsert: true,
        new: true,
      });
      res.json({ success: true, product });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save product to MongoDB', details: err.message });
    }
  });

  // AI Personalized Recommendations Endpoint
  app.post('/api/recommendations', async (req, res) => {
    try {
      const { answers, products } = req.body;
      const ai = getAiClient();

      if (!ai) {
        // Safe intelligent fallback if API key is not active
        return res.json({
          headline: 'Your Custom Skin & Wellness Protocol',
          summary: `Based on your goal for ${answers?.primaryGoal || 'radiant vitality'} and ${answers?.skinTypeOrConcern || 'daily wellness'}, we curated a high-efficacy regimen for you.`,
          recommendedProductIds: products?.slice(0, 3).map((p: any) => p.id) || [],
          routineAdvice: [
            'Morning: Cleanse thoroughly and apply targeted active serums.',
            'Mid-Day: Hydrate consistently and protect skin barrier.',
            'Evening: Take adaptogenic supplements 30 mins before rest.'
          ]
        });
      }

      const prompt = `You are a clinical aesthetician and nutritionist for AuraGlow Luxury E-Commerce.
User Quiz Responses:
- Primary Goal: ${answers.primaryGoal}
- Specific Concern: ${answers.skinTypeOrConcern}
- Lifestyle Factor: ${answers.lifestyleFactor}
- Preferred Format: ${answers.preferredForm}

Available Catalog Products:
${JSON.stringify(products.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        concerns: p.concernsHandled,
        description: p.description
      })))}

Select 2 to 3 best matching product IDs from the catalog.
Provide:
1. A compelling 1-line personalized headline.
2. A 2-sentence empathetic summary explaining why these products match their goals.
3. An array of exact matching recommended product IDs from the provided catalog.
4. An array of 3 actionable daily routine advice tips.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              recommendedProductIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              routineAdvice: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['headline', 'summary', 'recommendedProductIds', 'routineAdvice']
          }
        }
      });

      const resultText = response.text || '{}';
      const result = JSON.parse(resultText);
      res.json(result);
    } catch (err: any) {
      console.error('Error generating AI recommendations:', err);
      res.status(500).json({
        error: 'Failed to generate recommendations',
        details: err.message
      });
    }
  });

  // Vite development vs production static middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraGlow E-Commerce server running on http://localhost:${PORT}`);
  });
}

startServer();
