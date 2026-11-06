import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Hero3DScene } from './Hero3DScene';
import { RiskBadge } from '../common/RiskBadge';
import { DataQualityBadge } from '../common/DataQualityBadge';
import { DemoBadge } from '../common/DemoBadge';
import { ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';
import { motion } from 'framer-motion';

export const Hero3DCanvas: React.FC<{ scrollProgress?: number }> = ({ scrollProgress = 0 }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = useState(true);
  const { lowBandwidth, prefersReducedMotion } = usePreferences();

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * -16;
      setTilt({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  const useFallback = !hasWebGL || lowBandwidth || prefersReducedMotion;

  // Staggered character reveal configuration
  const titleLine1 = "See the Risk.";
  const titleLine3 = "It Happens.";

  return (
    <div className="relative w-full min-h-[660px] md:min-h-[760px] overflow-hidden rounded-3xl border border-graphite bg-obsidian">
      {/* 3D WebGL Fluid Canvas or Dark Carbon Static Fallback */}
      {useFallback ? (
        <div className="absolute inset-0 bg-gradient-to-b from-carbon via-obsidian to-obsidian flex items-center justify-center">
          <div className="w-full h-full opacity-25 bg-[radial-gradient(#5CFFB1_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 6.5], fov: 42 }}
            dpr={[1, 2]}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <Hero3DScene scrollProgress={scrollProgress} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Atmospheric vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-obsidian/90 via-transparent to-obsidian/40" />

      {/* Main Grid Content */}
      <div className="relative z-10 w-full min-h-[660px] md:min-h-[760px] p-6 sm:p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Column: Masked Typography */}
        <div className="max-w-2xl space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-mint/25 bg-carbon/80 backdrop-blur-md text-xs font-mono text-mint">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            Complementary Intelligence Layer
          </div>

          <h1 className="font-display font-extrabold tracking-tight text-bone text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] leading-[1.04]">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%', rotate: 3 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {titleLine1}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%', rotate: 3 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 0.95, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                <span className="text-mint mint-glow font-bold">Prepare</span> Before
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '100%', rotate: 3 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1.0, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-ash/90"
              >
                {titleLine3}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-ash max-w-lg leading-relaxed"
          >
            BlueHorizon enhances government hydrometeorological forecasts through reliable data interpretation, explainable risk assessments, and personalized actionability.
          </motion.p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#story-start"
              className="group px-6 py-3 rounded-xl bg-mint text-obsidian font-bold text-xs sm:text-sm hover:bg-mint/90 transition-all mint-border-glow flex items-center gap-2"
            >
              <span>Explore The System</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-carbon hover:bg-graphite border border-graphite text-bone text-xs sm:text-sm font-semibold transition-all hover:border-mint/40"
            >
              Live Intelligence Canvas
            </a>
          </div>
        </div>

        {/* Right Column: Tilting Glass Risk Assessment Card */}
        <div className="w-full max-w-sm flex-shrink-0">
          <div
            className="w-full glass-panel-mint p-6 rounded-2xl border border-mint/25 shadow-2xl transition-transform duration-200 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${tilt.y * 0.6}deg) rotateY(${tilt.x * 0.6}deg)`,
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-graphite">
              <div className="flex items-center gap-2">
                <RiskBadge level="Elevated" />
                <DemoBadge />
              </div>
              <DataQualityBadge score={92} latencyHrs={0.4} />
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-display font-extrabold text-bone font-tabular">
                    78%
                  </span>
                  <span className="text-xs text-ash ml-2 font-mono">surge probability</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-mint font-mono font-semibold">90% Conf. Band</span>
                  <p className="text-xs text-bone font-tabular font-medium">+1.8m ± 0.3m</p>
                </div>
              </div>

              {/* Visual Probability Bar */}
              <div className="w-full bg-obsidian rounded-full h-2 overflow-hidden border border-graphite">
                <div
                  className="bg-gradient-to-r from-mint to-mint h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_#5CFFB1]"
                  style={{ width: '78%' }}
                />
              </div>

              {/* Hyperlocal Plain-Language 'Why' */}
              <div className="p-3.5 rounded-xl bg-carbon/90 border border-graphite text-xs text-ash space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-mint">
                  <TrendingUp className="w-3.5 h-3.5 text-mint" />
                  <span>Primary Risk Driver</span>
                </div>
                <p className="text-[11px] leading-relaxed text-ash">
                  Catchment soil saturation reached 86% following 74mm upstream downpour; low-lying drainage depressions at risk within 12 hours.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ash/70 pt-2 border-t border-graphite">
                <span>Location: Godavari Basin (Sector 4)</span>
                <span className="flex items-center gap-1 text-mint font-mono">
                  <ShieldCheck className="w-3 h-3" /> Telemetry Verified
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
