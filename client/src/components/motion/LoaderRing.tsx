import React, { useState, useEffect } from 'react';
import { Waves } from 'lucide-react';

interface LoaderRingProps {
  onComplete: () => void;
}

export const LoaderRing: React.FC<LoaderRingProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isFolding, setIsFolding] = useState(false);

  useEffect(() => {
    // Check reduced motion or previous session view
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenLoader = sessionStorage.getItem('bh_loader_seen');

    if (prefersReducedMotion || hasSeenLoader === 'true') {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFolding(true);
          sessionStorage.setItem('bh_loader_seen', 'true');
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        // Smooth logarithmic pacing
        const step = Math.max(1, Math.floor((100 - prev) * 0.12));
        return Math.min(100, prev + step);
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('bh_loader_seen', 'true');
    onComplete();
  };

  const strokeDash = 283; // 2 * pi * 45
  const strokeOffset = strokeDash - (strokeDash * count) / 100;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-abyss transition-opacity duration-700 ${
        isFolding ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="progressbar"
      aria-valuenow={count}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`relative flex items-center justify-center transition-all duration-700 ${
          isFolding ? 'scale-50 rotate-180' : 'scale-100'
        }`}
      >
        <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="text-deep stroke-current"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="text-cyan stroke-current transition-all duration-75 ease-out"
            strokeWidth="3.5"
            strokeDasharray={strokeDash}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ filter: 'drop-shadow(0 0 8px #22D3EE)' }}
          />
        </svg>

        {/* Center content / logo icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {isFolding ? (
            <Waves className="w-8 h-8 text-cyan animate-pulse" />
          ) : (
            <span className="font-display font-semibold text-lg text-offwhite font-tabular">
              {count}%
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-offwhite/50 font-display">
          Initializing Environmental Intelligence...
        </span>
        <button
          onClick={handleSkip}
          className="text-xs text-cyan/70 hover:text-cyan underline underline-offset-4 transition-colors"
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
};

