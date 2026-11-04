import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, Menu, X, Globe, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyan/20 bg-abyss/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full border border-cyan flex items-center justify-center bg-deep/80 cyan-border-glow group-hover:scale-105 transition-transform">
            <Waves className="w-4 h-4 text-cyan" />
          </div>
          <span className="font-display font-bold text-lg text-offwhite tracking-tight">
            Blue<span className="text-cyan">Horizon</span>
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-cyan bg-cyan-dim border border-cyan/30'
                    : 'text-offwhite/80 hover:text-cyan hover:bg-deep/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-cyan/20 bg-deep/60 text-offwhite/90 text-xs hover:border-cyan/50 transition-colors"
            title="Switch Language (English / हिंदी)"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan" />
            <span className="font-medium">{i18n.language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          <Link
            to="/auth"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded bg-ocean/40 hover:bg-ocean border border-cyan/30 text-xs font-medium text-offwhite transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan" />
            <span>Login / Join</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded text-offwhite/70 hover:text-cyan focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-deep/95 border-b border-cyan/20">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded text-sm text-offwhite/90 hover:text-cyan hover:bg-ocean/20"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/auth"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-cyan font-medium"
          >
            Login / Citizen Registration
          </Link>
        </div>
      )}
    </header>
  );
};
