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
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wide border border-graphite bg-carbon/90 text-ash ${className}`}
      title="This dataset or calculation uses demonstration/benchmark data"
    >
      <Database className="w-3 h-3 text-mint" />
      <span>{t('demoDataBadge', 'Demonstration data')}</span>
    </span>
  );
};
