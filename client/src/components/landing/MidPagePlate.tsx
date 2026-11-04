import React, { useState } from 'react';
import { Waves, Droplet, Sun, Layers, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoBadge } from '../common/DemoBadge';

export const MidPagePlate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="w-full py-20 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Central BlueHorizon Logo Trigger */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center justify-center w-20 h-20 rounded-full glass-panel border-2 border-cyan bg-deep/90 hover:scale-110 transition-all duration-300 cyan-border-glow cursor-pointer"
          aria-expanded={isOpen}
          aria-label="Expand Combined Flood and Drought Intelligence Plate"
        >
          <Waves
            className={`w-9 h-9 text-cyan transition-transform duration-500 ${
              isOpen ? 'rotate-180 scale-90' : 'group-hover:rotate-12'
            }`}
          />
          <div className="absolute -inset-2 rounded-full border border-cyan/30 animate-pulse pointer-events-none" />
        </button>

        <div className="space-y-1">
          <span className="text-xs uppercase font-mono tracking-widest text-cyan font-semibold">
            {isOpen ? 'Click to Fold Plate' : 'Click Horizon Portal'}
          </span>
          <h3 className="text-lg sm:text-xl font-display font-bold text-offwhite">
            Unifying The Two Hydro-Climatic Extremes
          </h3>
          <p className="text-xs text-offwhite/60 max-w-md mx-auto">
            Experience how BlueHorizon overcomes administrative silos to track both flood inundation and agricultural soil drought on one single canvas.
          </p>
        </div>
      </div>

      {/* Expanding Glass Plate */}
      <div
        className={`w-full max-w-5xl px-4 sm:px-6 transition-all duration-700 ease-out origin-top ${
          isOpen
            ? 'mt-8 opacity-100 scale-100 max-h-[800px]'
            : 'mt-0 opacity-0 scale-95 max-h-0 pointer-events-none overflow-hidden'
        }`}
      >
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan/30 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 border-b border-cyan/20">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan" />
              <span className="font-display font-semibold text-sm sm:text-base text-offwhite">
                Dual-Hazard Catchment View: Godavari-Marathwada Basin
              </span>
            </div>
            <DemoBadge />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Flood Dimension Card */}
            <div className="p-5 rounded-xl bg-deep/70 border border-cyan/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan">
                  <Droplet className="w-4 h-4 text-cyan" /> Rapid-Onset Flood Risk (48h)
                </span>
                <span className="text-xs font-mono text-cyan font-tabular">Level: 62.4m</span>
              </div>
              <p className="text-xs text-offwhite/70 leading-relaxed">
                Upper catchment rainfall of 110mm in 24 hours has propagated downstream. Warning level expected to be approached in 14 hours.
              </p>
              <div className="space-y-1.5 text-[11px] text-offwhite/60 pt-2 border-t border-cyan/10">
                <div className="flex justify-between">
                  <span>Forecast Horizon:</span>
                  <span className="text-offwhite font-mono">48 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Interval:</span>
                  <span className="text-cyan font-mono font-tabular">± 0.25 m (90% Conformal)</span>
                </div>
              </div>
            </div>

            {/* Drought Dimension Card */}
            <div className="p-5 rounded-xl bg-deep/70 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <Sun className="w-4 h-4 text-amber-400" /> Slow-Onset Agricultural Drought
                </span>
                <span className="text-xs font-mono text-amber-300 font-tabular">SPEI-3: -1.68</span>
              </div>
              <p className="text-xs text-offwhite/70 leading-relaxed">
                Persistent 4-week dry spell prior to storm created hardened soil crust, accelerating flash runoff coefficient while root-zone moisture remains stressed.
              </p>
              <div className="space-y-1.5 text-[11px] text-offwhite/60 pt-2 border-t border-amber-500/10">
                <div className="flex justify-between">
                  <span>Precipitation Deficit (30-day):</span>
                  <span className="text-amber-300 font-mono">-42% vs Normal</span>
                </div>
                <div className="flex justify-between">
                  <span>Root-Zone Soil Moisture:</span>
                  <span className="text-offwhite font-mono font-tabular">18% (Severe Deficit)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-ocean/20 border border-cyan/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-offwhite/80">
              <strong className="text-cyan">Compound Whiplash Detected: </strong>
              Extreme dry-to-flood transition increases flash flooding peak by 35% over dry cracked topsoil.
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan text-abyss font-semibold text-xs whitespace-nowrap hover:bg-cyan/90 transition-colors"
            >
              <span>Explore Unified GIS View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

