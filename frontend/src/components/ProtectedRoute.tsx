import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: number; // 1=Admin, 2=Staff, 3=Customer
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // ถ้ายังไม่ login ให้ redirect ไปหน้า login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ถ้ามีการระบุ role ที่ต้องการ
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect ไปยัง dashboard ตาม role ของผู้ใช้
    const dashboardPaths: { [key: number]: string } = {
      1: '/dashboard/admin',
      2: '/dashboard/staff', 
      3: '/dashboard/customer'
    };
    
    const targetPath = user ? dashboardPaths[user.role] || '/dashboard' : '/dashboard';
    return <Navigate to={targetPath} replace />;
  }

  return <>{children}</>;
}