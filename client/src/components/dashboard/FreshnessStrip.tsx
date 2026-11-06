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
    <div className="w-full glass-panel px-4 py-3 rounded-2xl border border-graphite flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      <div className="flex items-center gap-3">
        <DataQualityBadge score={score} latencyHrs={latencyHrs} isImputed={isImputed} />
        <DemoBadge />
        <span className="hidden sm:inline-flex items-center gap-1.5 text-ash">
          <Clock className="w-3.5 h-3.5 text-mint" />
          <span>Synced at {formattedTime}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-ash/70 truncate max-w-xs flex items-center gap-1.5">
          <Database className="w-3 h-3 text-mint/80" />
          <span>{attribution}</span>
        </span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg bg-carbon hover:bg-graphite text-mint border border-graphite transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
