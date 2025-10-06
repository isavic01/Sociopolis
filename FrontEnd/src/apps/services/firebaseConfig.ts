import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBrPuJ3kAXmcz3Xs5sgphJRnzndWMNTTaY',
  authDomain: 'sociopolis-bff81.firebaseapp.com',
  projectId: 'sociopolis-bff81',
  storageBucket: 'sociopolis-bff81.firebasestorage.app',
  messagingSenderId: '380051301679',
  appId: '1:380051301679:web:8db334cda9eff6d7006dda',
  measurementId: 'G-TNDGLMXJ4K',
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app