import React, { useRef, useState } from 'react';
import { ArrowRight, ShieldCheck, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinalCtaSection: React.FC = () => {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const pullX = (e.clientX - centerX) * 0.35;
    const pullY = (e.clientY - centerY) * 0.35;
    setBtnPos({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    setBtnPos({ x: 0, y: 0 });
  };

  return (
    <section className="relative w-full py-28 sm:py-36 bg-obsidian overflow-hidden border-t border-graphite">
      {/* Background radial gradient rising from bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-mint/15 via-ember/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-mint/30 bg-carbon text-xs font-mono text-mint">
          <Waves className="w-3.5 h-3.5" />
          <span>Continuous Environmental Intelligence</span>
        </div>

        <h2 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-bone tracking-tight leading-[1.08]">
          Ready to <span className="text-mint mint-glow">See The Risk</span> Before It Happens?
        </h2>

        <p className="text-sm sm:text-base text-ash max-w-xl mx-auto leading-relaxed">
          Open the live canvas to inspect catchment hydrographs, analyze root-zone moisture deficits, and generate tailored action plans for your household.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            ref={btnRef}
            to="/dashboard"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `translate3d(${btnPos.x}px, ${btnPos.y}px, 0)`,
            }}
            className="px-8 py-4 rounded-2xl bg-mint text-obsidian font-display font-bold text-sm sm:text-base hover:bg-mint/90 transition-transform duration-100 ease-out mint-border-glow inline-flex items-center gap-2.5 shadow-2xl"
          >
            <span>Launch Intelligence Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/preparedness"
            className="px-8 py-4 rounded-2xl bg-carbon hover:bg-graphite border border-graphite text-bone text-sm sm:text-base font-semibold transition-all hover:border-mint/30"
          >
            Household Preparedness
          </Link>
        </div>

        <div className="pt-6 flex items-center justify-center gap-6 text-xs font-mono text-ash/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-mint" /> 100% Free & Open Access
          </span>
          <span>•</span>
          <span>Zero Commercial Tracking</span>
        </div>
      </div>
    </section>
  );
};

