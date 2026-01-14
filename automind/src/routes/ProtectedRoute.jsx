import { Navigate } from "react-router-dom";
import { auth } from "@/firebase";

export default function ProtectedRoute({ children }) {
  const user = auth.currentUser;
  const userRole = localStorage.getItem("role");

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Logged in but role NOT selected
  if (user && !userRole) {
    return <Navigate to="/role-selection" replace />;
  }

  // ✅ Logged in AND role selected
  return children;
}
