import { createContext, useContext, useState, useEffect } from 'react';
import { userData } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('neuron_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === 'demo@neuron.ai' && password === 'neuron123') {
      const u = { ...userData, isLoggedIn: true };
      localStorage.setItem('neuron_user', JSON.stringify(u));
      setUser(u);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const loginAsDemo = () => {
    const u = { ...userData, isLoggedIn: true };
    localStorage.setItem('neuron_user', JSON.stringify(u));
    setUser(u);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('neuron_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
