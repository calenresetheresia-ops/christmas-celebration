
import React, { useState } from 'react';
import { suggestGifts } from '../services/geminiService';
import { GiftIdea } from '../types';

const GiftElf: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [interests, setInterests] = useState('');
  const [ideas, setIdeas] = useState<GiftIdea[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetIdeas = async () => {
    if (!recipient.trim() || !interests.trim() || loading) return;
    setLoading(true);
    try {
      const result = await suggestGifts(recipient, interests);
      setIdeas(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative z-10">
      <div className="text-center mb-10">
        <h2 className="text-5xl festive-font mb-2">Gift Idea Elf</h2>
        <p className="text-red-200">Stuck on what to buy? Let the elves help!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 glass p-6 rounded-3xl space-y-6 self-start">
          <div>
            <label className="block text-sm mb-1 text-white/70">Who is it for?</label>
            <input 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g., Brother, Wife, Best Friend"
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/70">What do they love?</label>
            <textarea 
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Hiking, retro gaming, artisan coffee..."
              className="w-full h-32 bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button 
            onClick={handleGetIdeas}
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center space-x-2"
          >
            {loading ? "Searching Workshop..." : "Ask the Elves"}
          </button>
        </div>

        <div className="md:col-span-2 space-y-4">
          {ideas.length > 0 ? (
            ideas.map((idea, idx) => (
              <div 
                key={idx} 
                className="glass p-6 rounded-2xl hover:bg-white/15 transition-all border-l-4 border-green-500 animate-in slide-in-from-right duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-green-400">{idea.item}</h3>
                  <span className="text-xs bg-green-900/50 text-green-100 px-2 py-1 rounded-full">{idea.estimatedPrice}</span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{idea.reason}</p>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center glass rounded-3xl opacity-50 border-dashed border-2 border-white/10">
              <div className="text-center">
                <div className="text-5xl mb-4">🎁</div>
                <p>Fill out the form to see gift ideas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftElf;
