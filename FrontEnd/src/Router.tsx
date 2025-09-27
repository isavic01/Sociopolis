import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import WelcomePage from "./apps/welcome/pages/WelcomePage";

function GameLanding() { return <div><h1>Main Game page</h1><Link to="/lesson">Lessons</Link></div>; }
function Login() { return <h1>Login</h1>; }
function Signup() { return <h1>Signup</h1>; }
function Lesson() { return <h1>Lesson</h1>; }
function Leaderboard() { return <h1>Leaderboard</h1>; }
function Welcome() {return WelcomePage(); }

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/gamelanding" element={<GameLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/lesson/:id" element={<Lesson />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
// As you build real pages in src/apps/landing/pages, src/apps/auth/pages, etc.:

// export default the page component from the file.

// Import it into the router or into each module’s routes.tsx.

// Replace the placeholder <h1> component with your real page.