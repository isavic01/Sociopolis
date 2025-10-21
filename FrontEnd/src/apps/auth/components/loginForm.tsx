import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../services/firebaseConfig'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    await signInWithEmailAndPassword(auth, email, password)
    navigate('/landing') // or your target route
  } catch (err: any) {
    console.error('Login error:', err)
    alert(`Login failed: ${err.message}`)
  }
}


  return (
    <div className="background-login">
      <h1 className="h1">Welcome back to Sociopolis!</h1>
      <br></br>
      <h2 className="h3">Its great to see you again, have fun learning .</h2>
      <img className="soci" src="/src/assets/soci.png"></img>

      <form onSubmit={handleLogin}>
        <input
          className="input-box"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="input-box"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  )
}