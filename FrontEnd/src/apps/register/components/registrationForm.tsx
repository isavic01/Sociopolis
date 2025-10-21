import { useState } from 'react'
import { SubmitButton } from './buttons'
import { TermsModal } from './terms'
import { PrivacyModal } from './terms'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../services/firebaseConfig'
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

  const isValidPassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  return regex.test(password)
  }
  const [passwordError, setPasswordError] = useState('')
  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    await setDoc(doc(db, 'users', user.uid), {
      displayName: name,
      age: Number(age),
      termsAccepted: true,
      xp: 0,
    })

    alert('Account created!')
    navigate('/auth')
  } catch (error: any) {
    alert(`Registration Error: ${error.message}`)
  }
}

  return (
    <div className= "container">
      <h1 className="h1">Welcome to Sociopolis!</h1>
      <br></br>
      <h2 className="h3">Let's create an account to get started.</h2>
      <img className="soci" src="/src/assets/soci.png"></img>

      <form onSubmit={handleRegister}>
        <div>
        <input
          className="text"
          placeholder="Display-Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        </div>
        <div>
        <input
          className="text"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        </div>
        <input
          className="text"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
        <input
          className="text"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
           const value = e.target.value
            setPassword(value)
            setPasswordError(isValidPassword(value) ? '' : 'Password must be at least 6 characters and include uppercase, lowercase, and a number.')
          }}
          required
        />
        </div>
        <div>
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
        </div>
        <SubmitButton
        label="Register"
        disabled={!accepted} />
      </form>

      <TermsModal onClose={() => setShowTerms(false)} isOpen={showTerms} />
      <PrivacyModal onClose={() => setShowPrivacy(false)} isOpen={showPrivacy} />
    </div>
  )
}


