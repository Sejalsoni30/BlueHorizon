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
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-deep border border-cyan/30 text-offwhite text-xs sm:text-sm font-medium shadow-sm">
        <MapPin className="w-4 h-4 text-cyan flex-shrink-0" />
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="bg-transparent text-offwhite appearance-none pr-6 focus:outline-none cursor-pointer font-sans"
        >
          {catchments.map((c) => (
            <option key={c.id} value={c.id} className="bg-deep text-offwhite">
              {c.name} ({c.state})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-cyan pointer-events-none absolute right-3" />
      </div>
    </div>
  );
};
