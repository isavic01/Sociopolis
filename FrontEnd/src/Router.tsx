import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import WelcomePage from "./apps/welcome/pages/WelcomePage"
import RegisterPage from "./apps/register/pages/register"
import LoginPage from "./apps/auth/pages/login"
import LandingPage from "./apps/landing/pages/landing"
import ProtectedRoute from "./apps/auth/components/ProtectedRoute"
import PublicRoute from "./apps/auth/components/PublicRoute"


function GameLanding() {
  return (
    <div>
      <h1>Main Game page</h1>
      <Link to="/lesson">Lessons</Link>
    </div>
  )
}
function Lesson() { return <h1>Lesson</h1> }
function Leaderboard() { return <h1>Leaderboard</h1> }
function Welcome() { return <WelcomePage /> }

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element=
        {
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />
        {/* Protected routes */}
        <Route
          path="/landing"
          element={
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
   
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  )
}