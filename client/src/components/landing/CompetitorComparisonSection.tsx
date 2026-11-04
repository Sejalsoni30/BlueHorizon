import React from 'react';
import { ExternalLink, Check, Minus } from 'lucide-react';

interface PlatformRow {
  name: string;
  agency: string;
  sourceUrl: string;
  scope: string;
  flood: boolean | 'partial';
  drought: boolean | 'partial';
  uncertainty: boolean | 'partial';
  telemetryHealth: boolean;
  hyperlocalWhy: boolean | 'partial';
  preparedness: boolean | 'partial';
}

const platforms: PlatformRow[] = [
  {
    name: 'Google Flood Hub',
    agency: 'Google Research',
    sourceUrl: 'https://sites.research.google/floods/',
    scope: 'AI riverine flood prediction (LSTM) in 80+ countries',
    flood: true,
    drought: false,
    uncertainty: 'partial',
    telemetryHealth: false,
    hyperlocalWhy: 'partial',
    preparedness: false,
  },
  {
    name: 'FloodWatch India (v2.0)',
    agency: 'Central Water Commission (CWC)',
    sourceUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2044810',
    scope: '592 river stations & 150 reservoirs in India',
    flood: true,
    drought: false,
    uncertainty: false,
    telemetryHealth: false,
    hyperlocalWhy: false,
    preparedness: false,
  },
  {
    name: 'NDMA SACHET',
    agency: 'NDMA & C-DOT',
    sourceUrl: 'https://sachet.ndma.gov.in/',
    scope: 'National CAP disaster alert dissemination backbone',
    flood: 'partial',
    drought: false,
    uncertainty: false,
    telemetryHealth: false,
    hyperlocalWhy: false,
    preparedness: 'partial',
  },
  {
    name: 'C-FLOOD',
    agency: 'C-DAC & CWC (NSM)',
    sourceUrl: 'https://nsmindia.in/',
    scope: 'Supercomputer 2D hydrodynamic inundation forecasts',
    flood: true,
    drought: false,
    uncertainty: false,
    telemetryHealth: false,
    hyperlocalWhy: true,
    preparedness: false,
  },
  {
    name: 'IDEWS / Drought Atlas',
    agency: 'IIT Gandhinagar',
    sourceUrl: 'https://sites.google.com/iitgn.ac.in/vmishra/drought',
    scope: 'Real-time multi-index drought monitoring & CFSv2 forecasting',
    flood: false,
    drought: true,
    uncertainty: 'partial',
    telemetryHealth: false,
    hyperlocalWhy: 'partial',
    preparedness: false,
  },
  {
    name: 'BlueHorizon (Complementary)',
    agency: 'BlueHorizon Intelligence',
    sourceUrl: '/docs/evaluation.md',
    scope: 'Complementary intelligence, telemetry reliability & preparedness',
    flood: true,
    drought: true,
    uncertainty: true,
    telemetryHealth: true,
    hyperlocalWhy: true,
    preparedness: true,
  },
];

export const CompetitorComparisonSection: React.FC = () => {
  const renderIcon = (val: boolean | 'partial') => {
    if (val === true) return <Check className="w-4 h-4 text-emerald-400 mx-auto" />;
    if (val === 'partial') return <span className="text-[11px] font-medium text-amber-400 font-mono">Partial</span>;
    return <Minus className="w-4 h-4 text-offwhite/20 mx-auto" />;
  };

  return (
    <section className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan/30 bg-deep/60 text-cyan text-xs">
            Evidence-Based Platform Analysis
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-offwhite">
            Benchmarking Official Systems & Research Gaps
          </h2>
          <p className="text-xs sm:text-sm text-offwhite/70 leading-relaxed">
            Existing government and research platforms excel in specialized hydro-meteorological modeling. BlueHorizon sits downstream, solving the communication, telemetry health, and household actionability bottlenecks.
          </p>
        </div>

        {/* Accessible Table Container */}
        <div className="overflow-x-auto rounded-xl border border-cyan/20 glass-panel">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cyan/20 bg-ocean/20 text-offwhite font-medium">
                <th scope="col" className="p-3.5 sm:p-4">Platform & Agency</th>
                <th scope="col" className="p-3.5 sm:p-4 text-center">Flood Forecast</th>
                <th scope="col" className="p-3.5 sm:p-4 text-center">Drought Monitor</th>
                <th scope="col" className="p-3.5 sm:p-4 text-center">Uncertainty Bounds</th>
                <th scope="col" className="p-3.5 sm:p-4 text-center">Telemetry Health Flag</th>
                <th scope="col" className="p-3.5 sm:p-4 text-center">Explainable 'Why'</th>
                <th scope="col" className="p-3.5 sm:p-4 text-center">Tailored Action Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan/10">
              {platforms.map((p) => (
                <tr
                  key={p.name}
                  className={`${
                    p.name.includes('BlueHorizon')
                      ? 'bg-cyan-dim/40 font-semibold border-t-2 border-cyan/40'
                      : 'hover:bg-deep/40 transition-colors'
                  }`}
                >
                  <td className="p-3.5 sm:p-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-offwhite font-medium">{p.name}</span>
                      <a
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan/70 hover:text-cyan"
                        title="View Official Source"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <span className="text-[11px] text-offwhite/50 block">{p.agency}</span>
                  </td>
                  <td className="p-3.5 sm:p-4 text-center">{renderIcon(p.flood)}</td>
                  <td className="p-3.5 sm:p-4 text-center">{renderIcon(p.drought)}</td>
                  <td className="p-3.5 sm:p-4 text-center">{renderIcon(p.uncertainty)}</td>
                  <td className="p-3.5 sm:p-4 text-center">{renderIcon(p.telemetryHealth)}</td>
                  <td className="p-3.5 sm:p-4 text-center">{renderIcon(p.hyperlocalWhy)}</td>
                  <td className="p-3.5 sm:p-4 text-center">{renderIcon(p.preparedness)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-offwhite/50 text-center">
          * Sources cited from official publications (CWC, NDMA, IITGN, Google Research). Audited November 2026.
        </p>
      </div>
    </section>
  );
};
