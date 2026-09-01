import { Navigate } from "react-router-dom";
import { useAuthContext } from "./authProvider";
import { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  return children;
}
