import { RegistrationForm } from '../components/registrationForm'
import { Navbar } from '../components/navbar'

export default function RegisterPage() {
  return (
    <div className="register-page">
        <Navbar />
      <RegistrationForm />
    </div>
  )
}
