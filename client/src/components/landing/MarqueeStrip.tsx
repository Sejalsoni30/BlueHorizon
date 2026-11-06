import React from 'react';
import { Database } from 'lucide-react';

const sources = [
  { name: 'Open-Meteo REST API', role: 'Global NWP Weather & Soil Moisture', license: 'CC BY 4.0' },
  { name: 'NASA GPM IMERG', role: 'Global Satellite Precipitation Tracking', license: 'NASA Open Data' },
  { name: 'Central Water Commission (CWC)', role: '592+ River Telemetry Gauges', license: 'NDSAP India' },
  { name: 'NDMA SACHET (C-DOT)', role: 'ITU-T Common Alerting Protocol', license: 'Govt. of India' },
  { name: 'Copernicus Sentinel-1 SAR', role: 'All-Weather Cloud-Penetrating Radar', license: 'Copernicus Free & Open' },
  { name: 'OpenStreetMap Cartography', role: 'Global Basemap Vectors', license: 'ODbL 1.0' },
];

export const MarqueeStrip: React.FC = () => {
  return (
    <div className="w-full py-8 border-y border-graphite bg-carbon/50 overflow-hidden group">
      <div className="flex w-max animate-marquee space-x-10 group-hover:[animation-play-state:paused]">
        {[...sources, ...sources].map((s, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-carbon border border-graphite text-xs font-mono text-ash whitespace-nowrap"
          >
            <div className="w-6 h-6 rounded-lg bg-mint/10 border border-mint/25 flex items-center justify-center text-mint">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-bone font-semibold">{s.name}</span>
              <span className="text-ash/60 ml-2">({s.role})</span>
            </div>
            <span className="text-[10px] text-mint/80 bg-obsidian px-2 py-0.5 rounded border border-graphite">
              {s.license}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
