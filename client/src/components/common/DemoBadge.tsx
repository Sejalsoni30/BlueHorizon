import React from 'react';
import { Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DemoBadgeProps {
  className?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono tracking-wide border border-cyan/30 bg-ocean/30 text-cyan ${className}`}
      title="This dataset or calculation uses demonstration/benchmark data"
    >
      <Database className="w-3 h-3 text-cyan" />
      <span>{t('demoDataBadge', 'Demonstration data')}</span>
    </span>
  );
};

