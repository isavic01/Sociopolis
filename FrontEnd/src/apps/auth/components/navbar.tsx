import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="login-nav">
      <img
        src="/assets/back-icon.png" //change ig when you have the picture
        alt="Back"
        className="back-icon"
        onClick={() => navigate(-1)}
      />

      <button onClick={() => navigate('/register')} className="button">
        Sign up
      </button>
    </nav>
  );
};
