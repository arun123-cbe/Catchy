import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RefreshCw, ShoppingCart, Lightbulb } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AIRecommendationResult, QuizAnswers } from '../types';

interface PersonalizedQuizModalProps {
  onClose: () => void;
}

export const PersonalizedQuizModal: React.FC<PersonalizedQuizModalProps> = ({ onClose }) => {
  const { products, addToCart, formatPrice, setSelectedProductForModal } = useStore();

  const [quizStep, setQuizStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendationResult | null>(null);

  const [answers, setAnswers] = useState<QuizAnswers>({
    primaryGoal: 'Radiant Skin & Elasticity',
    skinTypeOrConcern: 'Dryness & Dullness',
    lifestyleFactor: 'Late Nights & Screen Time',
    preferredForm: 'Serums & Daily Adaptogens'
  });

  const goals = [
    'Radiant Skin & Elasticity',
    'Deep Sleep & Stress Relief',
    'Hair Growth & Scalp Strength',
    'Anti-Aging & Fine Line Renewal',
    'Gut Microbiome & Energy'
  ];

  const concerns = [
    'Dryness & Dullness',
    'Dark Spots & Hyperpigmentation',
    'Thinning Hair & Scalp Flakes',
    'Insomnia & Morning Fatigue',
    'Bloating & Indigestion'
  ];

  const lifestyles = [
    'Late Nights & Screen Time',
    'High Work Stress & Travel',
    'Frequent Sun Exposure',
    'Active Sports & Workouts'
  ];

  const forms = [
    'Serums & Daily Adaptogens',
    'Oral Capsules & Tinctures',
    'Collagen Powders & Smoothies',
    'Rich Whipped Body Butters'
  ];

  const handleGenerateRecommendation = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          products
        })
      });

      if (!res.ok) throw new Error('Failed to fetch recommendations');

      const data: AIRecommendationResult = await res.json();
      setRecommendation(data);
      setQuizStep(5); // Results step
    } catch (err) {
      console.error(err);
      // Fallback
      setRecommendation({
        headline: 'Your Custom Skin & Wellness Routine',
        summary: `Tailored for ${answers.primaryGoal} and targeted for ${answers.skinTypeOrConcern}.`,
        recommendedProductIds: ['prod-1', 'prod-3', 'prod-6'],
        routineAdvice: [
          'Apply Vitamin C serum every morning on clean skin.',
          'Incorporate hydrolyzed collagen into your morning beverage.',
          'Massage rosemary elixir into roots 3 times a week.'
        ]
      });
      setQuizStep(5);
    } finally {
      setLoadingAI(false);
    }
  };

  const recommendedProducts = products.filter(p => recommendation?.recommendedProductIds.includes(p.id));

  const handleAddAllRecommended = () => {
    recommendedProducts.forEach(p => addToCart(p, p.isSubscribable, 30));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-stone-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 text-white p-6 md:p-8 rounded-t-3xl">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>AI Dermatology & Wellness Advisor</span>
          </div>
          <h2 className="text-2xl font-bold font-serif">
            {quizStep <= 4 ? 'Find Your Personalized Routine' : recommendation?.headline}
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            {quizStep <= 4 ? 'Answer 4 quick questions to receive AI-backed formula recommendations.' : recommendation?.summary}
          </p>
        </div>

        {/* Loading State */}
        {loadingAI ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-stone-900 font-serif">Analyzing Your Wellness Profile...</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Synthesizing active ingredients, clinical trial data, and your lifestyle factors...
            </p>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            
            {/* STEP 1: PRIMARY GOAL */}
            {quizStep === 1 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Step 1 of 4</span>
                <h3 className="text-lg font-bold text-stone-900 font-serif">What is your primary health & beauty goal?</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {goals.map((g) => (
                    <button
                      key={g}
                      onClick={() => setAnswers({ ...answers, primaryGoal: g })}
                      className={`p-3.5 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                        answers.primaryGoal === g
                          ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span>{g}</span>
                      {answers.primaryGoal === g && <Check className="w-4 h-4 text-rose-600" />}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setQuizStep(2)}
                  className="w-full py-3.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: SPECIFIC CONCERN */}
            {quizStep === 2 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Step 2 of 4</span>
                <h3 className="text-lg font-bold text-stone-900 font-serif">Which specific concern would you like to address first?</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {concerns.map((c) => (
                    <button
                      key={c}
                      onClick={() => setAnswers({ ...answers, skinTypeOrConcern: c })}
                      className={`p-3.5 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                        answers.skinTypeOrConcern === c
                          ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span>{c}</span>
                      {answers.skinTypeOrConcern === c && <Check className="w-4 h-4 text-rose-600" />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setQuizStep(1)} className="px-4 py-3 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold">Back</button>
                  <button onClick={() => setQuizStep(3)} className="flex-1 py-3.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2">Next Step <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {/* STEP 3: LIFESTYLE */}
            {quizStep === 3 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Step 3 of 4</span>
                <h3 className="text-lg font-bold text-stone-900 font-serif">Which lifestyle factor best describes your daily routine?</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {lifestyles.map((l) => (
                    <button
                      key={l}
                      onClick={() => setAnswers({ ...answers, lifestyleFactor: l })}
                      className={`p-3.5 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                        answers.lifestyleFactor === l
                          ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span>{l}</span>
                      {answers.lifestyleFactor === l && <Check className="w-4 h-4 text-rose-600" />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setQuizStep(2)} className="px-4 py-3 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold">Back</button>
                  <button onClick={() => setQuizStep(4)} className="flex-1 py-3.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2">Next Step <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}

            {/* STEP 4: PREFERRED FORMAT */}
            {quizStep === 4 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Step 4 of 4</span>
                <h3 className="text-lg font-bold text-stone-900 font-serif">What product format do you prefer incorporating?</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {forms.map((f) => (
                    <button
                      key={f}
                      onClick={() => setAnswers({ ...answers, preferredForm: f })}
                      className={`p-3.5 rounded-xl text-left text-xs font-bold transition-all border flex items-center justify-between ${
                        answers.preferredForm === f
                          ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span>{f}</span>
                      {answers.preferredForm === f && <Check className="w-4 h-4 text-rose-600" />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setQuizStep(3)} className="px-4 py-3 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold">Back</button>
                  <button
                    onClick={handleGenerateRecommendation}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    Generate AI Protocol
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: AI RESULTS */}
            {quizStep === 5 && (
              <div className="space-y-6">
                
                {/* Routine Tips */}
                {recommendation?.routineAdvice && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-600" />
                      Custom Routine Guidance
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-950">
                      {recommendation.routineAdvice.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-amber-700">{idx + 1}.</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Products Grid */}
                <div>
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                    Curated Formulas for Your Routine
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recommendedProducts.map((prod) => (
                      <div key={prod.id} className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex gap-3 items-center">
                        <img src={prod.image} alt={prod.name} className="w-16 h-16 rounded-xl object-cover bg-stone-200 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-stone-900 truncate font-serif">{prod.name}</h5>
                          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                            {formatPrice(prod.price * 0.85)} /mo (15% off)
                          </span>
                          <button
                            onClick={() => addToCart(prod, prod.isSubscribable, 30)}
                            className="mt-1.5 text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-stone-200">
                  <button
                    onClick={() => setQuizStep(1)}
                    className="px-4 py-3 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={handleAddAllRecommended}
                    className="flex-1 py-3.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <RefreshCw className="w-4 h-4 text-emerald-300" />
                    Add Entire AI Routine to Cart
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
