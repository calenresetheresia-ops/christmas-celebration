
import React, { useState, useEffect } from 'react';

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
      let christmas = new Date(currentYear, 11, 25); // December is month 11 (0-indexed)

      // If Christmas has passed this year, count down to next year
      if (now > christmas) {
        christmas = new Date(currentYear + 1, 11, 25);
      }

      const difference = christmas.getTime() - now.getTime();

      if (difference <= 0) {
        // It's Christmas! (Check if it's the 25th specifically)
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
        <h2 className="text-4xl md:text-6xl festive-font text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
          🎄 Merry Christmas! 🎄
        </h2>
      </div>
    );
  }

  const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center px-3 md:px-6">
      <div className="glass w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg border-red-500/30">
        <span className="text-2xl md:text-4xl font-bold text-white drop-shadow-sm">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] md:text-xs uppercase tracking-widest mt-2 text-red-200 font-bold">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-center space-x-1 md:space-x-4 animate-in fade-in zoom-in duration-1000">
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-xl md:text-3xl text-white/30 pt-4">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-xl md:text-3xl text-white/30 pt-4">:</div>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <div className="text-xl md:text-3xl text-white/30 pt-4">:</div>
      <TimeUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default Countdown;
