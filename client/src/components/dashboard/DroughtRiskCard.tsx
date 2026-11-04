import React, { useState } from 'react';
import { RiskBadge, type RiskLevel } from '../common/RiskBadge';
import { Sun, DropletOff, HelpCircle, Thermometer } from 'lucide-react';

interface DroughtRiskCardProps {
  spei3: number;
  precipDeficit30d: number;
  soilMoistureDeficit: number;
  consecutiveDryDays: number;
  isDroughtProne: boolean;
}

export const DroughtRiskCard: React.FC<DroughtRiskCardProps> = ({
  spei3,
  precipDeficit30d,
  soilMoistureDeficit,
  consecutiveDryDays,
  isDroughtProne,
}) => {
  const [showDoc, setShowDoc] = useState(false);

  let riskLevel: RiskLevel = 'Low';
  if (spei3 <= -2.0) riskLevel = 'High';
  else if (spei3 <= -1.5) riskLevel = 'Elevated';
  else if (spei3 <= -1.0) riskLevel = 'Watch';

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan/20 space-y-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan/15">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base text-offwhite">
              Agricultural Drought & Soil Stress
            </h3>
            <span className="text-[11px] text-offwhite/50">Root-Zone Deficit Monitor</span>
          </div>
        </div>
        <RiskBadge level={riskLevel} />
      </div>

      {/* SPEI-3 Index Readout */}
      <div className="p-4 rounded-xl bg-deep/80 border border-cyan/15 flex items-center justify-between">
        <div>
          <span className="text-xs text-offwhite/60 block">Standardized SPEI-3 Index</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-display font-bold font-mono text-offwhite font-tabular">
              {spei3 > 0 ? `+${spei3}` : spei3}
            </span>
            <span className="text-xs font-mono text-amber-400">
              {spei3 <= -1.5 ? 'Severe Deficit' : spei3 <= -1.0 ? 'Moderate Stress' : 'Normal / Surplus'}
            </span>
          </div>
          <span className="text-[11px] text-offwhite/50 block mt-0.5">3-Month Evaporative Anomaly</span>
        </div>

        <button
          onClick={() => setShowDoc(!showDoc)}
          className="p-2 rounded-lg bg-deep border border-cyan/20 text-cyan hover:border-cyan/50 text-xs flex items-center gap-1 transition-colors"
          title="Explain Calculation Method"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Method</span>
        </button>
      </div>

      {/* Calculation Documentation Accordion */}
      {showDoc && (
        <div className="p-3 rounded-lg bg-deep/90 border border-cyan/30 text-xs text-offwhite/80 space-y-1.5 animate-fadeIn">
          <h4 className="font-semibold text-cyan">SPEI-3 Methodological Basis:</h4>
          <p className="text-[11px] leading-relaxed">
            The Standardized Precipitation-Evapotranspiration Index (SPEI-3) compares 90-day accumulated precipitation against potential evapotranspiration (PET) calculated using the Hargreaves formulation over a 30-year baseline climatology. Negative values below -1.0 indicate agricultural moisture deficit.
          </p>
        </div>
      )}

      {/* Moisture & Meteorological Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-deep/50 border border-cyan/10 space-y-1">
          <span className="text-offwhite/60 text-[11px] flex items-center gap-1">
            <DropletOff className="w-3.5 h-3.5 text-amber-400" /> Soil Moisture Deficit
          </span>
          <span className="text-lg font-bold font-mono text-offwhite font-tabular">
            {soilMoistureDeficit}%
          </span>
          <span className="text-[10px] text-offwhite/40 block">0–28 cm root zone</span>
        </div>

        <div className="p-3 rounded-xl bg-deep/50 border border-cyan/10 space-y-1">
          <span className="text-offwhite/60 text-[11px] flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Rain Deficit (30-day)
          </span>
          <span className="text-lg font-bold font-mono text-offwhite font-tabular">
            {precipDeficit30d > 0 ? `-${precipDeficit30d}%` : `+${Math.abs(precipDeficit30d)}%`}
          </span>
          <span className="text-[10px] text-offwhite/40 block">vs Climatological Normal</span>
        </div>
      </div>

      {/* Soil Whiplash Vulnerability */}
      <div className="p-3.5 rounded-xl bg-deep/60 border border-cyan/15 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-offwhite">Consecutive Dry Days:</span>
          <span className="font-mono text-amber-300 font-tabular">{consecutiveDryDays} Days</span>
        </div>
        <p className="text-[11px] text-offwhite/70 leading-relaxed">
          {consecutiveDryDays > 14
            ? 'Severe topsoil crusted desiccation. If heavy monsoon downpour strikes, water will not penetrate, generating immediate flash runoff.'
            : 'Soil moisture buffer adequate for current vegetative growth.'}
        </p>
      </div>

      {/* Bottom Status */}
      <div className="pt-2 border-t border-cyan/10 flex items-center justify-between text-[11px] text-offwhite/60">
        <span>Zonal Vulnerability:</span>
        <span className="font-mono text-cyan">
          {isDroughtProne ? 'Semi-Arid Marathwada Zone' : 'Humid River Plains'}
        </span>
      </div>
    </div>
  );
};
