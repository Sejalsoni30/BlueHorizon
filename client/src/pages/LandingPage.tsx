import React, { useState, useEffect, useRef } from 'react';
import { Hero3DCanvas } from '../components/hero/Hero3DCanvas';
import { HorizonLine } from '../components/motion/HorizonLine';
import { LoaderRing } from '../components/motion/LoaderRing';
import { MidPagePlate } from '../components/landing/MidPagePlate';
import { CompetitorComparisonSection } from '../components/landing/CompetitorComparisonSection';
import { InnovationsSection } from '../components/landing/InnovationsSection';
import { InteractiveTeaser3D } from '../components/hero/InteractiveTeaser3D';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ShieldCheck, ArrowRight, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const LandingPage: React.FC = () => {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionsRef.current) return;

    // Staggered blur-to-sharp depth settle for landing sections
    const elements = sectionsRef.current.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          filter: 'blur(12px)',
          y: 40,
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, [loaderComplete]);

  return (
    <div className="relative min-h-screen bg-abyss text-offwhite overflow-x-hidden selection:bg-cyan selection:text-abyss">
      {/* 0->100% Loader Ring */}
      {!loaderComplete && <LoaderRing onComplete={() => setLoaderComplete(true)} />}

      {/* Signature Motion: Luminous Horizon Line */}
      <HorizonLine />

      {/* Top Navigation */}
      <Navbar />

      <main ref={sectionsRef} className="relative z-10 space-y-12">
        {/* Full-bleed Hero with 3D canvas and tilting risk card */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          <Hero3DCanvas />
        </section>

        {/* Competitor Gap Analysis Benchmarking */}
        <div className="reveal-on-scroll">
          <CompetitorComparisonSection />
        </div>

        {/* Mid-Page Logo Horizon Folding Plate */}
        <div className="reveal-on-scroll">
          <MidPagePlate />
        </div>

        {/* The 5 Strategic MVP Innovations */}
        <div className="reveal-on-scroll">
          <InnovationsSection />
        </div>

        {/* Interactive Draggable What-If Terrain Teaser */}
        <div className="reveal-on-scroll">
          <InteractiveTeaser3D />
        </div>

        {/* Community Ground-Truth Network Teaser */}
        <section className="reveal-on-scroll max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-panel p-8 rounded-2xl border border-cyan/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> Crowdsourced Ground Validation
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-offwhite">
                Empowering Community Field Observers
              </h3>
              <p className="text-xs sm:text-sm text-offwhite/70">
                Volunteer responders and citizens cross-verify local water ingress, clogged culverts, and drought dry-wells. Reports are deduplicated with GPS clustering and verified before publishing.
              </p>
            </div>
            <Link
              to="/community"
              className="px-5 py-3 rounded-lg bg-cyan text-abyss font-semibold text-xs sm:text-sm hover:bg-cyan/90 transition-all flex items-center gap-2 cyan-border-glow whitespace-nowrap"
            >
              <span>Submit or Verify Ground Reports</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Data Transparency & Final CTA */}
        <section className="reveal-on-scroll max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan/30 bg-deep/80 text-xs text-cyan">
            <Database className="w-3.5 h-3.5" /> Full Data Provenance & Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-offwhite">
            Ready to Explore Localised Environmental Intelligence?
          </h2>
          <p className="text-xs sm:text-sm text-offwhite/75 max-w-xl mx-auto leading-relaxed">
            All telemetry is checked for freshness, all probabilities are calibrated, and all guidance complements official emergency directives.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg bg-cyan text-abyss font-bold text-sm hover:bg-cyan/90 transition-all cyan-border-glow"
            >
              Open Live Intelligence Canvas
            </Link>
            <Link
              to="/preparedness"
              className="px-6 py-3 rounded-lg glass-card border border-cyan/30 text-offwhite text-sm font-semibold hover:text-cyan transition-colors"
            >
              Create Household Action Plan
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
