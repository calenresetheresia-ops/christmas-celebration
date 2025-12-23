
import React, { useState } from 'react';
import { generateChristmasCard } from '../services/geminiService';
import { CardState } from '../types';

const CardStudio: React.FC = () => {
  const [state, setState] = useState<CardState>({
    image: null,
    message: '',
    loading: false
  });
  const [theme, setTheme] = useState('');

  const handleGenerate = async () => {
    if (!theme.trim() || state.loading) return;
    setState(prev => ({ ...prev, loading: true }));
    try {
      const result = await generateChristmasCard(theme);
      setState({
        image: result.image,
        message: result.message,
        loading: false
      });
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10 px-4">
      <div className="text-center space-y-2">
        <h2 className="text-5xl festive-font text-white drop-shadow-lg">Magic Card Studio</h2>
        <p className="text-red-200">Describe a scene, and we'll paint it for your Christmas card!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">Describe your card theme</label>
            <textarea 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., A cozy cabin in a snowy forest with a glowing Christmas tree outside..."
              className="w-full h-32 bg-white/5 border border-white/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={state.loading}
            className="w-full bg-[#c41e3a] hover:bg-[#a31830] text-white py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-xl"
          >
            {state.loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Summoning Magic...
              </span>
            ) : "Generate Magic Card"}
          </button>
        </div>

        <div className="glass rounded-3xl p-4 flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/20">
          {state.image ? (
            <div className="w-full space-y-4 animate-in fade-in duration-700">
              <img src={state.image} alt="Christmas Card" className="w-full rounded-2xl shadow-2xl" />
              <div className="bg-white/10 p-4 rounded-xl text-center italic text-lg festive-font text-red-100">
                "{state.message}"
              </div>
            </div>
          ) : (
            <div className="text-center text-white/30 space-y-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Your creation will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardStudio;
