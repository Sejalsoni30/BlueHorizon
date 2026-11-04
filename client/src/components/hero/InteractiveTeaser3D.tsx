import React, { useState } from 'react';
import { Sliders, Droplets, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoBadge } from '../common/DemoBadge';
import { RiskBadge, type RiskLevel } from '../common/RiskBadge';

export const InteractiveTeaser3D: React.FC = () => {
  const [rainfall, setRainfall] = useState(45); // mm
  const [soilMoisture, setSoilMoisture] = useState(60); // %

  // Heuristic calculation of simulated runoff water height and risk tier
  const simulatedSurge = ((rainfall / 150) * 2.2 + (soilMoisture / 100) * 1.5).toFixed(2);
  const surgeFloat = parseFloat(simulatedSurge);

  let riskTier: RiskLevel = 'Low';
  if (surgeFloat > 2.5) riskTier = 'High';
  else if (surgeFloat > 1.8) riskTier = 'Elevated';
  else if (surgeFloat > 1.0) riskTier = 'Watch';

  // Calculate terrain water fill visual height (0 to 100%)
  const waterHeightPct = Math.min(100, Math.max(10, (surgeFloat / 3.7) * 100));

  return (
    <section id="interactive-teaser" className="w-full py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/30 text-amber-400 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            Hypothetical scenario — not a forecast
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-offwhite">
            Interactive What-If Hazard Teaser
          </h2>
          <p className="text-xs sm:text-sm text-offwhite/70">
            Adjust precipitation and ground saturation below to see how antecedent soil conditions compound runoff velocity and flood wave emergence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel p-6 sm:p-8 rounded-2xl border border-cyan/20">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-offwhite uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan" /> Scenario Inputs
              </span>
              <DemoBadge />
            </div>

            {/* Slider 1: Rainfall */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label htmlFor="rainfall-slider" className="text-offwhite/80 font-medium flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan" /> 24-Hour Rainfall Surge
                </label>
                <span className="font-mono text-cyan font-tabular">{rainfall} mm</span>
              </div>
              <input
                id="rainfall-slider"
                type="range"
                min="0"
                max="180"
                step="5"
                value={rainfall}
                aria-label="24-Hour Rainfall Surge"
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full h-2 bg-deep rounded-lg appearance-none cursor-pointer accent-cyan"
              />
              <div className="flex justify-between text-[10px] text-offwhite/40">
                <span>0 mm (Normal)</span>
                <span>90 mm (Heavy)</span>
                <span>180 mm (Extreme)</span>
              </div>
            </div>

            {/* Slider 2: Soil Moisture */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <label htmlFor="soil-slider" className="text-offwhite/80 font-medium">
                  Antecedent Soil Saturation
                </label>
                <span className="font-mono text-cyan font-tabular">{soilMoisture}%</span>
              </div>
              <input
                id="soil-slider"
                type="range"
                min="10"
                max="100"
                step="5"
                value={soilMoisture}
                aria-label="Antecedent Soil Saturation"
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full h-2 bg-deep rounded-lg appearance-none cursor-pointer accent-cyan"
              />
              <div className="flex justify-between text-[10px] text-offwhite/40">
                <span>10% (Dry / Parched)</span>
                <span>50% (Normal)</span>
                <span>100% (Fully Saturated)</span>
              </div>
            </div>

            {/* Impact Readout */}
            <div className="p-4 rounded-xl bg-deep/80 border border-cyan/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-offwhite/70">Calculated Severity:</span>
                <RiskBadge level={riskTier} />
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-offwhite/70">Simulated Stage Surge:</span>
                <span className="text-xl font-bold font-mono text-cyan font-tabular">
                  +{simulatedSurge} m
                </span>
              </div>

              <p className="text-[11px] text-offwhite/60 leading-relaxed border-t border-cyan/10 pt-2">
                {soilMoisture > 80
                  ? 'High antecedent saturation suppresses infiltration; over 82% of precipitation converts immediately into fast overland discharge.'
                  : soilMoisture < 30
                  ? 'Desiccated soil absorbs initial 25mm before surface runoff initiates, delaying crest wave arrival.'
                  : 'Balanced absorption buffer active. Standard infiltration rates apply.'}
              </p>
            </div>

            <Link
              to="/simulator"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-ocean/40 hover:bg-ocean text-xs font-semibold text-offwhite border border-cyan/30 transition-all"
            >
              <span>Launch Full Multi-Catchment Simulator</span>
              <ArrowRight className="w-4 h-4 text-cyan" />
            </Link>
          </div>

          {/* 3D Visual Terrain Cross-Section */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden bg-abyss border border-cyan/20 p-4 flex flex-col justify-end">
              {/* Illustrative cross section with animated water fill */}
              <div className="absolute inset-0 bg-gradient-to-b from-ocean/10 to-transparent pointer-events-none" />

              {/* Topographic riverbed contour (SVG) */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
                {/* Valley Banks */}
                <path
                  d="M 0,200 L 0,80 Q 80,140 160,165 Q 240,165 320,130 L 400,70 L 400,200 Z"
                  fill="#071B34"
                  stroke="#14B8A6"
                  strokeWidth="1.5"
                />

                {/* Dynamic Water Volume Polygon */}
                <path
                  d={`M 80,200 Q 160,${180 - waterHeightPct * 0.8} 240,${180 - waterHeightPct * 0.8} L 320,200 Z`}
                  fill="url(#waterGrad)"
                  opacity="0.8"
                />

                {/* Benchmarks (Danger & Warning Levels) */}
                <line x1="60" y1="110" x2="340" y2="110" stroke="#EF4444" strokeWidth="1" strokeDasharray="4 4" />
                <text x="345" y="113" fill="#EF4444" fontSize="8" fontFamily="monospace">Danger Level (DL)</text>

                <line x1="75" y1="135" x2="325" y2="135" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" />
                <text x="330" y="138" fill="#F59E0B" fontSize="8" fontFamily="monospace">Warning Level (WL)</text>

                <defs>
                  <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0A4D8C" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Community Ground Pin Callouts on Terrain */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-deep/90 border border-cyan/30 text-[10px] text-offwhite">
                <span className="w-2 h-2 rounded-full bg-cyan animate-ping" />
                <span>Station Gauge 41-B (Live)</span>
              </div>

              <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded bg-deep/90 border border-emerald-500/30 text-[10px] text-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>2 Verified Citizen Reports (Illustrative)</span>
              </div>

              <div className="relative z-10 flex justify-between items-center text-xs text-offwhite/50 pt-2 border-t border-cyan/10">
                <span>Cross-Section: Sub-Catchment B4</span>
                <span className="font-mono text-cyan">Water Depth: {simulatedSurge} m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
