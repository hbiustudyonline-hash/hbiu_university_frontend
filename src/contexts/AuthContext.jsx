import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Only verify token if it looks like a real JWT (not mock)
          if (token && !token.startsWith('mock-')) {
            try {
              const response = await base44.auth.me();
              if (response.success || response.id) {
                setUser(response.data || response);
                localStorage.setItem('userData', JSON.stringify(response.data || response));
              }
            } catch (error) {
              console.warn('Token validation failed:', error);
              // Don't auto-logout on 401 during initial load
              if (error.message.includes('401')) {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                setUser(null);
                setIsAuthenticated(false);
              } else {
                logout();
              }
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const getUserRole = () => {
    return user?.role || 'guest';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isLecturer = () => {
    return user?.role === 'lecturer';
  };

  const isStudent = () => {
    return user?.role === 'student';
  };

  const isCollegeAdmin = () => {
    return user?.role === 'college_admin';
  };

  const getRedirectPath = (userData = null) => {
    const userToCheck = userData || user;
    if (!userToCheck) return '/';
    
    switch (userToCheck.role) {
      case 'admin':
        return '/AdminDashboard';
      case 'lecturer':
        return '/LecturerDashboard';
      case 'student':
        return '/Dashboard';
      case 'college_admin':
        return '/EnrollmentDashboard';
      default:
        return '/Dashboard';
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    getUserRole,
    isAdmin,
    isLecturer,
    isStudent,
    isCollegeAdmin,
    getRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;