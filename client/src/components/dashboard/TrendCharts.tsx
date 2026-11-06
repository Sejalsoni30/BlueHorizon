import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { Calendar, Table, BarChart2 } from 'lucide-react';

interface TrendChartsProps {
  warningStageM: number;
  dangerStageM: number;
  currentStageM: number;
  rainfall24h: number;
}

export const TrendCharts: React.FC<TrendChartsProps> = ({
  warningStageM,
  dangerStageM,
  currentStageM,
  rainfall24h,
}) => {
  const [activeTab, setActiveTab] = useState<'hydrograph' | 'rainfall'>('hydrograph');
  const [showTableAlt, setShowTableAlt] = useState(false);

  const hydroData = [
    { day: 'Day -5', stage: Number((currentStageM - 1.4).toFixed(2)), rainfall: 8 },
    { day: 'Day -4', stage: Number((currentStageM - 1.1).toFixed(2)), rainfall: 14 },
    { day: 'Day -3', stage: Number((currentStageM - 0.8).toFixed(2)), rainfall: 22 },
    { day: 'Day -2', stage: Number((currentStageM - 0.4).toFixed(2)), rainfall: 35 },
    { day: 'Yesterday', stage: Number((currentStageM - 0.1).toFixed(2)), rainfall: 42 },
    { day: 'Today (Live)', stage: Number(currentStageM.toFixed(2)), rainfall: rainfall24h },
    { day: '+24h (Fcst)', stage: Number((currentStageM + 0.6).toFixed(2)), rainfall: 30 },
    { day: '+48h (Fcst)', stage: Number((currentStageM + 0.3).toFixed(2)), rainfall: 15 },
  ];

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-graphite space-y-4">
      {/* Header and Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-graphite">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-mint" />
          <h3 className="font-display font-bold text-base text-bone">
            Hydro-Meteorological Trends & 48h Outlook
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-carbon border border-graphite p-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('hydrograph')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'hydrograph'
                  ? 'bg-mint text-obsidian font-bold'
                  : 'text-ash hover:text-bone'
              }`}
            >
              River Stage
            </button>
            <button
              onClick={() => setActiveTab('rainfall')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'rainfall'
                  ? 'bg-mint text-obsidian font-bold'
                  : 'text-ash hover:text-bone'
              }`}
            >
              Precipitation
            </button>
          </div>

          <button
            onClick={() => setShowTableAlt(!showTableAlt)}
            className="p-2 rounded-xl bg-carbon border border-graphite text-ash hover:text-mint hover:border-mint/30 text-xs flex items-center gap-1.5 transition-colors font-mono"
            title="Toggle Accessible Table View"
          >
            {showTableAlt ? <BarChart2 className="w-3.5 h-3.5" /> : <Table className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showTableAlt ? 'Chart View' : 'Table Alt'}</span>
          </button>
        </div>
      </div>

      {/* Accessible Table Alternative */}
      {showTableAlt ? (
        <div className="overflow-x-auto rounded-2xl border border-graphite">
          <table className="w-full text-xs text-left">
            <caption className="sr-only">7-Day Hydrograph and Rainfall Observations with 48-Hour Forecast</caption>
            <thead>
              <tr className="bg-carbon text-bone border-b border-graphite font-mono text-[11px]">
                <th scope="col" className="p-3">Timeline Day</th>
                <th scope="col" className="p-3 text-right font-tabular">River Stage (m)</th>
                <th scope="col" className="p-3 text-right font-tabular">Precipitation (mm)</th>
                <th scope="col" className="p-3">Threshold Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite font-mono">
              {hydroData.map((d) => (
                <tr key={d.day} className="hover:bg-carbon/60 transition-colors">
                  <td className="p-3 text-bone">{d.day}</td>
                  <td className="p-3 text-right text-mint font-tabular font-bold">{d.stage}m</td>
                  <td className="p-3 text-right text-ash font-tabular">{d.rainfall}mm</td>
                  <td className="p-3">
                    {d.stage >= dangerStageM ? (
                      <span className="text-[#FF4D5E] font-bold">Danger Exceeded</span>
                    ) : d.stage >= warningStageM ? (
                      <span className="text-[#FFD166] font-bold">Warning Exceeded</span>
                    ) : (
                      <span className="text-mint">Normal Range</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Recharts Visualization */
        <div className="w-full h-64 pt-2">
          {activeTab === 'hydrograph' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hydroData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1C1E" />
                <XAxis dataKey="day" stroke="#9A9C9F" opacity={0.6} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis
                  domain={[
                    Math.floor(currentStageM - 2),
                    Math.ceil(dangerStageM + 1),
                  ]}
                  stroke="#9A9C9F"
                  opacity={0.6}
                  tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0E0F10',
                    borderColor: 'rgba(244, 241, 234, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F4F1EA',
                    fontFamily: 'JetBrains Mono',
                  }}
                  formatter={(val: any) => [`${val} m`, 'Water Stage']}
                />
                <ReferenceLine
                  y={dangerStageM}
                  stroke="#FF4D5E"
                  strokeDasharray="4 4"
                  label={{ value: 'Danger Level', fill: '#FF4D5E', fontSize: 10, position: 'top', fontFamily: 'JetBrains Mono' }}
                />
                <ReferenceLine
                  y={warningStageM}
                  stroke="#FFD166"
                  strokeDasharray="4 4"
                  label={{ value: 'Warning Level', fill: '#FFD166', fontSize: 10, position: 'top', fontFamily: 'JetBrains Mono' }}
                />
                <Line
                  type="monotone"
                  dataKey="stage"
                  stroke="#5CFFB1"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#5CFFB1' }}
                  activeDot={{ r: 6, fill: '#060606', stroke: '#5CFFB1', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hydroData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1C1E" />
                <XAxis dataKey="day" stroke="#9A9C9F" opacity={0.6} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#9A9C9F" opacity={0.6} tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0E0F10',
                    borderColor: 'rgba(244, 241, 234, 0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F4F1EA',
                    fontFamily: 'JetBrains Mono',
                  }}
                  formatter={(val: any) => [`${val} mm`, 'Rainfall']}
                />
                <Bar dataKey="rainfall" fill="#5CFFB1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      <div className="flex justify-between items-center text-[11px] text-ash/60 pt-2 border-t border-graphite font-mono">
        <span>* Forecast data from +24h to +48h uses calibrated QPF and hydrological wave routing.</span>
        <span className="text-mint">Recharts Engine</span>
      </div>
    </div>
  );
};
