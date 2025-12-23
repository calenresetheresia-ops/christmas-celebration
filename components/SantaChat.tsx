
import React, { useState, useRef, useEffect } from 'react';
import { chatWithSanta } from '../services/geminiService';
import { Message } from '../types';

const SantaChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'santa', text: "Ho ho ho! Merry Christmas! I'm so glad you stopped by the workshop. Have you been naughty or nice this year?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithSanta(input, []);
      const santaMsg: Message = { id: (Date.now() + 1).toString(), role: 'santa', text: response || "Ho ho ho! Something went wrong with my magic!" };
      setMessages(prev => [...prev, santaMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl relative z-10">
      <div className="bg-[#c41e3a] p-4 flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-3xl">🎅</div>
        <div>
          <h2 className="text-xl font-bold text-white">Santa Claus</h2>
          <p className="text-xs text-red-100">Live from the North Pole</p>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              m.role === 'user' 
                ? 'bg-red-600 text-white rounded-tr-none' 
                : 'bg-white/20 text-white rounded-tl-none border border-white/10'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/20 text-white rounded-2xl rounded-tl-none px-4 py-2 animate-pulse">
              Santa is typing...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/5 border-t border-white/10 flex space-x-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Santa anything..."
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-white/50"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SantaChat;
