import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Home";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import LecturerDashboard from "./LecturerDashboard";
// import CollegeAdminDashboard from "./CollegeAdminDashboard"; // Temporarily disabled
import LoginTest from "./LoginTest";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from '@/contexts/AuthContext';

// Dashboard router based on user role
function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'lecturer':
      return <LecturerDashboard />;
    case 'college_admin':
      return <AdminDashboard />; // Temporary fallback
    case 'student':
    default:
      return <Dashboard />;
  }
}

export default function Pages() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lecturer-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['lecturer', 'admin']}>
              <LecturerDashboard />
            </ProtectedRoute>
          } 
        />
{/* Temporarily disabled due to JSX issues
        <Route 
          path="/college-admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['college_admin', 'admin']}>
              <CollegeAdminDashboard />
            </ProtectedRoute>
          } 
        />
        */}
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/test-login" element={<LoginTest />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}