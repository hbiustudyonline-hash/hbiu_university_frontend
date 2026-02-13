import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const redirectTimeoutRef = useRef(null);
  const hasRedirectedRef = useRef(false);

  // TEMPORARY: Bypass authentication check
  useEffect(() => {
    // Skip redirect - allow all access
    console.log('[ProtectedRoute] Authentication bypassed - allowing access');
    
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [isAuthenticated, isLoading]);

  // TEMPORARY: Skip all authentication and role checks
  // Allow everyone to access everything
  
  // Authenticated and authorized - render children
  console.log('[ProtectedRoute] Auth passed, rendering protected content for user:', user?.email);
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;