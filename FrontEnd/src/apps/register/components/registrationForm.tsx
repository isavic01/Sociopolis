import { useState } from 'react'
import { SubmitButton } from './buttons'
import { TermsModal } from './terms'
import { PrivacyModal } from './terms'
import { createUserWithEmailAndPassword } from 'firebase/auth' // adjust path as needed
import { auth } from '../services/firebaseConfig' // adjust path as needed
import { useNavigate } from 'react-router-dom'


export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)


  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      alert('Account created!')
      navigate('/login') //update with routes
    } catch (error: any) {
      alert(`Registration Error: ${error.message}`)
    }
  }

  return (
    <div className="background-register">
      <h1 className="heading">Welcome to Sociopolis!</h1>
      <h2 className="subheading">Let's create an account to get started.</h2>

      <form onSubmit={handleRegister}>
        <input
          className="input-box"
          placeholder="Display-Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="input-box"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <input
          className="input-box"
          placeholder="Email"
          type="email"
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

        <label className="check-box">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            required
          />
          <span className="text">
            I accept the{' '}
            <button
              type="button"
              className="link"
              onClick={() => setShowTerms(true)}
            >
              Terms & Conditions
            </button>{' '}
            and{' '}
            <button
              type="button"
              className="link"
              onClick={() => setShowPrivacy(true)}
            >
              Privacy Policy
            </button>
          </span>
        </label>

        <SubmitButton
        label="Register"
        disabled={!accepted} />
      </form>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} isOpen={false} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} isOpen={false} />}
    </div>
  )
}



