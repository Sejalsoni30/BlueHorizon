import React from 'react';
import { Target, Activity, HelpCircle, Layers, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const innovations = [
  {
    icon: Target,
    title: '1. Confidence-Aware Risk Communication',
    metric: 'Brier Score: 0.089',
    gap: 'Avoids deterministic false-alarm traps by providing calibrated probabilities and conformal quantile bounds instead of binary "Danger" declarations.',
    action: 'See Calibrated Gauges',
    link: '/dashboard',
  },
  {
    icon: Activity,
    title: '2. Environmental Data Reliability Monitor',
    metric: 'Real-time telemetry audit',
    gap: 'Flags sensor stuck-values, multi-hour transmission latency, and satellite-gauge divergences, automatically reducing displayed confidence when sensors fail.',
    action: 'View Telemetry Health',
    link: '/admin',
  },
  {
    icon: HelpCircle,
    title: '3. Hyperlocal Causal Narratives',
    metric: 'Explainable TreeSHAP',
    gap: 'Replaces abstract water heights (meters MSL) with plain-language explanations of why a flood or drought is intensifying in that specific catchment.',
    action: 'Inspect Risk Explanations',
    link: '/dashboard',
  },
  {
    icon: Layers,
    title: '4. Combined Flood + Drought Intelligence',
    metric: 'Dual-Hazard GIS',
    gap: 'Breaks administrative silos between flood and agriculture portals to track compound drought-to-flood whiplash where dry ground repels rainwater.',
    action: 'Explore Dual Map',
    link: '/dashboard',
  },
  {
    icon: ClipboardCheck,
    title: '5. Personalised Household Preparedness',
    metric: 'Profile-Driven Protocol',
    gap: 'Replaces generic, widely ignored PDF advice with tailored action checklists adapted to infants, elderly care, dwelling floor level, and livestock assets.',
    action: 'Build Household Checklist',
    link: '/preparedness',
  },
];

export const InnovationsSection: React.FC = () => {
  return (
    <section className="w-full py-16 bg-deep/30 border-y border-cyan/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal/30 bg-teal/10 text-teal text-xs font-medium">
            Research-Validated Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-offwhite">
            5 Core Innovations Closing the Gap
          </h2>
          <p className="text-xs sm:text-sm text-offwhite/70">
            Selected from our Phase 0 research to provide the highest real-world safety impact with verifiable data integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {innovations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="glass-panel p-6 rounded-2xl border border-cyan/20 hover:border-cyan/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-ocean/30 border border-cyan/30 flex items-center justify-center text-cyan group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan/80">{item.metric}</span>
                    </div>
                    <h3 className="text-base font-semibold text-offwhite group-hover:text-cyan transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-offwhite/70 leading-relaxed">
                    {item.gap}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-cyan/10">
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-xs text-cyan hover:underline font-medium"
                  >
                    <span>{item.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

