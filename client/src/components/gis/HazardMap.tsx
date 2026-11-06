import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers, ShieldCheck, Droplet, Sun, Table, Map } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

const floodIcon = new L.DivIcon({
  className: 'custom-pin-flood',
  html: '<div style="background:#5CFFB1; width:14px; height:14px; border-radius:50%; border:2px solid #060606; box-shadow:0 0 12px #5CFFB1;"></div>',
  iconSize: [14, 14],
});

const droughtIcon = new L.DivIcon({
  className: 'custom-pin-drought',
  html: '<div style="background:#FF7A2F; width:14px; height:14px; border-radius:50%; border:2px solid #060606; box-shadow:0 0 12px #FF7A2F;"></div>',
  iconSize: [14, 14],
});

const reportIcon = new L.DivIcon({
  className: 'custom-pin-report',
  html: '<div style="background:#F4F1EA; width:12px; height:12px; border-radius:50%; border:2px solid #060606; box-shadow:0 0 8px #F4F1EA;"></div>',
  iconSize: [12, 12],
});

interface MapItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'flood' | 'drought' | 'report';
  status: string;
  details: string;
}

const STATIONS: MapItem[] = [
  { id: '1', name: 'Pune Bund Garden Station', lat: 18.5204, lng: 73.8567, type: 'flood', status: 'Elevated', details: 'Stage 534.8m (Warning: 535.5m), Discharge 840 cumecs' },
  { id: '2', name: 'Nashik Holkar Bridge', lat: 19.9975, lng: 73.7898, type: 'flood', status: 'Watch', details: 'Stage 553.1m (Warning: 554.0m), Inflow rising' },
  { id: '3', name: 'Marathwada Agromet Grid', lat: 19.8762, lng: 75.3433, type: 'drought', status: 'High', details: 'SPEI-3: -1.72, Soil moisture deficit 72%' },
  { id: '4', name: 'Raichur Tungabhadra Zone', lat: 16.212, lng: 77.3439, type: 'drought', status: 'Elevated', details: 'SPEI-3: -1.45, 21 consecutive dry days' },
  { id: '5', name: 'Sangam Bridge Citizen Ping', lat: 18.5314, lng: 73.8653, type: 'report', status: 'Verified', details: 'Water overtopping causeway by 30cm' },
];

export const HazardMap: React.FC = () => {
  const [showFlood, setShowFlood] = useState(true);
  const [showDrought, setShowDrought] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showTableAlt, setShowTableAlt] = useState(false);

  const filteredItems = STATIONS.filter((item) => {
    if (item.type === 'flood' && !showFlood) return false;
    if (item.type === 'drought' && !showDrought) return false;
    if (item.type === 'report' && !showReports) return false;
    return true;
  });

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-graphite space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-graphite">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-mint" />
          <h3 className="font-display font-bold text-base text-bone">
            Geospatial Environmental Hazard Canvas
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggles */}
          <div className="flex rounded-xl bg-carbon border border-graphite p-1 text-xs font-mono">
            <button
              onClick={() => setShowFlood(!showFlood)}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                showFlood ? 'bg-mint text-obsidian font-bold' : 'text-ash hover:text-mint'
              }`}
            >
              <Droplet className="w-3 h-3" /> Flood
            </button>
            <button
              onClick={() => setShowDrought(!showDrought)}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                showDrought ? 'bg-ember text-obsidian font-bold' : 'text-ash hover:text-ember'
              }`}
            >
              <Sun className="w-3 h-3" /> Drought
            </button>
            <button
              onClick={() => setShowReports(!showReports)}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                showReports ? 'bg-bone text-obsidian font-bold' : 'text-ash hover:text-bone'
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Reports
            </button>
          </div>

          <button
            onClick={() => setShowTableAlt(!showTableAlt)}
            className="p-2 rounded-xl bg-carbon border border-graphite text-ash hover:text-mint hover:border-mint/30 text-xs flex items-center gap-1.5 transition-colors font-mono"
            title="Toggle Accessible Table View"
          >
            {showTableAlt ? <Map className="w-3.5 h-3.5" /> : <Table className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showTableAlt ? 'Map View' : 'Table Alt'}</span>
          </button>
        </div>
      </div>

      {/* Accessible Table Alternative (WCAG 2.2 AA) */}
      {showTableAlt ? (
        <div className="overflow-x-auto rounded-2xl border border-graphite">
          <table className="w-full text-xs text-left">
            <caption className="sr-only">Geographic Hazard Monitoring Stations & Community Ground Reports</caption>
            <thead>
              <tr className="bg-carbon text-bone border-b border-graphite font-mono text-[11px]">
                <th scope="col" className="p-3">Location / Station</th>
                <th scope="col" className="p-3">Hazard Type</th>
                <th scope="col" className="p-3">Status</th>
                <th scope="col" className="p-3">Coordinates</th>
                <th scope="col" className="p-3">Telemetry / Ground Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite font-mono">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-carbon/60 transition-colors">
                  <td className="p-3 text-bone font-medium">{item.name}</td>
                  <td className="p-3 uppercase text-[11px] text-mint">{item.type}</td>
                  <td className="p-3">
                    <RiskBadge level={item.status === 'High' ? 'High' : item.status === 'Elevated' ? 'Elevated' : 'Watch'} />
                  </td>
                  <td className="p-3 text-ash font-tabular">
                    {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                  </td>
                  <td className="p-3 text-ash">{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Leaflet Web-GIS Map */
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-graphite relative z-0">
          <MapContainer
            center={[18.8, 75.5]}
            zoom={6}
            style={{ width: '100%', height: '100%', background: '#060606' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {filteredItems.map((item) => {
              const icon =
                item.type === 'flood' ? floodIcon : item.type === 'drought' ? droughtIcon : reportIcon;
              return (
                <React.Fragment key={item.id}>
                  <Marker position={[item.lat, item.lng]} icon={icon}>
                    <Popup className="bluehorizon-popup">
                      <div className="p-2 space-y-1 text-xs font-mono">
                        <strong className="block text-sm text-bone">{item.name}</strong>
                        <span className="text-[11px] text-mint uppercase block font-semibold">
                          Type: {item.type} ({item.status})
                        </span>
                        <p className="text-ash">{item.details}</p>
                      </div>
                    </Popup>
                  </Marker>
                  {item.type === 'flood' && (
                    <Circle
                      center={[item.lat, item.lng]}
                      radius={25000}
                      pathOptions={{ color: '#5CFFB1', fillColor: '#5CFFB1', fillOpacity: 0.12, weight: 1.5 }}
                    />
                  )}
                  {item.type === 'drought' && (
                    <Circle
                      center={[item.lat, item.lng]}
                      radius={40000}
                      pathOptions={{ color: '#FF7A2F', fillColor: '#FF7A2F', fillOpacity: 0.1, weight: 1 }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between text-[11px] text-ash/60 pt-2 border-t border-graphite font-mono">
        <span>Cartography by OpenStreetMap (ODbL 1.0) & CartoDB Dark Matter.</span>
        <span className="text-mint">Leaflet GIS Engine</span>
      </div>
    </div>
  );
};
