import React, { useState, useEffect } from 'react';
import { Waves } from 'lucide-react';

interface LoaderRingProps {
  onComplete: () => void;
}

export const LoaderRing: React.FC<LoaderRingProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isFolding, setIsFolding] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);

  useEffect(() => {
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

          // Trigger curtain split after logo folds
          setTimeout(() => {
            setCurtainOpen(true);
            setTimeout(() => {
              onComplete();
            }, 600);
          }, 500);

          return 100;
        }
        const step = Math.max(1, Math.floor((100 - prev) * 0.14));
        return Math.min(100, prev + step);
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('bh_loader_seen', 'true');
    onComplete();
  };

  const strokeDash = 283;
  const strokeOffset = strokeDash - (strokeDash * count) / 100;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden pointer-events-auto" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={100}>
      {/* Top Half Curtain */}
      <div
        className={`absolute top-0 left-0 right-0 h-1/2 bg-obsidian transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-b border-mint/20 ${
          curtainOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
      />

      {/* Bottom Half Curtain */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/2 bg-obsidian transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-t border-mint/20 ${
          curtainOpen ? 'translate-y-full' : 'translate-y-0'
        }`}
      />

      {/* Center Ring & Counter */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${
          curtainOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div
          className={`relative flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isFolding ? 'scale-75 rotate-180' : 'scale-100'
          }`}
        >
          <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-graphite stroke-current"
              strokeWidth="2.5"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-mint stroke-current transition-all duration-75 ease-out"
              strokeWidth="3"
              strokeDasharray={strokeDash}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ filter: 'drop-shadow(0 0 10px rgba(92, 255, 177, 0.7))' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {isFolding ? (
              <Waves className="w-7 h-7 text-mint animate-pulse" />
            ) : (
              <span className="font-mono font-bold text-base text-bone font-tabular">
                {count}%
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2.5">
          <span className="text-[11px] uppercase tracking-widest text-ash font-mono">
            Calibrating Environmental Intelligence...
          </span>
          <button
            onClick={handleSkip}
            className="text-[11px] font-mono text-mint hover:underline underline-offset-4 transition-colors"
          >
            Skip [Esc]
          </button>
        </div>
      </div>
    </div>
  );
};
