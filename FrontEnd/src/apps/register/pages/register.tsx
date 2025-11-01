import RegisterScreen from '../components/registrationForm'
import { Navbar } from '../components/navbar'
//import '../layout/register.css'
import '../layout/terms-modal.css'

export default function RegisterPage() {
  return (
    <div className="bg-[#FFFFFF]">
        <Navbar />
      <RegisterScreen />
    </div>
  )
}
