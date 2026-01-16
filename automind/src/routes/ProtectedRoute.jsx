import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, userRole, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/role-selection" />;

  return children;
}
