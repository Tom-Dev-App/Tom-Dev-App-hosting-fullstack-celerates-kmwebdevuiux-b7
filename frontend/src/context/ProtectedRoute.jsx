import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import { hasRoleAccess } from "../services/authService";

export const ProtectedRoute = ({requiredRoles}) => {
  const {isLoggedIn, accessSecret} = useUser()
  const location = useLocation()
  const hasAccess = hasRoleAccess(requiredRoles, accessSecret)

  if(!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  return hasAccess ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} />
  )
}

export const PublicRoute = () => {
  const {token} = useUser()
  const isAuthenticated = !!token;
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

