import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, Menu, X, Globe, UserCheck, Zap, ZapOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePreferences } from '../../context/PreferencesContext';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lowBandwidth, toggleLowBandwidth } = usePreferences();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  const navLinks = [
    { to: '/', label: t('nav.home', 'Home') },
    { to: '/dashboard', label: t('nav.dashboard', 'Intelligence') },
    { to: '/preparedness', label: t('nav.preparedness', 'Preparedness') },
    { to: '/simulator', label: t('nav.simulator', 'What-If') },
    { to: '/community', label: t('nav.community', 'Community') },
    { to: '/limitations', label: t('nav.limitations', 'Limitations') },
    { to: '/admin', label: t('nav.admin', 'Admin') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-obsidian/85 backdrop-blur-xl border-b border-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full border border-mint/40 flex items-center justify-center bg-carbon group-hover:border-mint transition-all duration-300">
            <Waves className="w-4 h-4 text-mint" />
          </div>
          <span className="font-display font-bold text-lg text-bone tracking-tight">
            Blue<span className="text-mint">Horizon</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-mint bg-mint/10 border border-mint/25 font-semibold'
                    : 'text-ash hover:text-bone hover:bg-carbon'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Low Bandwidth Toggle */}
          <button
            onClick={toggleLowBandwidth}
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              lowBandwidth
                ? 'bg-ember/15 border-ember/35 text-ember'
                : 'bg-carbon border-graphite text-ash hover:text-bone hover:border-mint/30'
            }`}
            title={lowBandwidth ? 'Low-bandwidth mode active (3D & effects off)' : 'Toggle low-bandwidth mode'}
            aria-label="Toggle low bandwidth mode"
          >
            {lowBandwidth ? <ZapOff className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            <span>{lowBandwidth ? 'Lite' : 'HD'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-graphite bg-carbon text-ash text-xs hover:text-bone hover:border-mint/30 transition-colors"
            title="Switch Language (English / हिंदी)"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-mint" />
            <span className="font-medium">{i18n.language === 'hi' ? 'EN' : 'हिन्दी'}</span>
          </button>

          <Link
            to="/auth"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon hover:bg-graphite border border-graphite hover:border-mint/30 text-xs font-semibold text-bone transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-mint" />
            <span>Login / Join</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-ash hover:text-bone focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 space-y-1 bg-carbon border-b border-graphite">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-ash hover:text-bone hover:bg-graphite"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-graphite flex items-center justify-between">
            <button
              onClick={toggleLowBandwidth}
              className="text-xs text-ash flex items-center gap-1.5"
            >
              {lowBandwidth ? <ZapOff className="w-3.5 h-3.5 text-ember" /> : <Zap className="w-3.5 h-3.5 text-mint" />}
              <span>Mode: {lowBandwidth ? 'Lite (Fast)' : 'High Fidelity'}</span>
            </button>
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-mint font-semibold"
            >
              Login / Registration
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
