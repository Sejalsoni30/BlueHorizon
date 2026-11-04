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
      className={`rounded-lg border border-cyan/20 bg-deep/60 backdrop-blur-sm text-offwhite/80 ${
        compact ? 'p-2 text-xs' : 'p-3 text-xs md:text-sm'
      } flex items-start gap-2.5 ${className}`}
      role="note"
      aria-label="Statutory Safety Notice"
    >
      <Info className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5" aria-hidden="true" />
      <p className="leading-relaxed">
        <strong className="text-cyan font-medium">Notice: </strong>
        {t('statutoryNotice', 'Complements, does not replace, official warnings. Follow IMD, CWC, NDMA and your State Disaster Management Authority.')}
      </p>
    </div>
  );
};

