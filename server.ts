import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { DEFAULT_STORE_DATA } from './src/data/defaultStoreData';

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

async function startServer() {
  const app = express();
  const PORT = 3000;

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
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Store Data Sync API Endpoints for Cross-Device Synchronization
  app.get('/api/store-data', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        const diskData = JSON.parse(raw);
        serverStoreCache = { ...serverStoreCache, ...diskData };
      }
    } catch (_) {}

    res.json(serverStoreCache);
  });

  app.post('/api/store-data', (req, res) => {
    try {
      const updates = req.body || {};
      saveStoreDataToDisk(updates);
      res.json({ success: true, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to persist store data', details: err?.message });
    }
  });

  app.post('/api/store-data/reset', (req, res) => {
    try {
      serverStoreCache = JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(serverStoreCache, null, 2), 'utf-8');
      res.json({ success: true, storeData: serverStoreCache });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to reset store data', details: err?.message });
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
