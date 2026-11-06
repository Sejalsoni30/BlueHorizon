import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import type { Catchment } from '../../services/api';

interface LocationSelectorProps {
  catchments: Catchment[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  catchments,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-carbon border border-graphite text-bone text-xs sm:text-sm font-medium shadow-sm hover:border-mint/30 transition-colors">
        <MapPin className="w-4 h-4 text-mint flex-shrink-0" />
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="bg-transparent text-bone appearance-none pr-6 focus:outline-none cursor-pointer font-sans"
        >
          {catchments.map((c) => (
            <option key={c.id} value={c.id} className="bg-carbon text-bone">
              {c.name} ({c.state})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-mint pointer-events-none absolute right-3" />
      </div>
    </div>
  );
};
