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
        
        // Check if we have a valid token
        if (storedToken && storedToken.length > 50 && !storedToken.startsWith('mock-')) {
          // We have what looks like a real JWT token
          if (storedUserData) {
            const parsedUser = JSON.parse(storedUserData);
            if (!cancelled) {
              setUser(parsedUser);
              setIsAuthenticated(true);
              console.log('[AUTH] Using stored user:', parsedUser.email, 'Role:', parsedUser.role);
            }
          }
          setIsLoading(false);
          return;
        }

        // No valid token - auto-login as admin to get a real JWT token
        console.log('[AUTH] No valid token found. Auto-logging in as admin...');
        try {
          const response = await base44.auth.login('admin@hbiu.edu', 'admin123');
          
          if (response.success && response.data) {
            const { user: userData, token } = response.data;
            if (!cancelled) {
              setUser(userData);
              setIsAuthenticated(true);
              localStorage.setItem('token', token);
              localStorage.setItem('userData', JSON.stringify(userData));
              console.log('[AUTH] Auto-login successful. User:', userData.email, 'Role:', userData.role);
            }
          } else {
            throw new Error('Auto-login failed');
          }
        } catch (loginError) {
          console.error('[AUTH] Auto-login failed:', loginError.message);
          // Fallback to mock user
          const defaultUser = getInitialUser();
          if (!cancelled) {
            setUser(defaultUser);
            setIsAuthenticated(true);
            localStorage.setItem('userData', JSON.stringify(defaultUser));
            console.log('[AUTH] Using fallback admin user');
          }
        }
        
        if (!cancelled) {
          setIsLoading(false);
        }
        return;

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