import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Hero3DScene } from './Hero3DScene';
import { RiskBadge } from '../common/RiskBadge';
import { DataQualityBadge } from '../common/DataQualityBadge';
import { DemoBadge } from '../common/DemoBadge';
import { ShieldCheck, TrendingUp } from 'lucide-react';

export const Hero3DCanvas: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Check WebGL availability and reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setUseFallback(true);
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setUseFallback(true);
    } catch {
      setUseFallback(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // tilt degrees
      const y = (e.clientY / innerHeight - 0.5) * -20;
      setTilt({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-[640px] md:h-[720px] overflow-hidden rounded-2xl border border-cyan/20 bg-abyss">
      {/* 3D WebGL Scene or Static Fallback */}
      {useFallback ? (
        <div className="absolute inset-0 bg-gradient-to-b from-ocean/20 via-deep to-abyss flex items-center justify-center">
          <div className="w-full h-full opacity-30 bg-[radial-gradient(#22D3EE_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 7], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <Hero3DScene />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Subtle vignette & ambient caustics */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-abyss via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-abyss/80 via-transparent to-abyss/40" />

      {/* Floating Interactive Tilting Glass Risk Card */}
      <div className="absolute inset-0 z-10 flex items-center justify-center sm:justify-end sm:pr-12 md:pr-20 p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-sm glass-panel p-6 rounded-2xl transition-transform duration-200 ease-out border border-cyan/30 shadow-2xl"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y * 0.7}deg) rotateY(${tilt.x * 0.7}deg)`,
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-cyan/15">
            <div className="flex items-center gap-2">
              <RiskBadge level="Elevated" />
              <DemoBadge />
            </div>
            <DataQualityBadge score={92} latencyHrs={0.4} />
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-display font-bold text-offwhite font-tabular">
                  78%
                </span>
                <span className="text-xs text-offwhite/60 ml-2">surge probability</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-cyan font-mono font-medium">90% Conf. Band</span>
                <p className="text-xs text-offwhite/80 font-tabular">+1.8m ± 0.3m</p>
              </div>
            </div>

            {/* Visual Probability Bar */}
            <div className="w-full bg-deep rounded-full h-2 overflow-hidden border border-cyan/15">
              <div
                className="bg-gradient-to-r from-teal to-cyan h-full rounded-full transition-all duration-1000"
                style={{ width: '78%' }}
              />
            </div>

            {/* Hyperlocal Plain-Language 'Why' */}
            <div className="p-2.5 rounded-lg bg-deep/80 border border-cyan/15 text-xs text-offwhite/80 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-cyan">
                <TrendingUp className="w-3.5 h-3.5 text-cyan" />
                <span>Primary Risk Driver</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Catchment soil saturation reached 86% following 74mm upstream downpour; low-lying drainage depressions at risk within 12 hours.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-offwhite/50 pt-2 border-t border-cyan/10">
              <span>Location: Godavari Basin (Sector 4)</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Sensor Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Headline Overlay (Left aligned) */}
      <div className="absolute inset-0 z-10 flex items-center justify-start p-6 sm:p-12 md:p-16 pointer-events-none">
        <div className="max-w-xl pointer-events-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan/30 bg-deep/60 backdrop-blur-md text-xs text-cyan">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            Complementary Intelligence Layer
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-offwhite tracking-tight leading-[1.1]">
            See the Risk. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-teal to-offwhite">
              Prepare Before It Happens.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-offwhite/70 leading-relaxed">
            BlueHorizon translates authoritative hydrometeorological forecasts into calibrated, explainable, and localized hazard intelligence. We don't replace government warnings—we make them trustworthy, localized, and actionable.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#interactive-teaser"
              className="px-5 py-2.5 rounded-lg bg-cyan text-abyss font-semibold text-xs sm:text-sm hover:bg-cyan/90 transition-all cyan-border-glow"
            >
              Explore What-If Teaser
            </a>
            <a
              href="/dashboard"
              className="px-5 py-2.5 rounded-lg glass-card text-offwhite hover:text-cyan border border-cyan/30 text-xs sm:text-sm font-medium transition-all"
            >
              Open Live Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
