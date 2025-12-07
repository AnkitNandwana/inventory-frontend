import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    const savedUser = authService.getUser();
    if (token && savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    if (response.success && response.token && response.user) {
      authService.setToken(response.token);
      authService.setUser(response.user);
      setUser(response.user);
    } else {
      throw new Error(response.message);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await authService.register(email, password, firstName, lastName);
    if (response.success && response.token && response.user) {
      authService.setToken(response.token);
      authService.setUser(response.user);
      setUser(response.user);
    } else {
      throw new Error(response.message);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      authService.removeToken();
      authService.removeUser();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
