// pages/Dashboard.tsx — role router
import { useAuth, ROLES } from "../../contexts/AuthContext";
import AdminDashboard    from "./admin_dashboard";
import StaffDashboard    from "./staff_dashboard";
import CustomerDashboard from "./customer_dashboard";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case ROLES.ADMIN:
    case ROLES.RECEPTIONIST:
      return <AdminDashboard />;
    case ROLES.MECHANIC:
      return <StaffDashboard />;
    case ROLES.CUSTOMER:
      return <CustomerDashboard />;
    default:
      return <CustomerDashboard />;
  }
}