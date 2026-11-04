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
    <div className="min-h-screen bg-abyss text-offwhite flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Persistent Prominent Hypothetical Banner */}
        <div className="p-4 rounded-xl border border-amber-500/50 bg-amber-950/30 text-amber-300 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>
              <strong>HYPOTHETICAL PLANNING SCENARIO — NOT AN OFFICIAL FORECAST. </strong>
              This interactive surrogate model is designed for disaster preparedness stress-testing and training exercises.
            </span>
          </div>
          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded bg-amber-900/40 hover:bg-amber-900 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        <StatutoryNotice />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Scenario Control Form */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-7 rounded-2xl border border-cyan/20 space-y-6">
            <div className="pb-3 border-b border-cyan/15 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-offwhite flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan" /> Hydro-Meteorological Forcing Controls
              </h3>
              <span className="text-[11px] font-mono text-cyan">Surrogate Model</span>
            </div>

            <div className="space-y-5 text-xs">
              {/* Basin Topography Selector */}
              <div className="space-y-1.5">
                <label className="text-offwhite/80 font-medium">Catchment Topography & Drainage</label>
                <select
                  value={basinType}
                  onChange={(e) => setBasinType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-deep border border-cyan/20 text-offwhite focus:border-cyan focus:outline-none"
                >
                  <option value="agrarian">Agrarian River Basin (Moderate Infiltration)</option>
                  <option value="urban">Dense Urban Catchment (High Impervious Concrete)</option>
                  <option value="steep_valley">Steep Valley Catchment (High Velocity Runoff)</option>
                </select>
              </div>

              {/* Slider 1: 24h Precipitation */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="sim-rain" className="text-offwhite/80 font-medium flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan" /> 24h Downpour Volume
                  </label>
                  <span className="font-mono text-cyan font-bold font-tabular">{rainfallMm} mm</span>
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
                  className="w-full h-2 bg-deep rounded-lg appearance-none cursor-pointer accent-cyan"
                />
                <div className="flex justify-between text-[10px] text-offwhite/40">
                  <span>0 mm (None)</span>
                  <span>100 mm (Heavy)</span>
                  <span>250 mm (Cloudburst)</span>
                </div>
              </div>

              {/* Slider 2: Soil Saturation */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="sim-soil" className="text-offwhite/80 font-medium flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal" /> Antecedent Soil Moisture
                  </label>
                  <span className="font-mono text-teal font-bold font-tabular">{soilSaturationPct}%</span>
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
                  className="w-full h-2 bg-deep rounded-lg appearance-none cursor-pointer accent-teal"
                />
                <div className="flex justify-between text-[10px] text-offwhite/40">
                  <span>5% (Desiccated)</span>
                  <span>50% (Normal)</span>
                  <span>100% (Waterlogged)</span>
                </div>
              </div>

              {/* Slider 3: Upstream Dam Release */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="sim-dam" className="text-offwhite/80 font-medium flex items-center gap-1.5">
                    <Waves className="w-3.5 h-3.5 text-rose-400" /> Upstream Dam Spillway Release
                  </label>
                  <span className="font-mono text-rose-400 font-bold font-tabular">
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
                  className="w-full h-2 bg-deep rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-offwhite/40">
                  <span>0 (Closed)</span>
                  <span>25,000 (Controlled)</span>
                  <span>50,000 (Full Spillway)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Impact Readouts Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-cyan/20 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-cyan/15">
                <h3 className="font-semibold text-sm text-offwhite flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-cyan" /> Simulated Hydrodynamic Surge Response
                </h3>
                <RiskBadge level={riskTier} />
              </div>

              {/* Core Projected Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-deep/80 border border-cyan/15 space-y-1">
                  <span className="text-offwhite/60 text-xs">Peak River Surge</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan font-tabular">
                    +{totalSurgeM} m
                  </div>
                  <span className="text-[11px] text-offwhite/50">above baseline stage</span>
                </div>

                <div className="p-4 rounded-xl bg-deep/80 border border-cyan/15 space-y-1">
                  <span className="text-offwhite/60 text-xs">Crest Arrival Time</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 font-tabular">
                    {crestTimeHrs} hrs
                  </div>
                  <span className="text-[11px] text-offwhite/50">estimated lead time</span>
                </div>

                <div className="p-4 rounded-xl bg-deep/80 border border-cyan/15 space-y-1">
                  <span className="text-offwhite/60 text-xs">Inundation Footprint</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-offwhite font-tabular">
                    ~{inundationRadiusKm} km
                  </div>
                  <span className="text-[11px] text-offwhite/50">est. lateral ingress</span>
                </div>
              </div>

              {/* Surrogate Dynamics Explanation */}
              <div className="p-4 rounded-xl bg-deep/60 border border-cyan/10 space-y-2 text-xs">
                <h4 className="font-semibold text-cyan">Hydro-Morphological Causal Dynamics:</h4>
                <p className="text-offwhite/80 leading-relaxed text-[11px]">
                  Effective runoff coefficient is evaluated at <strong className="text-offwhite">{effectiveC.toFixed(2)}</strong>.
                  {soilSaturationPct > 80
                    ? ' Because soil saturation is high (>80%), groundwater percolation is virtually zero. Rain turns directly into surface sheetflow, dramatically shortening peak crest arrival time.'
                    : ' Soil matrix still retains capacity to absorb initial precipitation, buffering the river hydrograph.'}
                  {damReleaseCusecs > 20000 && (
                    <span className="text-rose-300 block mt-1">
                      ⚠️ High upstream dam release adds an immediate continuous hydraulic head, elevating baseline river stage before rainfall runoff reaches the confluence.
                    </span>
                  )}
                </p>
              </div>

              {/* Visual Surge Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-offwhite/70">
                  <span>Relative Hazard Intensity</span>
                  <span className="font-mono text-cyan">{Math.min(100, Math.round((totalSurgeM / 4.5) * 100))}%</span>
                </div>
                <div className="w-full bg-deep rounded-full h-3 overflow-hidden border border-cyan/15">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      riskTier === 'High'
                        ? 'bg-rose-500'
                        : riskTier === 'Elevated'
                        ? 'bg-amber-500'
                        : 'bg-cyan'
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
