import { Navigate } from "react-router-dom"
import { useAuthContext } from "./authProvider"
import { JSX } from "react"

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthContext()

  if (loading) return <p>Loading...</p>
  if (user) return <Navigate to="/landing" replace />

  return children
}
