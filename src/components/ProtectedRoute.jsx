import { useAuth } from '@/hooks/useAuth';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const redirectTimeoutRef = useRef(null);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Only redirect once and only after loading is complete
    if (!isLoading && !isAuthenticated && !hasRedirectedRef.current) {
      console.log('[ProtectedRoute] Auth check complete - not authenticated, redirecting to login');
      hasRedirectedRef.current = true;
      // Use a small delay to ensure auth state is fully settled
      redirectTimeoutRef.current = setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
    
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [isAuthenticated, isLoading]);

  // Show loading while checking auth - but use a consistent loading UI
  if (isLoading) {
    console.log('[ProtectedRoute] Still loading auth state...');
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and still here, wait for redirect
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, waiting for redirect...');
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('[ProtectedRoute] User role not allowed. User role:', user?.role, 'Allowed roles:', allowedRoles);
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  // Authenticated and authorized - render children
  console.log('[ProtectedRoute] Auth passed, rendering protected content for user:', user?.email);
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string)
};

export default ProtectedRoute;