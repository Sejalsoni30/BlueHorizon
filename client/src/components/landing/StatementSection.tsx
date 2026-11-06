import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePreferences } from '../../context/PreferencesContext';

gsap.registerPlugin(ScrollTrigger);

export const StatementSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const { prefersReducedMotion } = usePreferences();

  const statementText =
    "Traditional flood alerts arrive as raw river meters; drought advisories arrive weeks late in static PDFs. BlueHorizon unifies both hydro-climatic extremes into one explainable, confidence-calibrated intelligence layer that equips vulnerable households to act before disasters strike.";

  const words = statementText.split(' ');

  useEffect(() => {
    if (prefersReducedMotion || !textRef.current || !containerRef.current) return;

    const wordSpans = textRef.current.querySelectorAll('.word-scrub');

    gsap.fromTo(
      wordSpans,
      { color: '#3A3C40', opacity: 0.35 },
      {
        color: '#F4F1EA',
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: 0.6,
        },
      }
    );
  }, [prefersReducedMotion]);

  return (
    <section
      id="story-start"
      ref={containerRef}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32"
    >
      <div className="space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-mint font-semibold">
          01 // The System Mandate
        </span>
        <p
          ref={textRef}
          className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.25]"
        >
          {words.map((word, idx) => (
            <span key={idx} className="word-scrub inline-block mr-2 sm:mr-3 transition-colors">
              {word === 'BlueHorizon' ? (
                <span className="text-mint font-extrabold">{word}</span>
              ) : word === 'explainable,' ? (
                <span className="underline decoration-mint/50 underline-offset-8">{word}</span>
              ) : (
                word
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};
