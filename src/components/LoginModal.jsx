import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, User, GraduationCap, Building2, Shield } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login } = useAuth();
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Registration form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await base44.auth.login(loginData.email, loginData.password);
      
      if (response.success || response.data) {
        const userData = response.data?.user || response.user || response.data;
        const token = response.data?.token || response.token;
        
        login(userData, token);
        
        // Redirect based on role
        const redirectPath = getRoleBasedRedirect(userData.role);
        window.location.href = redirectPath;
        
        onClose();
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await base44.auth.register(registerData);
      
      if (response.success || response.user) {
        setSuccess('Registration successful! You can now login.');
        setActiveTab('login');
        setRegisterData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'student'
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBasedRedirect = (role) => {
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

  const getDemoCredentials = () => {
    return [
      { role: 'Admin', email: 'admin@hbiu.edu', password: 'password123' },
      { role: 'Lecturer', email: 'lecturer@hbiu.edu', password: 'password123' },
      { role: 'College Admin', email: 'college@hbiu.edu', password: 'password123' },
      { role: 'Student', email: 'student@hbiu.edu', password: 'password123' }
    ];
  };

  const handleDemoLogin = (email, password) => {
    setLoginData({ email, password });
    setActiveTab('login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Welcome to HBIU Online Studies
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="demo">Demo</TabsTrigger>
          </TabsList>
          
          {(error || success) && (
            <Alert className={success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
              <AlertDescription className={success ? "text-green-700" : "text-red-700"}>
                {error || success}
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regEmail">Email</Label>
                <Input
                  id="regEmail"
                  type="email"
                  placeholder="john.doe@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={registerData.role}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="college_admin">College Administrator</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regPassword">Password</Label>
                <Input
                  id="regPassword"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="demo" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center mb-4">
                Try different user roles with these demo accounts:
              </p>
              {getDemoCredentials().map((demo, index) => (
                <Card key={index} className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardContent className="p-3">
                    <div 
                      className="flex items-center justify-between"
                      onClick={() => handleDemoLogin(demo.email, demo.password)}
                    >
                      <div className="flex items-center space-x-3">
                        {getRoleIcon(demo.role.toLowerCase().replace(' ', '_'))}
                        <div>
                          <p className="font-medium text-sm">{demo.role}</p>
                          <p className="text-xs text-gray-500">{demo.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Try Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;