import { createContext, useState, useEffect, useContext } from 'react';
import { refreshToken as refreshTokenApi, logout as logoutApi } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = () => {
      const token = localStorage.getItem('bearerToken');
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      const userEmail = localStorage.getItem('userEmail');
      
      if (token && tokenExpiry && new Date(parseInt(tokenExpiry)) > new Date()) {
        setIsAuthenticated(true);
        setUser({ email: userEmail });
      } else if (token) {
        // Token exists but might be expired, try to refresh
        handleRefreshToken();
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleRefreshToken = async () => {
    try {
      await refreshTokenApi();
      const userEmail = localStorage.getItem('userEmail');
      setIsAuthenticated(true);
      setUser({ email: userEmail });
    } catch (error) {
      // Refresh failed, clear auth state
      handleLogout();
    }
  };

  const handleLogin = (email, tokens) => {
    localStorage.setItem('bearerToken', tokens.bearerToken.token);
    localStorage.setItem('refreshToken', tokens.refreshToken.token);
    localStorage.setItem('tokenExpiry', Date.now() + (tokens.bearerToken.expires_in * 1000));
    localStorage.setItem('userEmail', email);
    
    setIsAuthenticated(true);
    setUser({ email });
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('bearerToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('userEmail');
      
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login: handleLogin,
        logout: handleLogout,
        refreshToken: handleRefreshToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


