import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Droplet, Sun, Layers, ArrowDown } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';

gsap.registerPlugin(ScrollTrigger);

export const PinnedMorphSection: React.FC = () => {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [morphPhase, setMorphPhase] = useState<'flood' | 'transition' | 'drought'>('flood');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { prefersReducedMotion } = usePreferences();

  useEffect(() => {
    if (prefersReducedMotion || !pinSectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: pinSectionRef.current,
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        if (self.progress < 0.35) {
          setMorphPhase('flood');
        } else if (self.progress < 0.65) {
          setMorphPhase('transition');
        } else {
          setMorphPhase('drought');
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [prefersReducedMotion]);

  // Interpolated colors and heights
  const isFlood = morphPhase === 'flood';
  const isDrought = morphPhase === 'drought';
  const waterLevelPct = Math.max(10, Math.round((1 - scrollProgress) * 90));

  return (
    <section
      ref={pinSectionRef}
      className="relative w-full min-h-screen bg-obsidian border-y border-graphite flex items-center justify-center overflow-hidden py-12"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Story Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-graphite bg-carbon font-mono text-xs text-ash">
            <Layers className="w-3.5 h-3.5 text-mint" />
            <span>02 // Compound Hydro-Climatic Dynamics</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-bone tracking-tight">
            {isFlood ? (
              <>Rapid-Onset <span className="text-mint mint-glow">Flood Wave</span></>
            ) : isDrought ? (
              <>Prolonged <span className="text-ember ember-glow">Soil Desiccation</span></>
            ) : (
              <>Compound <span className="text-bone">Climate Whiplash</span></>
            )}
          </h2>

          <div className="p-5 rounded-2xl glass-panel border border-graphite space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-ash uppercase tracking-wider">Dynamic Transition</span>
              <span className={isDrought ? 'text-ember' : 'text-mint'}>
                {Math.round(scrollProgress * 100)}% Drought Phase
              </span>
            </div>

            <p className="text-xs sm:text-sm text-ash leading-relaxed">
              {isFlood
                ? "During extreme rainfall surges, saturated soil repels moisture, channeling 80%+ of precipitation into swift overland runoff that inundates low-lying river wards."
                : isDrought
                ? "When dry spells persist over 28+ days, topsoil crunches into a baked impervious crust. The ground appears safe, but its cellular absorption capability is paralyzed."
                : "The Whiplash Hazard: When a monsoon downpour hits drought-parched ground, the baked soil acts like concrete, generating catastrophic flash flooding with zero infiltration."}
            </p>

            <div className="pt-3 border-t border-graphite flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-mint">
                <Droplet className="w-3.5 h-3.5" />
                <span>Flood Surge: {isFlood ? '+2.2m' : '+0.3m'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-ember">
                <Sun className="w-3.5 h-3.5" />
                <span>SPEI Deficit: {isDrought ? '-1.82' : '+0.15'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-ash/60">
            <ArrowDown className="w-3.5 h-3.5 text-mint animate-bounce" />
            <span>Scroll down to advance hydro-climatic transition</span>
          </div>
        </div>

        {/* Right Morph Visual Column */}
        <div ref={visualRef} className="lg:col-span-7 flex items-center justify-center">
          <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden glass-panel border border-graphite p-6 flex flex-col justify-between">
            {/* Background dynamic grid gradient */}
            <div
              className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 60% 40%, ${
                  scrollProgress > 0.5 ? 'rgba(255, 122, 47, 0.15)' : 'rgba(92, 255, 177, 0.15)'
                }, transparent 70%)`,
              }}
            />

            {/* Top Bar Indicators */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-graphite text-xs font-mono">
              <span className="text-bone font-medium">Catchment Simulation State</span>
              <span
                className={`px-2 py-0.5 rounded font-semibold border ${
                  isFlood
                    ? 'border-mint/30 bg-mint/10 text-mint'
                    : isDrought
                    ? 'border-ember/30 bg-ember/10 text-ember'
                    : 'border-bone/20 bg-carbon text-bone'
                }`}
              >
                {isFlood ? 'SURFACE INUNDATION' : isDrought ? 'CRUSTED DROUGHT' : 'TRANSITION STATE'}
              </span>
            </div>

            {/* Dynamic Morph Canvas / SVG Terrain Cross-Section */}
            <div className="relative z-10 flex-1 flex items-center justify-center my-4">
              <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="morphWater" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5CFFB1" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0E0F10" stopOpacity="0.95" />
                  </linearGradient>
                  <linearGradient id="morphDroughtSoil" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF7A2F" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#1A1C1E" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {/* Valley Terrain Contour */}
                <path
                  d="M 0,240 L 0,80 Q 120,160 220,185 Q 320,185 400,120 L 500,70 L 500,240 Z"
                  fill="#0E0F10"
                  stroke={scrollProgress > 0.5 ? '#FF7A2F' : '#5CFFB1'}
                  strokeWidth="2"
                  className="transition-colors duration-500"
                />

                {/* Water Volume (Rising during flood, retracting in drought) */}
                <path
                  d={`M 80,240 Q 220,${210 - (waterLevelPct * 1.1)} 360,${210 - (waterLevelPct * 1.1)} L 420,240 Z`}
                  fill={scrollProgress > 0.5 ? 'url(#morphDroughtSoil)' : 'url(#morphWater)'}
                  opacity={scrollProgress > 0.75 ? 0.25 : 0.85}
                  className="transition-all duration-300"
                />

                {/* Drought fissures / cracks (appear when progress > 0.5) */}
                {scrollProgress > 0.4 && (
                  <g stroke="#FF7A2F" strokeWidth="1.5" opacity={Math.min(1, (scrollProgress - 0.4) * 2.5)}>
                    <path d="M 160,190 L 175,205 L 170,225" />
                    <path d="M 230,195 L 245,210 L 260,205" />
                    <path d="M 310,180 L 325,200 L 320,220" />
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom Status Ticker */}
            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-graphite text-[11px] font-mono text-ash">
              <span>Model: LISFLOOD + Hargreaves SPEI</span>
              <span className="text-bone">Soil Saturation: {100 - Math.round(scrollProgress * 80)}%</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
