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
      bg: 'bg-mint/10',
      border: 'border-mint/30',
      text: 'text-mint',
      icon: ShieldCheck,
      label: 'Low Risk',
      dotColor: '#5CFFB1',
    },
    Watch: {
      bg: 'bg-[#FFD166]/10',
      border: 'border-[#FFD166]/30',
      text: 'text-[#FFD166]',
      icon: AlertCircle,
      label: 'Watch',
      dotColor: '#FFD166',
    },
    Elevated: {
      bg: 'bg-ember/10',
      border: 'border-ember/30',
      text: 'text-ember',
      icon: AlertTriangle,
      label: 'Elevated Risk',
      dotColor: '#FF7A2F',
    },
    High: {
      bg: 'bg-[#FF4D5E]/15',
      border: 'border-[#FF4D5E]/40',
      text: 'text-[#FF4D5E]',
      icon: AlertOctagon,
      label: 'High Danger',
      dotColor: '#FF4D5E',
    },
  }[level];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border font-tabular backdrop-blur-sm transition-colors ${config.bg} ${config.border} ${config.text} ${className}`}
      role="status"
      aria-label={`Risk Level: ${config.label}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
};
