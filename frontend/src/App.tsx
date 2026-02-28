import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRouter from "./components/DashboardRouter";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected dashboard route - จะ redirect ตาม role อัตโนมัติ */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />

          {/* Direct dashboard routes (optional - สำหรับ bookmarking) */}
          <Route 
            path="/dashboard/admin" 
            element={
              <ProtectedRoute requiredRole={1}>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/staff" 
            element={
              <ProtectedRoute requiredRole={2}>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/customer" 
            element={
              <ProtectedRoute requiredRole={3}>
                <DashboardRouter />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}