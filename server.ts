import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
