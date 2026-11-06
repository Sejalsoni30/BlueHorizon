import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { StatutoryNotice } from '../components/common/StatutoryNotice';
import { useAuth } from '../context/AuthContext';
import {
  Server,
  Cpu,
  CheckCircle,
  Clock,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'models' | 'audit'>('pipeline');

  // Model validation metrics from approved research & model card
  const modelMetrics = {
    flood: {
      name: 'HistGradientBoostingClassifier + CalibratedClassifierCV',
      brierScore: 0.089,
      rocAuc: 0.912,
      prAuc: 0.841,
      pod: 0.88,
      far: 0.17,
      csi: 0.75,
      calibrationGainPct: 51,
      baselineBrier: 0.182,
      status: 'Production Calibrated',
    },
    drought: {
      name: 'HistGradientBoostingRegressor (SPEI-3 Estimator)',
      mae: 0.29,
      pearsonR: 0.87,
      f1Score: 0.82,
      baselineMae: 0.68,
      status: 'Production Calibrated',
    },
  };

  const ingestionSources = [
    { name: 'Open-Meteo REST API', frequency: 'Hourly', latency: '0.2h', status: 'Healthy', license: 'CC BY 4.0' },
    { name: 'NASA GPM IMERG (Early Run)', frequency: '30 mins', latency: '4.1h', status: 'Normal', license: 'NASA Open Data' },
    { name: 'CWC Telemetry Portal (India-WRIS)', frequency: '12-hourly', latency: '2.4h', status: 'Healthy', license: 'NDSAP India' },
    { name: 'NDMA SACHET CAP Feed', frequency: 'Event-driven', latency: '18 mins', status: 'Idle', license: 'NDSAP India' },
    { name: 'Copernicus Sentinel-1 SAR', frequency: '5-day revisit', latency: '2.5h (NRT)', status: 'Standby', license: 'Copernicus Open Access' },
  ];

  const auditLogs = [
    { id: '1', time: '18:14:02', event: 'Open-Meteo telemetry sync: 4 catchments ingested', level: 'INFO' },
    { id: '2', time: '17:45:18', event: 'Conformal interval calibrated for Pune Bund Garden (margin ±0.22m)', level: 'INFO' },
    { id: '3', time: '16:30:11', event: 'Data Quality Watchdog: Flagged Raichur agromet latency (3.2h lag)', level: 'WARN' },
    { id: '4', time: '15:10:44', event: 'Volunteer Patil verified Sangam Bridge overtopping report', level: 'AUTH' },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-bone flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-graphite">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-mint font-mono mb-1">
              <Server className="w-3.5 h-3.5" />
              <span>System Operations & Model Health Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-bone">
              Administrator Governance Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ash">Admin User:</span>
            <span className="px-2.5 py-1 rounded bg-carbon border border-graphite text-xs font-mono text-mint">
              {user?.email || 'admin@bluehorizon.local'}
            </span>
          </div>
        </div>

        <StatutoryNotice />

        {/* Tab Switcher */}
        <div className="flex flex-wrap rounded-xl bg-carbon border border-graphite p-1 text-xs font-medium gap-1">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'pipeline' ? 'bg-mint text-obsidian font-bold shadow' : 'text-ash hover:text-mint'
            }`}
          >
            Pipeline & Telemetry Health
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'models' ? 'bg-mint text-obsidian font-bold shadow' : 'text-ash hover:text-mint'
            }`}
          >
            Model Cards & Skill Metrics
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'audit' ? 'bg-mint text-obsidian font-bold shadow' : 'text-ash hover:text-mint'
            }`}
          >
            System Audit Log
          </button>
        </div>

        {/* Tab 1: Pipeline Health */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-graphite space-y-1">
                <span className="text-xs text-ash">Pipeline Latency</span>
                <div className="text-2xl font-bold font-mono text-mint font-tabular">0.2 hrs</div>
                <span className="text-[11px] text-mint/80 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Nominal Operating State
                </span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-graphite space-y-1">
                <span className="text-xs text-ash">Sensors Monitored</span>
                <div className="text-2xl font-bold font-mono text-mint font-tabular">592 Stations</div>
                <span className="text-[11px] text-ash">CWC Hydro Network</span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-graphite space-y-1">
                <span className="text-xs text-ash">Telemetry QC Pass Rate</span>
                <div className="text-2xl font-bold font-mono text-mint font-tabular">98.4%</div>
                <span className="text-[11px] text-ash">Stuck-value & outlier filter</span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-graphite space-y-1">
                <span className="text-xs text-ash">API Gateway Status</span>
                <div className="text-2xl font-bold font-mono text-mint font-tabular">100% Up</div>
                <span className="text-[11px] text-ash">Node.js Express + Python ML</span>
              </div>
            </div>

            {/* Ingestion Sources Table */}
            <div className="glass-panel p-6 rounded-2xl border border-graphite space-y-4">
              <h3 className="font-semibold text-sm text-bone">Ingestion Stream Register</h3>
              <div className="overflow-x-auto rounded-lg border border-graphite">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-graphite/40 text-bone border-b border-graphite">
                      <th scope="col" className="p-3">Source Name</th>
                      <th scope="col" className="p-3">Update Cadence</th>
                      <th scope="col" className="p-3">Operational Latency</th>
                      <th scope="col" className="p-3">License & Terms</th>
                      <th scope="col" className="p-3">Health Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-graphite/40">
                    {ingestionSources.map((s) => (
                      <tr key={s.name} className="hover:bg-graphite/20">
                        <td className="p-3 text-bone font-medium">{s.name}</td>
                        <td className="p-3 text-ash">{s.frequency}</td>
                        <td className="p-3 font-mono text-mint font-tabular">{s.latency}</td>
                        <td className="p-3 text-ash">{s.license}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-mint/10 border border-mint/30 text-mint">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Model Metrics */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flood Model Card */}
              <div className="glass-panel p-6 rounded-2xl border border-graphite space-y-4">
                <div className="pb-3 border-b border-graphite flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-mint" />
                    <h3 className="font-semibold text-sm text-bone">Flood Risk Model Card</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-mint/10 border border-mint/40 text-mint font-mono">
                    {modelMetrics.flood.status}
                  </span>
                </div>

                <p className="text-xs text-ash font-mono">{modelMetrics.flood.name}</p>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-carbon border border-graphite">
                    <span className="text-ash block text-[10px]">Brier Score</span>
                    <span className="text-lg font-bold font-mono text-mint font-tabular">
                      {modelMetrics.flood.brierScore}
                    </span>
                    <span className="text-[10px] text-mint block mt-0.5">
                      (-{modelMetrics.flood.calibrationGainPct}% vs base)
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-carbon border border-graphite">
                    <span className="text-ash block text-[10px]">ROC-AUC</span>
                    <span className="text-lg font-bold font-mono text-bone font-tabular">
                      {modelMetrics.flood.rocAuc}
                    </span>
                    <span className="text-[10px] text-ash block mt-0.5">PR-AUC: {modelMetrics.flood.prAuc}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-carbon border border-graphite">
                    <span className="text-ash block text-[10px]">CSI (Threat Score)</span>
                    <span className="text-lg font-bold font-mono text-mint font-tabular">
                      {modelMetrics.flood.csi}
                    </span>
                    <span className="text-[10px] text-ash block mt-0.5">POD: {modelMetrics.flood.pod}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-carbon text-[11px] text-ash space-y-1">
                  <span className="font-semibold text-mint">Validation Leakage Prevention:</span>
                  <p>Walk-forward expanding window time-series splits across 2018–2024 monsoon seasons. Spatial basin holdouts verified on Krishna and Godavari sub-catchments.</p>
                </div>
              </div>

              {/* Drought Model Card */}
              <div className="glass-panel p-6 rounded-2xl border border-graphite space-y-4">
                <div className="pb-3 border-b border-graphite flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-ember" />
                    <h3 className="font-semibold text-sm text-bone">Drought Model Card</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-ember/10 border border-ember/40 text-ember font-mono">
                    {modelMetrics.drought.status}
                  </span>
                </div>

                <p className="text-xs text-ash font-mono">{modelMetrics.drought.name}</p>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-carbon border border-graphite">
                    <span className="text-ash block text-[10px]">MAE (SPEI-3)</span>
                    <span className="text-lg font-bold font-mono text-ember font-tabular">
                      {modelMetrics.drought.mae}
                    </span>
                    <span className="text-[10px] text-mint block mt-0.5">
                      (vs 0.68 base)
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-carbon border border-graphite">
                    <span className="text-ash block text-[10px]">Pearson r</span>
                    <span className="text-lg font-bold font-mono text-bone font-tabular">
                      {modelMetrics.drought.pearsonR}
                    </span>
                    <span className="text-[10px] text-ash block mt-0.5">High correlation</span>
                  </div>
                  <div className="p-3 rounded-lg bg-carbon border border-graphite">
                    <span className="text-ash block text-[10px]">Weighted F1</span>
                    <span className="text-lg font-bold font-mono text-ember font-tabular">
                      {modelMetrics.drought.f1Score}
                    </span>
                    <span className="text-[10px] text-ash block mt-0.5">Tier classification</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-carbon text-[11px] text-ash space-y-1">
                  <span className="font-semibold text-ember">Methodological Standard:</span>
                  <p>Hargreaves potential evapotranspiration coupled with 90-day precipitation deficit. Quantile regression bounds provide calibrated statistical error envelopes.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Audit Log */}
        {activeTab === 'audit' && (
          <div className="glass-panel p-6 rounded-2xl border border-graphite space-y-4">
            <h3 className="font-semibold text-sm text-bone flex items-center gap-2">
              <Clock className="w-4 h-4 text-mint" /> Immutable Security & Telemetry Audit Log
            </h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-carbon border border-graphite flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-ash text-[11px] font-tabular">{log.time}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        log.level === 'WARN'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : log.level === 'AUTH'
                          ? 'bg-mint/10 text-mint border border-mint/30'
                          : 'bg-graphite text-mint border border-graphite'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-bone">{log.event}</span>
                  </div>
                  <span className="text-[10px] text-ash font-mono">Node Watchdog</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
