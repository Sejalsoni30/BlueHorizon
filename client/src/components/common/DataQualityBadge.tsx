import React from 'react';
import { Activity, Clock, AlertTriangle } from 'lucide-react';

interface DataQualityBadgeProps {
  score?: number;
  latencyHrs?: number;
  isImputed?: boolean;
  className?: string;
}

export const DataQualityBadge: React.FC<DataQualityBadgeProps> = ({
  score = 95,
  latencyHrs = 0.5,
  isImputed = false,
  className = ''
}) => {
  const isDegraded = score < 60 || latencyHrs > 6.0;
  const isStale = latencyHrs > 2.0 && latencyHrs <= 6.0;

  if (isDegraded) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-rose-950/40 border-rose-500/30 text-rose-300 font-tabular ${className}`}
        title={`Telemetry degraded (Latency: ${latencyHrs}h, Score: ${score}/100)`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
        <span>Degraded Confidence ({latencyHrs}h lag)</span>
      </span>
    );
  }

  if (isStale) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-950/40 border-amber-500/30 text-amber-300 font-tabular ${className}`}
        title={`Telemetry delayed (Latency: ${latencyHrs}h)`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>Delayed Telemetry ({latencyHrs}h)</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-cyan-dim border-cyan/30 text-cyan font-tabular ${className}`}
      title={`Live Telemetry Active (Latency: ${latencyHrs}h, Score: ${score}%)`}
    >
      <Activity className="w-3.5 h-3.5 text-cyan animate-pulse" />
      <span>Live Telemetry ({score}% Quality)</span>
      {isImputed && <span className="text-[10px] text-offwhite/50">(interpolated)</span>}
    </span>
  );
};

