import { useNavigate } from "react-router-dom";
import '../layout/welcome.css'

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className = "flex items-center px-4 py-3">
        <img className="h-4 sm:h-6 md:h-8 lg:h-10 w-auto" src="/src/assets/svg/Sociopolis.svg"></img>
      </div>
      <div className= "container">
      <h1 className = "h3" >The free, fun, effective way of learning sociology</h1>

      <div className = "buttonBox">
        <button className ="button" style={{backgroundColor:"#6698CC"}}  onClick={() => navigate("/auth")}>
          Log In
        </button>
        <button className = "button" style={{backgroundColor:"#283D52"}} onClick={() => navigate("/register")}>
          Sign Up
        </button>
        <button
          style={{backgroundColor:"#black"}}
          className = "button"
          onClick={() => navigate("/landing")}
        >
          Test Landing
        </button>
      </div>
      </div>
    </div>
  );
}

