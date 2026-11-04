import React from 'react';
import { DataQualityBadge } from '../common/DataQualityBadge';
import { DemoBadge } from '../common/DemoBadge';
import { Database, Clock, RefreshCw } from 'lucide-react';

interface FreshnessStripProps {
  score: number;
  latencyHrs: number;
  isImputed: boolean;
  attribution: string;
  updatedAt: string;
  onRefresh?: () => void;
}

export const FreshnessStrip: React.FC<FreshnessStripProps> = ({
  score,
  latencyHrs,
  isImputed,
  attribution,
  updatedAt,
  onRefresh,
}) => {
  const formattedTime = new Date(updatedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="w-full glass-panel px-4 py-2.5 rounded-xl border border-cyan/20 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        <DataQualityBadge score={score} latencyHrs={latencyHrs} isImputed={isImputed} />
        <DemoBadge />
        <span className="hidden sm:inline-flex items-center gap-1 text-offwhite/60">
          <Clock className="w-3.5 h-3.5 text-cyan" />
          <span>Synced at {formattedTime}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-offwhite/50 truncate max-w-xs flex items-center gap-1">
          <Database className="w-3 h-3 text-cyan/70" />
          <span>{attribution}</span>
        </span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1 rounded bg-deep hover:bg-ocean/30 text-cyan border border-cyan/20 transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

