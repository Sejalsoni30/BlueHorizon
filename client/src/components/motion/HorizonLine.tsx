import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePreferences } from '../../context/PreferencesContext';

gsap.registerPlugin(ScrollTrigger);

export const HorizonLine: React.FC = () => {
  const lineRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [currentSection, setCurrentSection] = useState('01');
  const { lowBandwidth, prefersReducedMotion } = usePreferences();

  useEffect(() => {
    if (prefersReducedMotion || !lineRef.current) return;

    const path = lineRef.current;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      onUpdate: (self) => {
        const drawLength = pathLength * (1 - self.progress);
        gsap.to(path, {
          strokeDashoffset: drawLength,
          duration: 0.1,
          ease: 'none',
        });
        setScrollPct(Math.round(self.progress * 100));

        // Section tracker
        if (self.progress < 0.15) setCurrentSection('01');
        else if (self.progress < 0.35) setCurrentSection('02');
        else if (self.progress < 0.55) setCurrentSection('03');
        else if (self.progress < 0.75) setCurrentSection('04');
        else if (self.progress < 0.9) setCurrentSection('05');
        else setCurrentSection('06');
      },
    });

    return () => {
      trigger.kill();
    };
  }, [prefersReducedMotion]);

  if (lowBandwidth) return null;

  return (
    <>
      {/* Top Fixed Scroll Progress Bar (Mint) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-graphite/40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-mint via-mint to-ember transition-all duration-75"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      {/* Floating Side Section Index (01 / 02 / ...) */}
      <aside aria-label="Page section progress" className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 pointer-events-none">
        <span className="font-mono text-xs font-semibold text-mint">{currentSection}</span>
        <div className="w-[1px] h-12 bg-graphite relative overflow-hidden">
          <div
            className="w-full bg-mint transition-all duration-150 absolute top-0"
            style={{ height: `${scrollPct}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-ash/40">06</span>
      </aside>

      {/* Background SVG Horizon Waterline */}
      <div
        ref={containerRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden opacity-35"
        aria-hidden="true"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 4000"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="horizonMintGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5CFFB1" stopOpacity="0.8" />
              <stop offset="65%" stopColor="#5CFFB1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF7A2F" stopOpacity="0.75" />
            </linearGradient>
            <filter id="mintBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Guide Path */}
          <path
            d="M 180,0 C 450,450 120,950 620,1400 C 1120,1850 280,2400 900,3000 C 1280,3450 680,3850 720,4000"
            stroke="#1A1C1E"
            strokeWidth="2"
          />

          {/* Luminous reactive waterline */}
          <path
            ref={lineRef}
            d="M 180,0 C 450,450 120,950 620,1400 C 1120,1850 280,2400 900,3000 C 1280,3450 680,3850 720,4000"
            stroke="url(#horizonMintGlow)"
            strokeWidth="2.5"
            filter="url(#mintBlur)"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
};
