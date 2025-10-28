import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../services/firebaseConfig'
import { db } from '../../services/firebaseConfig'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'

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
    await updateDoc(doc(db, 'users', user.uid), {
      emailVerified: true,
      updatedAt: serverTimestamp()
    })

    navigate('/landing')
  } catch (err: any) {
    console.error('Login error:', err)
    alert(`Login failed: ${err.message}`)
  }
}


  return (
    <div className="p-16 py-12 flex flex-col justify-center items-center gap-y-4">
      <h1 className="h2 !text-4xl">Welcome back to Sociopolis!</h1>
      <h2 className="h3 !font-normal !text-2xl">Its great to see you again, have fun learning .</h2>
      <img className="h-auto w-35" src="/src/assets/soci.png"></img>

      <form onSubmit={handleLogin} className="flex flex-col justify-center items-center !gap-y-2">
        <input
          className="!bg-[#F7F7F7] !border !text-[#C0C0C0] border-[#D9D9D9] focus:border-[#75BBFF] !px-4 !py-2 !mx-2 !rounded-lg w-full focus:outline-none"
          type="email"
          placeholder="Email"
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

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="!bg-[#75BBFF] !border !text-[#FFFFFF] border-[#000000] focus:border-[#75BBFF] !px-4 !py-2 !mx-2 !rounded-lg w-full focus:outline-none">
          Login
        </button>
      </form>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  )
}