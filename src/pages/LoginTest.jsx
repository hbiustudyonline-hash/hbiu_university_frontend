import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function SimpleLoginTest() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogin = () => {
    // Simple redirect to home with login functionality
    window.location.href = '/';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">HBIU Login System</h1>
        
        {isAuthenticated && user ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                Welcome, {user.firstName || user.full_name || 'User'}!
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-blue-600 capitalize">
                Role: {user.role?.replace('_', ' ')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => {
                  const path = user.role === 'admin' ? '/admin-dashboard' :
                              user.role === 'lecturer' ? '/lecturer-dashboard' :
                              user.role === 'college_admin' ? '/college-admin-dashboard' :
                              '/student-dashboard';
                  window.location.href = path;
                }}
              >
                Go to Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Please login to access the dashboard
            </p>
            <Button className="w-full" onClick={handleLogin}>
              Login / Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}