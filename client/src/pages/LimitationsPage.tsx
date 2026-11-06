import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { StatutoryNotice } from '../components/common/StatutoryNotice';
import { ShieldAlert, BookOpen, Lock, AlertTriangle } from 'lucide-react';

export const LimitationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-obsidian text-bone flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* Header */}
        <div className="pb-4 border-b border-graphite">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-mono mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Scientific Governance & Transparency Register</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-bone">
            Known Limitations & Uncertainty Bounds
          </h1>
          <p className="text-xs sm:text-sm text-ash">
            BlueHorizon operates under strict scientific honesty rules. We do not invent accuracy values, we expose sensor uncertainties, and we define the boundaries of our interpretive intelligence.
          </p>
        </div>

        <StatutoryNotice />

        <div className="space-y-6 text-xs sm:text-sm text-ash">
          {/* Section 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-graphite space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-mint flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-mint" /> 1. Boundary of Operational Mandate
            </h2>
            <p className="leading-relaxed">
              BlueHorizon is <strong className="text-bone">NOT an official warning authority</strong>. Under Indian law and the Disaster Management Act of 2005, official meteorological alerts, river danger declarations, and evacuation orders are issued exclusively by the India Meteorological Department (IMD), the Central Water Commission (CWC), the National Disaster Management Authority (NDMA), and State/District Disaster Management Authorities (SDMAs/DDMAs). BlueHorizon acts solely as a complementary intelligence layer to assist communities, volunteers, and municipal teams in interpreting authoritative data with localized context.
            </p>
          </div>

          {/* Section 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-graphite space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-mint flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-mint" /> 2. Model & Observational Data Limitations
            </h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed text-ash">
              <li>
                <strong className="text-bone">Ungauged Catchment Blind Spots</strong>: In tributary catchments without physical in-situ CWC or state river gauges, predictions rely on numerical hydrological routing and satellite proxies. These carry wider conformal uncertainty bands (±0.45m or greater).
              </li>
              <li>
                <strong className="text-bone">Upstream Dam Spillway Operations</strong>: River stage surges caused by emergency, unannounced upstream dam or barrage releases cannot be predicted by purely meteorological runoff models until discharge telemetry registers downstream.
              </li>
              <li>
                <strong className="text-bone">Pluvial Urban Drainage Limitations</strong>: While riverine stages are tracked, street-level storm sewer backups in urban centers depend heavily on micro-topography, illegal encroachments, and unmapped municipal stormwater drains.
              </li>
              <li>
                <strong className="text-bone">Telemetry Latency During Monsoon Extremes</strong>: Physical solar-powered telemetry sensors often suffer power drain, antenna misalignment, or flood washouts during peak storm conditions. When telemetry exceeds 6 hours of latency, BlueHorizon automatically flags "Degraded Confidence" and falls back to satellite reanalysis.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-graphite space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-mint flex items-center gap-2">
              <Lock className="w-4 h-4 text-mint" /> 3. Data Privacy & Ethical Boundaries
            </h2>
            <p className="leading-relaxed">
              BlueHorizon collects minimal personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-ash">
              <li>GPS coordinates are used strictly for local catchment resolution and are not sold or redistributed to third parties.</li>
              <li>Community ground verification photos are stripped of EXIF metadata before public display.</li>
              <li>Household preparedness profiles are stored locally on your device (`localStorage`) and are never sent to external commercial advertising networks.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
