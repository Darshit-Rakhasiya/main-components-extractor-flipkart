import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { email: string; role: string; username: string } | null;
  login: (userData: { email: string; role: string; username: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [user, setUser] = useState<{ email: string; role: string; username: string } | null>(null);

  const login = (userData: { email: string; role: string; username: string }) => {
    setUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
