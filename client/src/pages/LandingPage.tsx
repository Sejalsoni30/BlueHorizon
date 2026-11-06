import React, { useState } from 'react';
import { Hero3DCanvas } from '../components/hero/Hero3DCanvas';
import { HorizonLine } from '../components/motion/HorizonLine';
import { LoaderRing } from '../components/motion/LoaderRing';
import { StatementSection } from '../components/landing/StatementSection';
import { PinnedMorphSection } from '../components/landing/PinnedMorphSection';
import { HorizontalInnovationsSection } from '../components/landing/HorizontalInnovationsSection';
import { DitherVisualSection } from '../components/landing/DitherVisualSection';
import { InteractiveTeaser3D } from '../components/hero/InteractiveTeaser3D';
import { MarqueeStrip } from '../components/landing/MarqueeStrip';
import { CompetitorComparisonSection } from '../components/landing/CompetitorComparisonSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const [loaderComplete, setLoaderComplete] = useState(false);

  return (
    <div className="relative min-h-screen bg-obsidian text-bone overflow-x-hidden selection:bg-mint selection:text-obsidian">
      {/* Global Film-Grain Texture Overlay */}
      <div className="film-grain" />

      {/* 0->100% Loader Ring with Curtain Split */}
      {!loaderComplete && <LoaderRing onComplete={() => setLoaderComplete(true)} />}

      {/* Signature Motion: Top Scroll Progress & Luminous Horizon Line */}
      <HorizonLine />

      {/* Sticky Header */}
      <Navbar />

      <main className="relative z-10">
        {/* Full-bleed Hero with 3D Canvas, Character Mask Reveal, and Parallax Glass Card */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
          <Hero3DCanvas />
        </section>

        {/* 01: Statement Word-by-Word Scrubbed Reveal */}
        <StatementSection />

        {/* 02: Pinned Flood ↔ Drought Terrain Morph Storytelling */}
        <PinnedMorphSection />

        {/* 03: 5 Core Innovations Spotlight Cards */}
        <HorizontalInnovationsSection />

        {/* 04: Halftone / Dither Resolution Downscaling Visual */}
        <DitherVisualSection />

        {/* 05: Draggable What-If Scenario Stress-Test Teaser */}
        <InteractiveTeaser3D />

        {/* 06: Official Platforms & Research Gap Benchmarking */}
        <CompetitorComparisonSection />

        {/* Community Ground-Truth Callout Card */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-graphite flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-mint/30 bg-mint/10 text-mint text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> Crowdsourced Ground Validation
              </div>
              <h3 className="text-xl sm:text-3xl font-display font-extrabold text-bone tracking-tight">
                Empowering Community Field Observers
              </h3>
              <p className="text-xs sm:text-sm text-ash leading-relaxed">
                Volunteer responders and citizens cross-verify local water ingress, clogged culverts, and drought dry-wells. Reports undergo automated GPS clustering and two-tier volunteer verification.
              </p>
            </div>
            <Link
              to="/community"
              className="px-6 py-3.5 rounded-xl bg-mint text-obsidian font-bold text-xs sm:text-sm hover:bg-mint/90 transition-all flex items-center gap-2 mint-border-glow whitespace-nowrap"
            >
              <span>Submit or Verify Ground Reports</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Infinite Open Data Provenance Marquee */}
        <MarqueeStrip />

        {/* Final CTA with Magnetic Button */}
        <FinalCtaSection />
      </main>

      <Footer />
    </div>
  );
};
