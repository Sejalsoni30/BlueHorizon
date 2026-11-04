import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers, ShieldCheck, Droplet, Sun, Table, Map } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';

// Fix standard Leaflet default icon issues in bundler environments
const floodIcon = new L.DivIcon({
  className: 'custom-pin-flood',
  html: '<div style="background:#22D3EE; width:14px; height:14px; border-radius:50%; border:2px solid #071B34; box-shadow:0 0 10px #22D3EE;"></div>',
  iconSize: [14, 14],
});

const droughtIcon = new L.DivIcon({
  className: 'custom-pin-drought',
  html: '<div style="background:#F59E0B; width:14px; height:14px; border-radius:50%; border:2px solid #071B34; box-shadow:0 0 10px #F59E0B;"></div>',
  iconSize: [14, 14],
});

const reportIcon = new L.DivIcon({
  className: 'custom-pin-report',
  html: '<div style="background:#10B981; width:12px; height:12px; border-radius:50%; border:2px solid #071B34; box-shadow:0 0 8px #10B981;"></div>',
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
    <div className="glass-panel p-6 rounded-2xl border border-cyan/20 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cyan/15">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan" />
          <h3 className="font-display font-semibold text-sm sm:text-base text-offwhite">
            Geospatial Environmental Hazard Canvas
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggles */}
          <div className="flex rounded-lg bg-deep border border-cyan/20 p-0.5 text-xs">
            <button
              onClick={() => setShowFlood(!showFlood)}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                showFlood ? 'bg-cyan text-abyss font-semibold' : 'text-offwhite/50 hover:text-cyan'
              }`}
            >
              <Droplet className="w-3 h-3" /> Flood
            </button>
            <button
              onClick={() => setShowDrought(!showDrought)}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                showDrought ? 'bg-amber-400 text-abyss font-semibold' : 'text-offwhite/50 hover:text-amber-400'
              }`}
            >
              <Sun className="w-3 h-3" /> Drought
            </button>
            <button
              onClick={() => setShowReports(!showReports)}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                showReports ? 'bg-emerald-400 text-abyss font-semibold' : 'text-offwhite/50 hover:text-emerald-400'
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Reports
            </button>
          </div>

          <button
            onClick={() => setShowTableAlt(!showTableAlt)}
            className="p-1.5 rounded-lg bg-deep border border-cyan/20 text-cyan hover:border-cyan/50 text-xs flex items-center gap-1"
            title="Toggle Accessible Table View"
          >
            {showTableAlt ? <Map className="w-3.5 h-3.5" /> : <Table className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showTableAlt ? 'Map View' : 'Table Alt'}</span>
          </button>
        </div>
      </div>

      {/* Accessible Table Alternative (WCAG 2.2 AA) */}
      {showTableAlt ? (
        <div className="overflow-x-auto rounded-lg border border-cyan/20">
          <table className="w-full text-xs text-left">
            <caption className="sr-only">Geographic Hazard Monitoring Stations & Community Ground Reports</caption>
            <thead>
              <tr className="bg-ocean/20 text-offwhite border-b border-cyan/20">
                <th scope="col" className="p-3">Location / Station</th>
                <th scope="col" className="p-3">Hazard Type</th>
                <th scope="col" className="p-3">Status</th>
                <th scope="col" className="p-3">Coordinates</th>
                <th scope="col" className="p-3">Telemetry / Ground Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan/10">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-deep/50">
                  <td className="p-3 text-offwhite font-medium">{item.name}</td>
                  <td className="p-3 uppercase font-mono text-[11px] text-cyan">{item.type}</td>
                  <td className="p-3">
                    <RiskBadge level={item.status === 'High' ? 'High' : item.status === 'Elevated' ? 'Elevated' : 'Watch'} />
                  </td>
                  <td className="p-3 font-mono text-offwhite/70 font-tabular">
                    {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                  </td>
                  <td className="p-3 text-offwhite/80">{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Leaflet Web-GIS Map */
        <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-cyan/20 relative z-0">
          <MapContainer
            center={[18.8, 75.5]}
            zoom={6}
            style={{ width: '100%', height: '100%', background: '#04101F' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredItems.map((item) => {
              const icon =
                item.type === 'flood' ? floodIcon : item.type === 'drought' ? droughtIcon : reportIcon;
              return (
                <React.Fragment key={item.id}>
                  <Marker position={[item.lat, item.lng]} icon={icon}>
                    <Popup className="bluehorizon-popup">
                      <div className="p-2 space-y-1 text-xs">
                        <strong className="block text-sm text-offwhite">{item.name}</strong>
                        <span className="text-[11px] text-cyan uppercase font-mono block">
                          Type: {item.type} ({item.status})
                        </span>
                        <p className="text-offwhite/80">{item.details}</p>
                      </div>
                    </Popup>
                  </Marker>
                  {item.type === 'flood' && (
                    <Circle
                      center={[item.lat, item.lng]}
                      radius={25000}
                      pathOptions={{ color: '#22D3EE', fillColor: '#22D3EE', fillOpacity: 0.15, weight: 1.5 }}
                    />
                  )}
                  {item.type === 'drought' && (
                    <Circle
                      center={[item.lat, item.lng]}
                      radius={40000}
                      pathOptions={{ color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.1, weight: 1 }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between text-[11px] text-offwhite/50 pt-2 border-t border-cyan/10">
        <span>Cartography by OpenStreetMap (ODbL 1.0). Station geometry via CWC & India-WRIS.</span>
        <span className="font-mono text-cyan">Leaflet GIS Engine</span>
      </div>
    </div>
  );
};

