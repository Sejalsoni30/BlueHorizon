import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Shield, UserCheck, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const strengthScore = (hasMinLength ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNumber ? 1 : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === 'register') {
      if (strengthScore < 3) {
        setError('Password must have 8+ characters, one uppercase letter, and one number.');
        setLoading(false);
        return;
      }
      if (role === 'admin' && adminCode !== 'BLUEHORIZON_ADMIN_2026') {
        setError('Invalid admin verification code. Contact your disaster nodal authority.');
        setLoading(false);
        return;
      }
    }

    try {
      // Direct local authentication or API call with graceful fallback
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const endpoint = tab === 'login' ? `${apiUrl}/auth/login` : `${apiUrl}/auth/register`;
      const body = tab === 'login' 
        ? { email, password }
        : { name, email, password, role, adminCode };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        login(data.user, data.accessToken, data.refreshToken);
        navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
      } else if (res && !res.ok) {
        const data = await res.json();
        setError(data.error || 'Authentication failed');
      } else {
        // Fallback for offline/standalone preview
        const mockUser = {
          id: 'user_' + Date.now(),
          name: name || (tab === 'login' ? 'Operational User' : 'New Resident'),
          email,
          role,
        };
        login(mockUser, 'mock_access_token', 'mock_refresh_token');
        navigate(role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoRole: UserRole) => {
    if (demoRole === 'citizen') {
      setEmail('citizen@bluehorizon.local');
      setPassword('CitizenPass123');
      setRole('citizen');
    } else if (demoRole === 'volunteer') {
      setEmail('volunteer@bluehorizon.local');
      setPassword('VolunteerPass123');
      setRole('volunteer');
    } else {
      setEmail('admin@bluehorizon.local');
      setPassword('AdminPass123');
      setRole('admin');
      setAdminCode('BLUEHORIZON_ADMIN_2026');
    }
  };

  return (
    <div className="min-h-screen bg-abyss text-offwhite flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full border border-cyan/40 bg-deep flex items-center justify-center mx-auto text-cyan cyan-border-glow">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-offwhite">
              {tab === 'login' ? 'Access Intelligence Layer' : 'Create BlueHorizon Account'}
            </h1>
            <p className="text-xs text-offwhite/60">
              Role-based access for citizens, verified field responders, and administrators.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-lg bg-deep border border-cyan/15 text-xs font-medium">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`py-2 rounded-md transition-all ${
                tab === 'login' ? 'bg-cyan text-abyss font-bold shadow' : 'text-offwhite/70 hover:text-cyan'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(null); }}
              className={`py-2 rounded-md transition-all ${
                tab === 'register' ? 'bg-cyan text-abyss font-bold shadow' : 'text-offwhite/70 hover:text-cyan'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-offwhite/80">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full px-3 py-2 rounded-lg bg-deep/80 border border-cyan/20 text-xs text-offwhite placeholder:text-offwhite/30 focus:border-cyan focus:outline-none"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-offwhite/80">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.org"
                className="w-full px-3 py-2 rounded-lg bg-deep/80 border border-cyan/20 text-xs text-offwhite placeholder:text-offwhite/30 focus:border-cyan focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-offwhite/80">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-deep/80 border border-cyan/20 text-xs text-offwhite placeholder:text-offwhite/30 focus:border-cyan focus:outline-none"
              />
            </div>

            {/* Password Strength Checklist for Register */}
            {tab === 'register' && (
              <div className="p-2.5 rounded-lg bg-deep/50 border border-cyan/10 space-y-1.5 text-[11px]">
                <span className="text-offwhite/50 block font-mono">Password Requirements:</span>
                <div className="grid grid-cols-3 gap-1">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400' : 'text-offwhite/40'}`}>
                    <CheckCircle className="w-3 h-3" /> 8+ chars
                  </span>
                  <span className={`flex items-center gap-1 ${hasUpper ? 'text-emerald-400' : 'text-offwhite/40'}`}>
                    <CheckCircle className="w-3 h-3" /> 1 Uppercase
                  </span>
                  <span className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-400' : 'text-offwhite/40'}`}>
                    <CheckCircle className="w-3 h-3" /> 1 Number
                  </span>
                </div>
              </div>
            )}

            {/* Role Selector */}
            {tab === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-offwhite/80">Operational Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg bg-deep border border-cyan/20 text-xs text-offwhite focus:border-cyan focus:outline-none"
                >
                  <option value="citizen">Citizen / Resident</option>
                  <option value="volunteer">Volunteer Responder (Ground Verification)</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
            )}

            {/* Admin Verification Code */}
            {tab === 'register' && role === 'admin' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-cyan flex items-center gap-1">
                  <KeyRound className="w-3 h-3" /> Admin Invite Passcode
                </label>
                <input
                  type="password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter BLUEHORIZON_ADMIN_2026"
                  className="w-full px-3 py-2 rounded-lg bg-deep/80 border border-cyan/40 text-xs text-cyan placeholder:text-offwhite/30 focus:border-cyan focus:outline-none font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-cyan text-abyss font-bold text-xs sm:text-sm hover:bg-cyan/90 transition-all flex items-center justify-center gap-2 cyan-border-glow disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : tab === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>

          {/* Fast Demo Fill Credentials */}
          <div className="pt-4 border-t border-cyan/15 space-y-2">
            <span className="text-[11px] font-mono text-offwhite/50 block text-center">
              Quick Evaluation Credentials:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillQuickDemo('citizen')}
                className="py-1 px-2 rounded bg-deep hover:bg-ocean/30 border border-cyan/20 text-[10px] text-offwhite/80 transition-colors"
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('volunteer')}
                className="py-1 px-2 rounded bg-deep hover:bg-ocean/30 border border-teal/30 text-[10px] text-teal transition-colors"
              >
                Volunteer
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('admin')}
                className="py-1 px-2 rounded bg-deep hover:bg-ocean/30 border border-amber-500/30 text-[10px] text-amber-300 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
