import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../pages/dashboard/admin_dashboard';
import StaffDashboard from '../pages/dashboard/staff_dashboard';
import CustomerDashboard from '../pages/dashboard/customer_dashboard';

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route ไปยัง dashboard ตาม role
  switch (user.role) {
    case 1: // Admin
      return <AdminDashboard />;
    case 2: // Staff
      return <StaffDashboard />;
    case 3: // Customer
      return <CustomerDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}