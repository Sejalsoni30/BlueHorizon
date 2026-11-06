import React, { createContext, useContext, useState, useEffect } from 'react';

interface PreferencesContextType {
  lowBandwidth: boolean;
  setLowBandwidth: (val: boolean) => void;
  toggleLowBandwidth: () => void;
  prefersReducedMotion: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lowBandwidth, setLowBandwidthState] = useState<boolean>(() => {
    return localStorage.getItem('bh_low_bandwidth') === 'true';
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const setLowBandwidth = (val: boolean) => {
    setLowBandwidthState(val);
    localStorage.setItem('bh_low_bandwidth', String(val));
  };

  const toggleLowBandwidth = () => {
    setLowBandwidth(!lowBandwidth);
  };

  return (
    <PreferencesContext.Provider
      value={{
        lowBandwidth,
        setLowBandwidth,
        toggleLowBandwidth,
        prefersReducedMotion,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within a PreferencesProvider');
  return ctx;
};
