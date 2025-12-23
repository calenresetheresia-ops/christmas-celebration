
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

/* Fix: Define AIStudio interface to resolve conflict with existing declarations on Window */
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    /* Fix: Using readonly to match potential global modifiers and identifying the AIStudio type */
    readonly aistudio: AIStudio;
  }
}

const SantaVideo: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'checking' | 'needs_key' | 'generating' | 'ready' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const checkKeyAndGenerate = async () => {
    try {
      setStatus('checking');
      const hasKey = await window.aistudio.hasSelectedApiKey();
      
      if (!hasKey) {
        setStatus('needs_key');
        return;
      }

      await generateSanta();
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to check API key status.');
    }
  };

  const handleOpenKeyDialog = async () => {
    await window.aistudio.openSelectKey();
    // Proceed assuming key selection was successful to avoid race condition
    generateSanta();
  };

  const generateSanta = async () => {
    setStatus('generating');
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure current API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'A jolly high-quality 2D cartoon Santa Claus with a large red sack of colorful gifts, walking smoothly in a side-view walk cycle, festive colors, bright snowy night background, loopable animation, high frame rate.',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9' // Fix: Veo models only support 16:9 or 9:16 aspect ratios
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        // Append API key when fetching from the download link
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoResponse.blob();
        setVideoUrl(URL.createObjectURL(blob));
        setStatus('ready');
      } else {
        throw new Error('No video URI returned');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setStatus('needs_key');
      } else {
        setStatus('error');
        setErrorMessage('Santa got stuck in a chimney! Please try again.');
      }
    }
  };

  useEffect(() => {
    checkKeyAndGenerate();
  }, []);

  if (status === 'checking') return null;

  if (status === 'needs_key') {
    return (
      <div className="fixed bottom-10 left-10 z-50 animate-bounce">
        <button 
          onClick={handleOpenKeyDialog}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold shadow-2xl border-2 border-white/20 flex items-center space-x-2"
        >
          <span>🎅 Summon Video Santa</span>
        </button>
        <p className="text-[10px] text-white/50 mt-2 text-center">Requires paid API key</p>
      </div>
    );
  }

  if (status === 'generating') {
    return (
      <div className="fixed bottom-10 left-10 z-50 glass p-4 rounded-2xl flex items-center space-x-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <div className="text-sm">
          <p className="font-bold text-red-400">Preparing Santa...</p>
          <p className="text-xs opacity-60">Polishing the sleigh (approx 1 min)</p>
        </div>
      </div>
    );
  }

  if (status === 'ready' && videoUrl) {
    return (
      <div className="santa-video-container">
        <div className="video-wrapper">
          <video 
            src={videoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover scale-110"
          />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-10 left-10 z-50 bg-red-900/80 p-3 rounded-lg text-xs">
        {errorMessage}
        <button onClick={checkKeyAndGenerate} className="ml-2 underline">Retry</button>
      </div>
    );
  }

  return null;
};

export default SantaVideo;
