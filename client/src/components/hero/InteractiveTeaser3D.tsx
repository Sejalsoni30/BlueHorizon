import React, { useState } from 'react';
import { Sliders, Droplets, AlertTriangle, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoBadge } from '../common/DemoBadge';
import { RiskBadge, type RiskLevel } from '../common/RiskBadge';

export const InteractiveTeaser3D: React.FC = () => {
  const [rainfall, setRainfall] = useState(65); // mm
  const [soilMoisture, setSoilMoisture] = useState(70); // %

  // Heuristic calculation of simulated runoff water height and risk tier
  const simulatedSurge = ((rainfall / 150) * 2.2 + (soilMoisture / 100) * 1.5).toFixed(2);
  const surgeFloat = parseFloat(simulatedSurge);

  let riskTier: RiskLevel = 'Low';
  if (surgeFloat > 2.5) riskTier = 'High';
  else if (surgeFloat > 1.8) riskTier = 'Elevated';
  else if (surgeFloat > 1.0) riskTier = 'Watch';

  const waterHeightPct = Math.min(100, Math.max(10, (surgeFloat / 3.7) * 100));

  return (
    <section id="interactive-teaser" className="w-full py-24 sm:py-32 scroll-mt-20 border-b border-graphite bg-obsidian">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-ember/30 bg-ember/10 text-ember text-xs font-mono font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            05 // Hypothetical scenario — not a forecast
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-bone tracking-tight">
            Stress-Test Watershed <span className="text-mint">Runoff Limits</span>
          </h2>
          <p className="text-xs sm:text-sm text-ash leading-relaxed">
            Drag the rainfall volume and antecedent soil moisture sliders to observe how dry-crusted versus saturated catchments react to sudden cloudburst forcing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel p-6 sm:p-10 rounded-3xl border border-graphite">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-graphite">
              <span className="text-xs font-semibold text-bone uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-mint" /> Scenario Parameters
              </span>
              <DemoBadge />
            </div>

            {/* Slider 1: Rainfall */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="rainfall-slider" className="text-ash font-medium flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-mint" /> 24h Downpour Volume
                </label>
                <span className="text-mint font-bold font-tabular">{rainfall} mm</span>
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
                className="w-full h-2 bg-carbon rounded-lg appearance-none cursor-pointer accent-mint"
              />
              <div className="flex justify-between text-[10px] font-mono text-ash/40">
                <span>0 mm (Normal)</span>
                <span>90 mm (Heavy)</span>
                <span>180 mm (Extreme)</span>
              </div>
            </div>

            {/* Slider 2: Soil Moisture */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <label htmlFor="soil-slider" className="text-ash font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-ember" /> Antecedent Soil Moisture
                </label>
                <span className="text-ember font-bold font-tabular">{soilMoisture}%</span>
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
                className="w-full h-2 bg-carbon rounded-lg appearance-none cursor-pointer accent-ember"
              />
              <div className="flex justify-between text-[10px] font-mono text-ash/40">
                <span>10% (Crusted Dry)</span>
                <span>50% (Normal)</span>
                <span>100% (Saturated)</span>
              </div>
            </div>

            {/* Impact Readout */}
            <div className="p-5 rounded-2xl bg-carbon border border-graphite space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ash font-mono">Simulated Severity:</span>
                <RiskBadge level={riskTier} />
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xs text-ash font-mono">Hydraulic Stage Surge:</span>
                <span className="text-2xl font-bold font-mono text-mint font-tabular">
                  +{simulatedSurge} m
                </span>
              </div>

              <p className="text-[11px] text-ash/80 leading-relaxed border-t border-graphite pt-3">
                {soilMoisture > 80
                  ? 'High antecedent saturation suppresses infiltration; over 82% of precipitation converts immediately into swift overland discharge.'
                  : soilMoisture < 30
                  ? 'Desiccated soil absorbs initial 25mm before surface runoff initiates, delaying crest wave arrival.'
                  : 'Standard infiltration buffer active. Baseline sub-catchment percolation applies.'}
              </p>
            </div>

            <Link
              to="/simulator"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-carbon hover:bg-graphite text-xs font-bold text-bone border border-graphite hover:border-mint/40 transition-all font-mono"
            >
              <span>Launch Multi-Parameter Simulator</span>
              <ArrowRight className="w-4 h-4 text-mint" />
            </Link>
          </div>

          {/* 3D Visual Terrain Cross-Section */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-carbon border border-graphite p-6 flex flex-col justify-end">
              <div className="absolute inset-0 bg-gradient-to-b from-mint/5 via-transparent to-transparent pointer-events-none" />

              {/* Topographic riverbed contour (SVG) */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
                {/* Valley Banks */}
                <path
                  d="M 0,200 L 0,80 Q 80,140 160,165 Q 240,165 320,130 L 400,70 L 400,200 Z"
                  fill="#060606"
                  stroke="#1A1C1E"
                  strokeWidth="2"
                />

                {/* Dynamic Water Volume Polygon */}
                <path
                  d={`M 80,200 Q 160,${180 - waterHeightPct * 0.8} 240,${180 - waterHeightPct * 0.8} L 320,200 Z`}
                  fill="url(#waterGradMint)"
                  opacity="0.88"
                />

                {/* Benchmarks (Danger & Warning Levels) */}
                <line x1="60" y1="110" x2="340" y2="110" stroke="#FF4D5E" strokeWidth="1" strokeDasharray="4 4" />
                <text x="345" y="113" fill="#FF4D5E" fontSize="8" fontFamily="monospace">Danger Level (DL)</text>

                <line x1="75" y1="135" x2="325" y2="135" stroke="#FFD166" strokeWidth="1" strokeDasharray="4 4" />
                <text x="330" y="138" fill="#FFD166" fontSize="8" fontFamily="monospace">Warning Level (WL)</text>

                <defs>
                  <linearGradient id="waterGradMint" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5CFFB1" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0E0F10" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Callout markers */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian/85 border border-mint/30 text-[11px] text-bone font-mono">
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                <span>Station Gauge 41-B (Live)</span>
              </div>

              <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian/85 border border-graphite text-[11px] text-ash font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-mint" />
                <span>2 Field Ground Pings (Illustrative)</span>
              </div>

              <div className="relative z-10 flex justify-between items-center text-xs text-ash pt-3 border-t border-graphite font-mono">
                <span>Reach: Godavari Sub-Basin 04</span>
                <span className="text-mint font-bold">Water Stage: {simulatedSurge} m</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
