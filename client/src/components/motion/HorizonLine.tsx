import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HorizonLine: React.FC = () => {
  const lineRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !lineRef.current) return;

    const path = lineRef.current;
    const pathLength = path.getTotalLength();

    // Prepare line for dash animation
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        const drawLength = pathLength * (1 - self.progress);
        gsap.to(path, {
          strokeDashoffset: drawLength,
          duration: 0.1,
          ease: 'none',
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden opacity-40 md:opacity-60"
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
          <linearGradient id="horizonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0A4D8C" stopOpacity="0.7" />
          </linearGradient>
          <filter id="glowBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient shadow guide path */}
        <path
          d="M 200,0 C 450,400 150,900 600,1400 C 1100,1900 300,2400 900,3000 C 1300,3400 700,3800 720,4000"
          stroke="#071B34"
          strokeWidth="3"
        />

        {/* Luminous reactive waterline */}
        <path
          ref={lineRef}
          d="M 200,0 C 450,400 150,900 600,1400 C 1100,1900 300,2400 900,3000 C 1300,3400 700,3800 720,4000"
          stroke="url(#horizonGlow)"
          strokeWidth="2.5"
          filter="url(#glowBlur)"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

