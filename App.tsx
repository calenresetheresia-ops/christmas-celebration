
import React from 'react';
import Snowfall from './components/Snowfall';
import Countdown from './components/Countdown';

const App: React.FC = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Snowfall */}
      <Snowfall />

      {/* Magical Aura Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center space-y-12 animate-in fade-in duration-1000">
        <header>
          <h1 className="text-7xl md:text-9xl text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] festive-font mb-2">
            Christmas Magic
          </h1>
          <div className="h-1 w-32 md:w-64 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-4 opacity-50"></div>
        </header>
        
        <div className="scale-110 md:scale-150 transform transition-transform duration-700">
          <Countdown />
        </div>

        <div className="pt-8">
           <p className="text-red-200/60 text-sm md:text-base font-light tracking-[0.3em] uppercase">
            The North Pole Awaits
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
