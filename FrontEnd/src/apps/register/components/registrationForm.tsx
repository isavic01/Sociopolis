import { useState } from 'react'
import { SubmitButton } from './buttons'
import { TermsModal } from './terms'
import { PrivacyModal } from './terms'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth' // adjust path as needed
import { auth, db } from '../../services/firebaseConfig' // adjust path as needed (can move later)
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'


export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

    const isValidPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
    return regex.test(password)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidPassword(password)) {
      setPasswordError('password must be at least 6 characters and include uppercase, lowercase, and a number')
      return
    } 
    else {
      setPasswordError('')
    }

    try {
      const trimmedEmail = email.trim()
      const trimmedName = name.trim()
      const numericAge = Number(age)

      const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password)
      const user = cred.user

      if (trimmedName) {
        await updateProfile(user, { displayName: trimmedName })
      }

      await setDoc(doc(db, 'users', user.uid), {
        displayName: trimmedName,
        age: numericAge,
        termsAccepted: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        xp: 0,
        level: 0,
        admin: false,
        email: trimmedEmail,
        emailVerified: false
      })

      await sendEmailVerification(user)
      
      alert('Account created! Please check your email for verification!')
      navigate('/auth') //update with routes
    } catch (error: any) {
      alert(`Registration Error: ${error.message}`)
    }
  }

  return (
    <div className = "p-16 py-12 flex flex-col justify-center items-center gap-y-4">
      <h1 className="h2 !text-4xl">Welcome to Sociopolis!</h1>
      <h2 className="h3 !font-normal !text-2xl">Let's create an account to get started.</h2>
      <img className="h-auto w-35" src="/src/assets/soci.png"></img>

      <form onSubmit={handleRegister} className="flex flex-col justify-center items-center !gap-y-2">
        <input
          className="!bg-[#F7F7F7] !border !text-[#C0C0C0] border-[#D9D9D9] focus:border-[#75BBFF] !px-4 !py-2 !mx-2 !rounded-lg w-full focus:outline-none"
          placeholder="Display-Name (Public)"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="!bg-[#F7F7F7] !border !text-[#C0C0C0] border-[#D9D9D9] focus:border-[#75BBFF] !px-4 !py-2 !mx-2 !rounded-lg w-full focus:outline-none"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <input
          className="!bg-[#F7F7F7] !border !text-[#C0C0C0] border-[#D9D9D9] focus:border-[#75BBFF] !px-4 !py-2 !mx-2 !rounded-lg w-full focus:outline-none"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="!bg-[#F7F7F7] !border !text-[#C0C0C0] border-[#D9D9D9] focus:border-[#75BBFF] !px-4 !py-2 !mx-2 !rounded-lg w-full focus:outline-none"
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
              className="!bg-[#F7F7F7] !text-[#838080] !border p !border-[#D9D9D9] !px-4 !py-2 !mx-2 !rounded-lg focus:outline-none"
              onClick={() => setShowTerms(true)}
            >
              Terms & Conditions
            </button>{' '}
            and{' '}
            <button
              type="button"
              className="!bg-[#F7F7F7] !text-[#838080] !border p !border-[#D9D9D9] !px-4 !py-2 !mx-2 !rounded-lg focus:outline-none"
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

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} isOpen={true} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} isOpen={true} />}
    </div>
  )
}


