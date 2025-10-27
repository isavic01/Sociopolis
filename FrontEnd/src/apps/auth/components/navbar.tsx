import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full z-50 flex justify-between h-24">
      <img
        src="/src/assets/svg/Backarrow.svg" //replace with back button img
        alt="Back"
        className="!mx-6 !my-8 w-8 h-8"
        onClick={() => navigate(-1)} // navigates to previous page
      />

      <button
      onClick={() => navigate('/register')}
      className="!bg-[#F7F7F7] !border-2 !text-[#75BBFF] !border-[#D9D9D9] !px-4 !mx-4 !my-5 !rounded-2xl">
        Sign up
      </button>
    </nav>
  );
};
