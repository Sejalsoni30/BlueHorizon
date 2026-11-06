import React, { useState } from 'react';
import { Target, Activity, HelpCircle, Layers, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const innovations = [
  {
    num: '01',
    icon: Target,
    title: 'Confidence-Aware Risk Communication',
    metric: 'Brier Score: 0.089',
    accent: 'mint',
    description: 'Eliminates binary false alarms by presenting calibrated probabilities and distribution-free conformal quantile bounds instead of ambiguous "Danger" declarations.',
    link: '/dashboard',
    linkText: 'Inspect Calibrated Gauges',
  },
  {
    num: '02',
    icon: Activity,
    title: 'Environmental Data Reliability Monitor',
    metric: 'Real-time telemetry audit',
    accent: 'mint',
    description: 'Actively monitors sensor stuck values, transmission latency, and satellite-gauge divergences, automatically degrading displayed confidence when hardware fails.',
    link: '/admin',
    linkText: 'View Telemetry Health',
  },
  {
    num: '03',
    icon: HelpCircle,
    title: 'Hyperlocal Causal Risk Narratives',
    metric: 'Explainable TreeSHAP',
    accent: 'ember',
    description: 'Replaces abstract water heights in meters with plain-language explanations of exactly why a flood surge or drought desiccation is intensifying in that specific basin.',
    link: '/dashboard',
    linkText: 'Explore Causal Drivers',
  },
  {
    num: '04',
    icon: Layers,
    title: 'Combined Flood + Drought Intelligence',
    metric: 'Dual-Hazard GIS',
    accent: 'mint',
    description: 'Bridges institutional silos between flood boards and agricultural departments to track the compound threat of dry soil crusts triggering catastrophic flash floods.',
    link: '/dashboard',
    linkText: 'Open Dual-Hazard Canvas',
  },
  {
    num: '05',
    icon: ClipboardCheck,
    title: 'Personalised Household Preparedness',
    metric: 'Profile-Driven Protocol',
    accent: 'ember',
    description: 'Adapts emergency checklists to household realities: infants, elderly dependents, ground-floor ingress risks, and farm livestock assets, fully printable for offline use.',
    link: '/preparedness',
    linkText: 'Build Household Action Plan',
  },
];

export const HorizontalInnovationsSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, cardIdx: -1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      cardIdx: idx,
    });
  };

  return (
    <section className="w-full py-24 sm:py-32 bg-obsidian border-b border-graphite overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-graphite">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-mint font-semibold">
              03 // Research-Validated Architecture
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-bone tracking-tight">
              5 Core Innovations <span className="text-mint">Closing The Gap</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ash max-w-md leading-relaxed">
            Directly addressing the 8 research gaps identified across national warning platforms (Google Flood Hub, CWC, NDMA, IDEWS).
          </p>
        </div>

        {/* Responsive Grid of Spotlight Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {innovations.map((item, idx) => {
            const Icon = item.icon;
            const isEmber = item.accent === 'ember';
            const isHovered = mousePos.cardIdx === idx;

            return (
              <div
                key={item.title}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => setMousePos((prev) => ({ ...prev, cardIdx: -1 }))}
                data-theme={isEmber ? 'drought' : 'flood'}
                className="group relative rounded-3xl p-7 bg-carbon border border-graphite transition-all duration-300 hover:border-mint/40 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
              >
                {/* Spotlight cursor glow */}
                {isHovered && (
                  <div
                    className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 opacity-100"
                    style={{
                      background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${
                        isEmber ? 'rgba(255, 122, 47, 0.18)' : 'rgba(92, 255, 177, 0.18)'
                      }, transparent 70%)`,
                    }}
                  />
                )}

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                        isEmber
                          ? 'border-ember/30 bg-ember/10 text-ember group-hover:scale-105'
                          : 'border-mint/30 bg-mint/10 text-mint group-hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold text-ash/40 group-hover:text-bone transition-colors">
                      {item.num}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-[11px] text-ash block">{item.metric}</span>
                    <h3 className="font-display font-bold text-lg text-bone group-hover:text-mint transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-ash leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="relative z-10 pt-5 mt-6 border-t border-graphite">
                  <Link
                    to={item.link}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold hover-draw-line ${
                      isEmber ? 'text-ember' : 'text-mint'
                    }`}
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
