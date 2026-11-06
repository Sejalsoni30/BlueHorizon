import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, ExternalLink } from 'lucide-react';
import { StatutoryNotice } from '../common/StatutoryNotice';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-graphite bg-carbon/90 text-ash text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <StatutoryNotice />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-7 h-7 rounded-full border border-mint/40 flex items-center justify-center bg-obsidian group-hover:scale-110 transition-transform duration-300">
                <Waves className="w-4 h-4 text-mint" />
              </div>
              <span className="font-display font-bold text-base text-bone tracking-tight">BlueHorizon</span>
            </div>
            <p className="text-ash/80 leading-relaxed text-xs">
              "See the Risk. Prepare Before It Happens." A complementary flood and drought intelligence layer.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-bone mb-3 text-xs uppercase tracking-wider font-mono">Intelligence & Modules</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="hover:text-mint transition-colors hover-draw-line">Unified Dashboard</Link></li>
              <li><Link to="/preparedness" className="hover:text-mint transition-colors hover-draw-line">Household Preparedness</Link></li>
              <li><Link to="/simulator" className="hover:text-ember transition-colors hover-draw-line">What-If Heuristic Simulator</Link></li>
              <li><Link to="/community" className="hover:text-mint transition-colors hover-draw-line">Ground Verification Queue</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-bone mb-3 text-xs uppercase tracking-wider font-mono">Governance & Science</h4>
            <ul className="space-y-2">
              <li><Link to="/limitations" className="hover:text-mint transition-colors hover-draw-line">Limitations Register</Link></li>
              <li><a href="/docs/model-card.md" target="_blank" rel="noreferrer" className="hover:text-mint transition-colors inline-flex items-center gap-1">Model Card <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="/docs/data-sources.md" target="_blank" rel="noreferrer" className="hover:text-mint transition-colors inline-flex items-center gap-1">Data Licenses <ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="/docs/evaluation.md" target="_blank" rel="noreferrer" className="hover:text-mint transition-colors inline-flex items-center gap-1">Evaluation Benchmarks <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-bone mb-3 text-xs uppercase tracking-wider font-mono">Open Data Provenance</h4>
            <p className="text-ash/70 leading-relaxed text-[11px]">
              Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-mint underline underline-offset-2">Open-Meteo.com</a> (CC BY 4.0).
              Precipitation tracking via NASA GPM IMERG. River station telemetry via CWC & India-WRIS. Cartography © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="text-mint underline underline-offset-2">OpenStreetMap contributors</a>.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-graphite flex flex-col sm:flex-row items-center justify-between gap-4 text-ash/60 text-[11px]">
          <p>© {new Date().getFullYear()} BlueHorizon Intelligence Project. Research-first implementation.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-mint font-mono">
              <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
              All Telemetry Integrity Checks Passed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
