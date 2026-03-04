import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { base44 } from '@/api/base44Client';
import { AuthContext } from './AuthContextDefinition';

export const AuthProvider = ({ children }) => {
  // Check for stored user or use default admin user
  const getInitialUser = () => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        return JSON.parse(storedUserData);
      } catch (e) {
        console.error('[AUTH] Error parsing stored userData:', e);
      }
    }
    // Default admin user if nothing stored
    return {
      id: 1,
      email: 'admin@hbiu.edu',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      full_name: 'Admin User'
    };
  };

  const [user, setUser] = useState(getInitialUser());
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const isMountedRef = useRef(true);

  // Check for existing authentication on app load
  useEffect(() => {
    let cancelled = false;

    const checkAuthStatus = async () => {
      try {
        const storedUserData = localStorage.getItem('userData');
        const storedToken = localStorage.getItem('token');
        
        console.log('[AUTH] Checking auth status. Token exists:', !!storedToken, 'User data exists:', !!storedUserData);
        
        // Check if we have both token and user data
        if (storedToken && storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          if (!cancelled) {
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log('[AUTH] Using stored user:', parsedUser.email, 'Role:', parsedUser.role);
          }
          
          // Optionally verify token with backend (only for real JWT tokens, not mock)
          if (storedToken.length > 50 && !storedToken.startsWith('mock-')) {
            try {
              const response = await base44.auth.me();
              if (response && (response.success || response.id)) {
                const updatedUser = response.data || response;
                if (!cancelled) {
                  setUser(updatedUser);
                  localStorage.setItem('userData', JSON.stringify(updatedUser));
                  console.log('[AUTH] Token verified, user updated');
                }
              }
            } catch (error) {
              console.warn('[AUTH] Token verification warning:', error.message);
              // Keep using stored user even if verification fails (could be network issue)
            }
          }
          
          if (!cancelled) {
            setIsLoading(false);
          }
          return;
        }

        // No token or user data - user needs to log in
        console.log('[AUTH] No stored auth data found. User needs to log in.');
        if (!cancelled) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('[AUTH] Error checking auth status:', error);
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
    console.log('[AUTH] Login called with user:', userData);
    console.log('[AUTH] User role:', userData?.role, 'Email:', userData?.email);
    if (isMountedRef.current) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('[AUTH] Login successful. Stored in localStorage:');
      console.log('[AUTH] - User:', userData?.email, 'Role:', userData?.role);
      console.log('[AUTH] - Token preview:', token?.substring(0, 20) + '...');
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
        return '/admin-dashboard';
      case 'lecturer':
        return '/lecturer-dashboard';
      case 'student':
        return '/dashboard';
      case 'college_admin':
        return '/enrollment';
      default:
        return '/dashboard';
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