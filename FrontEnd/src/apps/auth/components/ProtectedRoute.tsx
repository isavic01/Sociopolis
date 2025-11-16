import { Navigate } from "react-router-dom";
import { useAuthContext } from "./authProvider";
import { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthContext();

  if (loading) return <p>Loading...</p>;
  if (!user || !user.emailVerified) return <Navigate to="/auth" replace />;

  return children;
}
