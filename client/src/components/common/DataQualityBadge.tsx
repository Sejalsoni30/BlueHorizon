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
  className = '',
}) => {
  const isDegraded = score < 60 || latencyHrs > 6.0;
  const isStale = latencyHrs > 2.0 && latencyHrs <= 6.0;

  if (isDegraded) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-[#FF4D5E]/15 border-[#FF4D5E]/30 text-[#FF4D5E] font-tabular ${className}`}
        title={`Telemetry degraded (Latency: ${latencyHrs}h, Score: ${score}/100)`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-[#FF4D5E]" />
        <span>Degraded Confidence ({latencyHrs}h lag)</span>
      </span>
    );
  }

  if (isStale) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-ember/15 border-ember/30 text-ember font-tabular ${className}`}
        title={`Telemetry delayed (Latency: ${latencyHrs}h)`}
      >
        <Clock className="w-3.5 h-3.5 text-ember" />
        <span>Delayed Telemetry ({latencyHrs}h)</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-mint/10 border-mint/30 text-mint font-tabular ${className}`}
      title={`Live Telemetry Active (Latency: ${latencyHrs}h, Score: ${score}%)`}
    >
      <Activity className="w-3.5 h-3.5 text-mint animate-pulse" />
      <span>Live Telemetry ({score}% Quality)</span>
      {isImputed && <span className="text-[10px] text-ash">(interpolated)</span>}
    </span>
  );
};
