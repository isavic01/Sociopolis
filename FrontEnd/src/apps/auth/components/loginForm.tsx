import { useState } from 'react';
//import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig'; // adjust if your path differs
import { useNavigate, Link } from 'react-router-dom';
import { SubmitButton } from '../../register/components/buttons'; //reused logic from register 

export default function LoginForm() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      //await signInWithEmailAndPassword(auth, email, password);
      nav('/gamelanding'); 
    } catch (e: any) {
      setErr(e?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="login-form">
      <h1 className="heading">Log in</h1>
      {err && <p className="error-text">{err}</p>}

      <input
        className="input-box"
        id="email-address"
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="input-box"
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <SubmitButton label={loading ? 'Signing in…' : 'Login'} disabled={loading} />

      <p className="text" style={{ marginTop: 12 }}>
        No account yet? <Link to="/signup" className="link">Create an account</Link>
      </p>
    </form>
  );
}
