import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { StatutoryNotice } from '../components/common/StatutoryNotice';
import { RiskBadge, type RiskLevel } from '../components/common/RiskBadge';
import {
  Sliders,
  AlertTriangle,
  Droplets,
  Gauge,
  Activity,
  Waves,
  RotateCcw,
} from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const [rainfallMm, setRainfallMm] = useState(85);
  const [soilSaturationPct, setSoilSaturationPct] = useState(75);
  const [damReleaseCusecs, setDamReleaseCusecs] = useState(15000);
  const [basinType, setBasinType] = useState<'urban' | 'agrarian' | 'steep_valley'>('agrarian');

  const handleReset = () => {
    setRainfallMm(50);
    setSoilSaturationPct(50);
    setDamReleaseCusecs(5000);
    setBasinType('agrarian');
  };

  // Hydrodynamic Surrogate Heuristic Formula
  // 1. Runoff coefficient (C): higher in urban/steep, exacerbated by saturated soil
  const baseC = basinType === 'urban' ? 0.75 : basinType === 'steep_valley' ? 0.65 : 0.4;
  const saturationMultiplier = 1.0 + (soilSaturationPct / 100) * 0.8;
  const effectiveC = Math.min(0.95, baseC * saturationMultiplier);

  // 2. Peak stage surge (m)
  const rainSurge = (rainfallMm * effectiveC) * 0.025;
  const damSurge = (damReleaseCusecs / 10000) * 0.45;
  const totalSurgeM = Number((rainSurge + damSurge).toFixed(2));

  // 3. Time to Peak Crest (hours)
  const lagBase = basinType === 'urban' ? 3 : basinType === 'steep_valley' ? 4 : 12;
  const crestTimeHrs = Math.max(1.5, Math.round(lagBase * (1.2 - (soilSaturationPct / 200))));

  // 4. Inundation radius estimate (km)
  const inundationRadiusKm = Number((totalSurgeM * 0.85).toFixed(1));

  let riskTier: RiskLevel = 'Low';
  if (totalSurgeM > 3.0) riskTier = 'High';
  else if (totalSurgeM > 1.8) riskTier = 'Elevated';
  else if (totalSurgeM > 1.0) riskTier = 'Watch';

  return (
    <div className="min-h-screen bg-obsidian text-bone flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Persistent Prominent Hypothetical Banner */}
        <div className="p-4 rounded-xl border border-ember/40 bg-ember/10 text-ember text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-ember flex-shrink-0" />
            <span>
              <strong>HYPOTHETICAL PLANNING SCENARIO — NOT AN OFFICIAL FORECAST. </strong>
              This interactive surrogate model is designed for disaster preparedness stress-testing and training exercises.
            </span>
          </div>
          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded bg-carbon border border-ember/40 text-bone hover:text-ember text-xs flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <StatutoryNotice />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Scenario Control Form */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-7 rounded-2xl border border-graphite space-y-6">
            <div className="pb-3 border-b border-graphite flex items-center justify-between">
              <h3 className="font-semibold text-sm text-bone flex items-center gap-2">
                <Sliders className="w-4 h-4 text-mint" /> Hydro-Meteorological Forcing Controls
              </h3>
              <span className="text-[11px] font-mono text-mint">Surrogate Model</span>
            </div>

            <div className="space-y-5 text-xs">
              {/* Basin Topography Selector */}
              <div className="space-y-1.5">
                <label className="text-ash font-medium">Catchment Topography & Drainage</label>
                <select
                  value={basinType}
                  onChange={(e) => setBasinType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-carbon border border-graphite text-bone focus:border-mint focus:outline-none"
                >
                  <option value="agrarian">Agrarian River Basin (Moderate Infiltration)</option>
                  <option value="urban">Dense Urban Catchment (High Impervious Concrete)</option>
                  <option value="steep_valley">Steep Valley Catchment (High Velocity Runoff)</option>
                </select>
              </div>

              {/* Slider 1: 24h Precipitation */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="sim-rain" className="text-ash font-medium flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-mint" /> 24h Downpour Volume
                  </label>
                  <span className="font-mono text-mint font-bold font-tabular">{rainfallMm} mm</span>
                </div>
                <input
                  id="sim-rain"
                  type="range"
                  min="0"
                  max="250"
                  step="5"
                  value={rainfallMm}
                  aria-label="24h Downpour Volume"
                  onChange={(e) => setRainfallMm(Number(e.target.value))}
                  className="w-full h-2 bg-carbon rounded-lg appearance-none cursor-pointer accent-mint"
                />
                <div className="flex justify-between text-[10px] text-ash/60">
                  <span>0 mm (None)</span>
                  <span>100 mm (Heavy)</span>
                  <span>250 mm (Cloudburst)</span>
                </div>
              </div>

              {/* Slider 2: Soil Saturation */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="sim-soil" className="text-ash font-medium flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-mint" /> Antecedent Soil Moisture
                  </label>
                  <span className="font-mono text-mint font-bold font-tabular">{soilSaturationPct}%</span>
                </div>
                <input
                  id="sim-soil"
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={soilSaturationPct}
                  aria-label="Antecedent Soil Moisture"
                  onChange={(e) => setSoilSaturationPct(Number(e.target.value))}
                  className="w-full h-2 bg-carbon rounded-lg appearance-none cursor-pointer accent-mint"
                />
                <div className="flex justify-between text-[10px] text-ash/60">
                  <span>5% (Desiccated)</span>
                  <span>50% (Normal)</span>
                  <span>100% (Waterlogged)</span>
                </div>
              </div>

              {/* Slider 3: Upstream Dam Release */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="sim-dam" className="text-ash font-medium flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-ember" /> Upstream Dam Spillway Release
                  </label>
                  <span className="font-mono text-ember font-bold font-tabular">
                    {damReleaseCusecs.toLocaleString()} cusecs
                  </span>
                </div>
                <input
                  id="sim-dam"
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={damReleaseCusecs}
                  aria-label="Upstream Dam Spillway Release"
                  onChange={(e) => setDamReleaseCusecs(Number(e.target.value))}
                  className="w-full h-2 bg-carbon rounded-lg appearance-none cursor-pointer accent-ember"
                />
                <div className="flex justify-between text-[10px] text-ash/60">
                  <span>0 (Closed)</span>
                  <span>25,000 (Controlled)</span>
                  <span>50,000 (Full Spillway)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Impact Readouts Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-graphite space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-graphite">
                <h3 className="font-semibold text-sm text-bone flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-mint" /> Simulated Hydrodynamic Surge Response
                </h3>
                <RiskBadge level={riskTier} />
              </div>

              {/* Core Projected Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-carbon border border-graphite space-y-1">
                  <span className="text-ash text-xs">Peak River Surge</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-mint font-tabular">
                    +{totalSurgeM} m
                  </div>
                  <span className="text-[11px] text-ash/80">above baseline stage</span>
                </div>

                <div className="p-4 rounded-xl bg-carbon border border-graphite space-y-1">
                  <span className="text-ash text-xs">Crest Arrival Time</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 font-tabular">
                    {crestTimeHrs} hrs
                  </div>
                  <span className="text-[11px] text-ash/80">estimated lead time</span>
                </div>

                <div className="p-4 rounded-xl bg-carbon border border-graphite space-y-1">
                  <span className="text-ash text-xs">Inundation Footprint</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-bone font-tabular">
                    ~{inundationRadiusKm} km
                  </div>
                  <span className="text-[11px] text-ash/80">est. lateral ingress</span>
                </div>
              </div>

              {/* Surrogate Dynamics Explanation */}
              <div className="p-4 rounded-xl bg-carbon/60 border border-graphite space-y-2 text-xs">
                <h4 className="font-semibold text-mint">Hydro-Morphological Causal Dynamics:</h4>
                <p className="text-ash leading-relaxed text-[11px]">
                  Effective runoff coefficient is evaluated at <strong className="text-bone">{effectiveC.toFixed(2)}</strong>.
                  {soilSaturationPct > 80
                    ? ' Because soil saturation is high (>80%), groundwater percolation is virtually zero. Rain turns directly into surface sheetflow, dramatically shortening peak crest arrival time.'
                    : ' Soil matrix still retains capacity to absorb initial precipitation, buffering the river hydrograph.'}
                  {damReleaseCusecs > 20000 && (
                    <span className="text-ember block mt-1">
                      ⚠️ High upstream dam release adds an immediate continuous hydraulic head, elevating baseline river stage before rainfall runoff reaches the confluence.
                    </span>
                  )}
                </p>
              </div>

              {/* Visual Surge Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-ash">
                  <span>Relative Hazard Intensity</span>
                  <span className="font-mono text-mint">{Math.min(100, Math.round((totalSurgeM / 4.5) * 100))}%</span>
                </div>
                <div className="w-full bg-carbon rounded-full h-3 overflow-hidden border border-graphite">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      riskTier === 'High'
                        ? 'bg-[#FF4D5E]'
                        : riskTier === 'Elevated'
                        ? 'bg-[#FF7A2F]'
                        : riskTier === 'Watch'
                        ? 'bg-[#FFD166]'
                        : 'bg-mint'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, (totalSurgeM / 4.5) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
