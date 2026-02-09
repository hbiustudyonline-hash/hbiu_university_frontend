import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { base44 } from '@/api/base44Client';
import { AuthContext } from './AuthContextDefinition';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMountedRef = useRef(true);

  // Check for existing authentication on app load
  useEffect(() => {
    let cancelled = false;

    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        console.log('[AUTH] Checking auth status. Token exists:', !!token, 'User data exists:', !!userData);

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('[AUTH] Found stored user:', parsedUser.email);
          
          if (!cancelled) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
          
          // Only verify token if it looks like a real JWT (not mock)
          if (token && !token.startsWith('mock-')) {
            try {
              const response = await base44.auth.me();
              // Handle the response format: { success: true, data: userObject, message, timestamp }
              if (response && (response.success || response.id)) {
                // Backend returns { success: true, data: userObject }
                // So the actual user data is in response.data
                const updatedUser = response.data || response;
                
                if (!cancelled) {
                  setUser(updatedUser);
                  localStorage.setItem('userData', JSON.stringify(updatedUser));
                }
              }
            } catch (error) {
              console.error('[AUTH] Token validation error:', error.message);
              // Clear auth on 401 (invalid token)
              if (error.status === 401 || error.message?.includes('401')) {
                console.log('[AUTH] Token is invalid (401) - clearing authentication');
                if (!cancelled) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('userData');
                  setUser(null);
                  setIsAuthenticated(false);
                }
              } else {
                // For other errors (network, etc), keep auth state but log warning
                console.warn('[AUTH] Could not verify token due to error:', error.message);
                // Don't clear auth on network errors - user may still be authenticated
              }
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        if (!cancelled) {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          console.log('[AUTH] Auth check complete. isAuthenticated:', !!localStorage.getItem('token'));
        }
      }
    };

    checkAuthStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData, token) => {
    console.log('[AUTH] Login called with user:', userData?.email, 'Token:', token?.substring(0, 20) + '...');
    if (isMountedRef.current) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('[AUTH] Login successful, user authenticated:', userData?.email);
    }
  };

  const logout = () => {
    console.log('[AUTH] Logout called');
    if (isMountedRef.current) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
  };

  const updateUser = (updatedUserData) => {
    if (isMountedRef.current) {
      setUser(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
    }
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