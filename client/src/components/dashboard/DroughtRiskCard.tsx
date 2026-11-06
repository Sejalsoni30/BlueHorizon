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
    <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-graphite space-y-5 flex flex-col justify-between" data-theme="drought">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-graphite">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-ember/10 border border-ember/30 flex items-center justify-center text-ember">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-bone">
              Agricultural Drought & Soil Stress
            </h3>
            <span className="text-xs text-ash font-mono">Root-Zone Deficit Monitor</span>
          </div>
        </div>
        <RiskBadge level={riskLevel} />
      </div>

      {/* SPEI-3 Index Readout */}
      <div className="p-4 rounded-2xl bg-carbon border border-graphite flex items-center justify-between">
        <div>
          <span className="text-xs text-ash block font-mono">Standardized SPEI-3 Index</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-display font-extrabold font-mono text-bone font-tabular">
              {spei3 > 0 ? `+${spei3}` : spei3}
            </span>
            <span className="text-xs font-mono font-semibold text-ember">
              {spei3 <= -1.5 ? 'Severe Deficit' : spei3 <= -1.0 ? 'Moderate Stress' : 'Normal / Surplus'}
            </span>
          </div>
          <span className="text-[11px] text-ash/60 block mt-0.5 font-mono">3-Month Evaporative Anomaly</span>
        </div>

        <button
          onClick={() => setShowDoc(!showDoc)}
          className="p-2.5 rounded-xl bg-graphite/40 border border-graphite text-ember hover:border-ember/40 text-xs flex items-center gap-1.5 transition-colors font-mono"
          title="Explain Calculation Method"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Method</span>
        </button>
      </div>

      {/* Calculation Documentation Accordion */}
      {showDoc && (
        <div className="p-4 rounded-xl bg-carbon border border-ember/30 text-xs text-ash space-y-2 animate-fadeIn">
          <h4 className="font-semibold text-ember font-mono">SPEI-3 Methodological Basis:</h4>
          <p className="text-[11px] leading-relaxed text-ash/90">
            The Standardized Precipitation-Evapotranspiration Index (SPEI-3) compares 90-day accumulated precipitation against potential evapotranspiration (PET) calculated using the Hargreaves formulation over a 30-year baseline climatology. Negative values below -1.0 indicate agricultural moisture deficit.
          </p>
        </div>
      )}

      {/* Moisture & Meteorological Metrics */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-carbon border border-graphite space-y-1">
          <span className="text-ash text-[11px] font-mono flex items-center gap-1">
            <DropletOff className="w-3.5 h-3.5 text-ember" /> Soil Moisture Deficit
          </span>
          <span className="text-xl font-bold font-mono text-bone font-tabular">
            {soilMoistureDeficit}%
          </span>
          <span className="text-[10px] text-ash/60 block font-mono">0–28 cm root zone</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-carbon border border-graphite space-y-1">
          <span className="text-ash text-[11px] font-mono flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-[#FF4D5E]" /> Rain Deficit (30-day)
          </span>
          <span className="text-xl font-bold font-mono text-bone font-tabular">
            {precipDeficit30d > 0 ? `-${precipDeficit30d}%` : `+${Math.abs(precipDeficit30d)}%`}
          </span>
          <span className="text-[10px] text-ash/60 block font-mono">vs Climatological Normal</span>
        </div>
      </div>

      {/* Soil Whiplash Vulnerability */}
      <div className="p-4 rounded-2xl bg-carbon/90 border border-graphite space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold font-mono">
          <span className="text-bone">Consecutive Dry Days:</span>
          <span className="text-ember font-tabular">{consecutiveDryDays} Days</span>
        </div>
        <p className="text-[11px] text-ash leading-relaxed">
          {consecutiveDryDays > 14
            ? 'Severe topsoil crusted desiccation. If heavy monsoon downpour strikes, water will not penetrate, generating immediate flash runoff.'
            : 'Soil moisture buffer adequate for current vegetative growth.'}
        </p>
      </div>

      {/* Bottom Status */}
      <div className="pt-2 border-t border-graphite flex items-center justify-between text-[11px] text-ash font-mono">
        <span>Zonal Vulnerability:</span>
        <span className="text-ember font-semibold">
          {isDroughtProne ? 'Semi-Arid Marathwada Zone' : 'Humid River Plains'}
        </span>
      </div>
    </div>
  );
};
