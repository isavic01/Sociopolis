import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SubmitButton } from './buttons'
import { createUserWithEmailAndPassword } from 'firebase/auth' // adjust path as needed
import { auth } from '../services/firebaseConfig' // adjust path as needed

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  const navigation = useNavigation()

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      Alert.alert('Success', 'Account created!')
      navigation.navigate('Login') // update after routes
    } catch (error: any) {
      Alert.alert('Registration Error', error.message)
    }
  }

  return (
    <div className="background-register">
      <h1 className="heading">Welcome to Sociopolis!</Text>
      <h2 className="subheading">Lets create an account to get started.</Text>

      <input
        className="input-box"
        placeholder="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />


      <input
        className="input-box"
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

      <input
          className="input-box"
          type="age"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
      />


      <form onSubmit={handleRegister}>
        <SubmitButton label="Register" />
      </form>
    </div>
  )
}

export const RegistrationForm = () => {
  // form logic here
  return (
    <form>
      {/* inputs */}
      <SubmitButton label="Register" />
    </form>
  )
}
