import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { SmoothScroll } from './components/motion/SmoothScroll';
import { CustomCursor } from './components/motion/CustomCursor';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PreparednessPage } from './pages/PreparednessPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { CommunityPage } from './pages/CommunityPage';
import { AdminPage } from './pages/AdminPage';
import { LimitationsPage } from './pages/LimitationsPage';

export const App: React.FC = () => {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <SmoothScroll>
          <CustomCursor />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/preparedness" element={<PreparednessPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/limitations" element={<LimitationsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SmoothScroll>
      </AuthProvider>
    </PreferencesProvider>
  );
};

export default App;
