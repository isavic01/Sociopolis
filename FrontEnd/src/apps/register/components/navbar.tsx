import { useNavigate } from 'react-router-dom'


export const Navbar = () => {
  const navigate = useNavigate()

  return (
    <nav className="register-nav">
      <img
        src="/assets/back-icon.png" //replace with back button img
        alt="Back"
        className="back-icon"
        onClick={() => navigate(-1)} // navigates to previous page
      />

      <button
        onClick={() => navigate('.../auth')}
        className="button"
      >
        Login
      </button>
    </nav>
  )
}

