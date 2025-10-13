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
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
    const user = cred.user
    await user.reload()

    if (!user.emailVerified) {
      alert('Please verify your email before logging in.')
      await auth.signOut()
      return
    }

    navigate('/landing')
  } catch (err: any) {
    console.error('Login error:', err)
    alert(`Login failed: ${err.message}`)
  }
}


  return (
    <div className="background-login">
      <h1 className="heading">Welcome to Sociopolis!</h1>
      <br></br>
      <h2 className="subheading">Let's create an account to get started.</h2>
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