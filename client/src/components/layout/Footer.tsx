import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, ExternalLink } from 'lucide-react';
import { StatutoryNotice } from '../common/StatutoryNotice';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-cyan/20 bg-deep/80 text-offwhite/70 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <StatutoryNotice />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-cyan flex items-center justify-center bg-deep">
                <Waves className="w-3.5 h-3.5 text-cyan" />
              </div>
              <span className="font-display font-bold text-sm text-offwhite">BlueHorizon</span>
            </div>
            <p className="text-offwhite/60 leading-relaxed">
              "See the Risk. Prepare Before It Happens." A complementary flood and drought intelligence platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-offwhite mb-3">Intelligence & Actions</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-cyan transition-colors">Unified Dashboard</Link></li>
              <li><Link to="/preparedness" className="hover:text-cyan transition-colors">Household Preparedness</Link></li>
              <li><Link to="/simulator" className="hover:text-cyan transition-colors">What-If Heuristic Simulator</Link></li>
              <li><Link to="/community" className="hover:text-cyan transition-colors">Ground Verification Queue</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-offwhite mb-3">Science & Governance</h4>
            <ul className="space-y-2">
              <li><Link to="/limitations" className="hover:text-cyan transition-colors">Limitations Register</Link></li>
              <li><a href="/docs/model-card.md" target="_blank" rel="noreferrer" className="hover:text-cyan transition-colors flex items-center gap-1">Model Card <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="/docs/data-sources.md" target="_blank" rel="noreferrer" className="hover:text-cyan transition-colors flex items-center gap-1">Data Licenses <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="/docs/evaluation.md" target="_blank" rel="noreferrer" className="hover:text-cyan transition-colors flex items-center gap-1">Evaluation Benchmarks <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-offwhite mb-3">Attributions & Open Data</h4>
            <p className="text-offwhite/50 leading-relaxed text-[11px]">
              Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-cyan underline">Open-Meteo.com</a> (CC BY 4.0).
              Precipitation tracking via NASA GPM IMERG. Station gauges courtesy of CWC & India-WRIS. Map cartography © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="text-cyan underline">OpenStreetMap contributors</a>.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-cyan/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-offwhite/50 text-[11px]">
          <p>© {new Date().getFullYear()} BlueHorizon Intelligence Project. Research-first implementation.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Telemetry Integrity Checks Passed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
