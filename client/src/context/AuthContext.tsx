import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'citizen' | 'volunteer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  householdProfile?: {
    infantsCount: number;
    elderlyCount: number;
    mobilityImpaired: boolean;
    dwellingType: 'ground_floor' | 'upper_floor' | 'independent_house';
    hasLivestock: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (userData: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateHouseholdProfile: (profile: NonNullable<User['householdProfile']>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bh_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('bh_token');
  });

  const login = (userData: User, token: string, refreshToken: string) => {
    setUser(userData);
    setAccessToken(token);
    localStorage.setItem('bh_user', JSON.stringify(userData));
    localStorage.setItem('bh_token', token);
    localStorage.setItem('bh_refresh_token', refreshToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('bh_user');
    localStorage.removeItem('bh_token');
    localStorage.removeItem('bh_refresh_token');
  };

  const updateHouseholdProfile = (profile: NonNullable<User['householdProfile']>) => {
    if (!user) return;
    const updated = { ...user, householdProfile: profile };
    setUser(updated);
    localStorage.setItem('bh_user', JSON.stringify(updated));
  };

  useEffect(() => {
    // If no user is logged in, initialize a default demo session for instant accessibility
    if (!user) {
      const demoUser: User = {
        id: 'demo_user_01',
        name: 'Resident Citizen (Demo)',
        email: 'citizen@bluehorizon.local',
        role: 'citizen',
        householdProfile: {
          infantsCount: 1,
          elderlyCount: 1,
          mobilityImpaired: false,
          dwellingType: 'ground_floor',
          hasLivestock: true,
        },
      };
      setUser(demoUser);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        updateHouseholdProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

