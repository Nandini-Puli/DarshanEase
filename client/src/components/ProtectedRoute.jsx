import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children, role, roles }) {
  const token = localStorage.getItem("token");
  const accountType = localStorage.getItem("accountType");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = roles || [role].filter(Boolean);

  if (allowedRoles.length && !allowedRoles.includes(accountType)) {
    if (accountType === "organizer") {
      return <Navigate to="/organizerhome" replace />;
    }

    if (accountType === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;