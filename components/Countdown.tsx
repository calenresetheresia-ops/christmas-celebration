
import React, { useState, useEffect, memo } from 'react';

const AnimatedNumber = memo(({ value }: { value: number }) => {
  const displayValue = value.toString().padStart(2, '0');
  
  return (
    <span 
      key={value} 
      className="inline-block animate-heartbeat text-3xl md:text-5xl font-bold text-white tracking-tighter"
    >
      {displayValue}
    </span>
  );
});

const SymbolWrapper = memo(({ value, type, label }: { value: number, type: 'tree' | 'ornament' | 'star' | 'snowflake', label: string }) => {
  const getPath = () => {
    switch (type) {
      case 'tree':
        return "M12 2L3 18H7V22H17V18H21L12 2Z"; 
      case 'ornament':
        return "M12 2C7.58 2 4 5.58 4 10C4 13.91 6.79 17.17 10.5 17.89V22H13.5V17.89C17.21 17.17 20 13.91 20 10C20 5.58 16.42 2 12 2ZM12 4C15.31 4 18 6.69 18 10C18 13.31 15.31 16 12 16C8.69 16 6 13.31 6 10C6 6.69 8.69 4 12 4Z";
      case 'star':
        return "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z";
      case 'snowflake':
        return "M20,11V13H15.91L18.5,15.59L17.09,17L13,12.91V18H15V20H13V22H11V20H9V18H11V12.91L6.91,17L5.5,15.59L8.09,13H4V11H8.09L5.5,8.41L6.91,7L11,11.09V6H9V4H11V2H13V4H15V6H13V11.09L17.09,7L18.5,8.41L15.91,11H20Z";
    }
  };

  const getSymbolColors = () => {
    switch (type) {
      case 'tree': return { bg: 'rgba(34, 197, 94, 0.2)', text: 'text-green-400' };
      case 'ornament': return { bg: 'rgba(239, 68, 68, 0.2)', text: 'text-red-400' };
      case 'star': return { bg: 'rgba(234, 179, 8, 0.2)', text: 'text-yellow-400' };
      case 'snowflake': return { bg: 'rgba(59, 130, 246, 0.2)', text: 'text-blue-400' };
    }
  };

  const colors = getSymbolColors();

  return (
    <div className="flex flex-col items-center px-4">
      <div className="relative w-28 h-28 md:w-40 md:h-40 flex items-center justify-center group">
        <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full drop-shadow-2xl transition-transform duration-500">
          <path 
            d={getPath()} 
            fill={colors.bg} 
            stroke="currentColor" 
            strokeWidth="0.5"
            className={`${colors.text} backdrop-blur-md opacity-80`}
          />
        </svg>
        <div className="relative z-10">
           <AnimatedNumber value={value} />
        </div>
      </div>
      <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] mt-4 text-red-100 font-bold opacity-70">
        {label}
      </span>
    </div>
  );
});

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isChristmas: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let christmas = new Date(currentYear, 11, 25);

      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25);
      }

      const difference = christmas.getTime() - now.getTime();

      if (difference <= 0) {
        if (now.getMonth() === 11 && now.getDate() === 25) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isChristmas: true });
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isChristmas: false
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft.isChristmas) {
    return (
      <div className="animate-bounce">
        <h2 className="text-4xl md:text-6xl festive-font text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">
          🎄 Merry Christmas! 🎄
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-12 px-4">
      <SymbolWrapper type="tree" label="Days" value={timeLeft.days} />
      <SymbolWrapper type="ornament" label="Hours" value={timeLeft.hours} />
      <SymbolWrapper type="star" label="Mins" value={timeLeft.minutes} />
      <SymbolWrapper type="snowflake" label="Secs" value={timeLeft.seconds} />
    </div>
  );
};

export default Countdown;
