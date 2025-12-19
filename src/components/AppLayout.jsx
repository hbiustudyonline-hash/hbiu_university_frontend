import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Home, 
  Shield, 
  Building2,
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'lecturer':
        return 'bg-blue-100 text-blue-700';
      case 'college_admin':
        return 'bg-purple-100 text-purple-700';
      case 'student':
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'lecturer':
        return <GraduationCap className="w-4 h-4" />;
      case 'college_admin':
        return <Building2 className="w-4 h-4" />;
      case 'student':
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getInitials = (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.full_name) {
      const names = user.full_name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0].slice(0, 2).toUpperCase();
    }
    return user.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'lecturer':
        return '/lecturer-dashboard';
      case 'college_admin':
        return '/college-admin-dashboard';
      case 'student':
      default:
        return '/student-dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">HBI University</h1>
                <p className="text-xs text-gray-500">Online Studies Platform</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to={getDashboardPath(user?.role)} 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/courses" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Courses
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin-dashboard" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Administration
                </Link>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {user && (
                <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getRoleBadgeColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                  <span className="capitalize">{user.role.replace('_', ' ')}</span>
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardPath(user?.role)} className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;