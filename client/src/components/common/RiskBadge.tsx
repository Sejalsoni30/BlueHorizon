import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

export type RiskLevel = 'Low' | 'Watch' | 'Elevated' | 'High';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '', showIcon = true }) => {
  const config = {
    Low: {
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: ShieldCheck,
      label: 'Low Risk'
    },
    Watch: {
      bg: 'bg-amber-950/60',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      icon: AlertCircle,
      label: 'Watch'
    },
    Elevated: {
      bg: 'bg-orange-950/60',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      icon: AlertTriangle,
      label: 'Elevated Risk'
    },
    High: {
      bg: 'bg-rose-950/60',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      icon: AlertOctagon,
      label: 'High Danger'
    }
  }[level];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-tabular ${config.bg} ${config.border} ${config.text} ${className}`}
      role="status"
      aria-label={`Risk Level: ${config.label}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};

