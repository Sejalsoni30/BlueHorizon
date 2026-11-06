import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Cpu } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';

gsap.registerPlugin(ScrollTrigger);

export const DitherVisualSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [resolutionPct, setResolutionPct] = useState(25);
  const { lowBandwidth, prefersReducedMotion } = usePreferences();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || lowBandwidth) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;


    const drawDither = (resFactor: number) => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.fillStyle = '#0E0F10';
      ctx.fillRect(0, 0, width, height);

      // Pixel / dither step size decreases as user scrolls in (sharpening effect)
      const step = Math.max(4, Math.round(28 * (1 - resFactor)));

      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          const dx = x - width / 2;
          const dy = y - height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Simulated precipitation / moisture intensity
          const wave = Math.sin(x * 0.02) * Math.cos(y * 0.02) + Math.exp(-dist * 0.005);
          const intensity = Math.max(0, Math.min(1, (wave + 1) * 0.5));

          if (intensity > 0.45) {
            ctx.fillStyle = intensity > 0.75 ? '#5CFFB1' : '#1A1C1E';
            const radius = (step * 0.38) * intensity;
            ctx.beginPath();
            ctx.arc(x + step / 2, y + step / 2, radius, 0, Math.PI * 2);
            ctx.fill();
          } else if (intensity > 0.25) {
            ctx.fillStyle = '#FF7A2F';
            const radius = (step * 0.28) * (1 - intensity);
            ctx.beginPath();
            ctx.arc(x + step / 2, y + step / 2, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    drawDither(0.25);

    if (prefersReducedMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      end: 'bottom 40%',
      scrub: 0.5,
      onUpdate: (self) => {
        const factor = Math.min(1, Math.max(0.15, self.progress));
        setResolutionPct(Math.round(factor * 100));
        drawDither(factor);
      },
    });

    return () => trigger.kill();
  }, [lowBandwidth, prefersReducedMotion]);

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-graphite grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-graphite bg-carbon text-xs font-mono text-ash">
            <Cpu className="w-3.5 h-3.5 text-mint" />
            <span>04 // Conformal Spatial Resolution</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
            Coarse Satellite Heatmaps <span className="text-mint">Sharpened</span> to Local Cadastral Parcels
          </h2>

          <p className="text-xs sm:text-sm text-ash leading-relaxed">
            Standard global satellites deliver precipitation at 10km grid resolution. BlueHorizon fuses satellite reanalysis (NASA IMERG) with ground CWC hydro-telemetry and digital elevation models, resolving localized overland ponding at sub-catchment scale.
          </p>

          <div className="p-4 rounded-xl bg-carbon border border-graphite space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-ash">
              <span>Fidelity Synthesis:</span>
              <span className="text-mint font-bold">{resolutionPct}% Refined</span>
            </div>
            <div className="w-full bg-obsidian rounded-full h-2 overflow-hidden border border-graphite">
              <div
                className="bg-mint h-full rounded-full transition-all duration-150"
                style={{ width: `${resolutionPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-lg aspect-video rounded-2xl overflow-hidden border border-graphite bg-carbon shadow-2xl">
            <canvas
              ref={canvasRef}
              width={480}
              height={270}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-obsidian/85 border border-graphite text-[10px] font-mono text-ash flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-mint" />
              <span>Dither Matrix: 10km → 500m Downscaling</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
