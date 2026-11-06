import React from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatutoryNoticeProps {
  className?: string;
  compact?: boolean;
}

export const StatutoryNotice: React.FC<StatutoryNoticeProps> = ({ className = '', compact = false }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`rounded-xl border border-graphite bg-carbon/75 backdrop-blur-md text-bone/80 ${
        compact ? 'p-2 text-xs' : 'p-3.5 text-xs md:text-sm'
      } flex items-start gap-3 shadow-carbon-elevation ${className}`}
      role="note"
      aria-label="Statutory Safety Notice"
    >
      <Info className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" aria-hidden="true" />
      <p className="leading-relaxed text-ash">
        <strong className="text-bone font-semibold">Notice: </strong>
        {t('statutoryNotice', 'Complements, does not replace, official warnings. Follow IMD, CWC, NDMA and your State Disaster Management Authority.')}
      </p>
    </div>
  );
};
