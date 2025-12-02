import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="relative w-full z-50 flex justify-between h-24">
      <img
        src="/src/assets/svg/Backarrow.svg" //replace with back button img
        alt="Back"
        className="mx-6 my-8 w-8 h-8"
        onClick={() => navigate(-1)} // navigates to previous page
      />

      <button
      onClick={() => navigate('/register')}
      className="btn-block absolute top-8 right-8">
        Sign up
      </button>
    </nav>
  );
};
