import LoginForm from '../components/loginForm';
import { Navbar } from '../components/navbar';

export default function LoginPage() {
  return (
    <div className="login-page">
      <Navbar />
      <LoginForm />
    </div>
  );
}
