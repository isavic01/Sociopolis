import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Top-left logo */}
      <div className="absolute top-4 left-4">
        <img
          src="/src/assets/svg/Sociopolis.svg"
          alt="Sociopolis Logo"
          className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto"
        />
      </div>

      {/* Main layout: soci image left, content right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center px-6 md:px-16 ">
        {/* Left: Soci image */}
        <div className="flex justify-center mt-[20vh]">
          <img
            src="/src/assets/soci.png"
            alt="Soci character"
            className="max-h-[400px] w-auto"
          />
        </div>

        {/* Right: Text and buttons */}
        <div className="flex flex-col items-center space-y-4 w-[40vw]">
          <h1 className="h3 font-semibold text-center w-full">
            The free, fun, effective way of learning sociology
          </h1>
          <br></br>
          <br></br>
          <button
            className="block w-[30vw] py-2 px-4 rounded text-white shadow-lg"
            style={{ backgroundColor: "#6698CC" }}
            onClick={() => navigate("/register")}
          >
            GET STARTED
          </button>
          <button
            className="block w-[30vw] py-2 px-4 rounded text-white shadow-sm"
            style={{ backgroundColor: "#283D52" }}
            onClick={() => navigate("/auth")}
          >
            I ALREADY HAVE AN ACCOUNT
          </button>
          <button
            className="block w-[30vw] py-2 px-4 rounded text-white shadow-md"
            style={{ backgroundColor: "black" }}
            onClick={() => navigate("/landing")}
          >
            Test Landing
          </button>
          </div>
      </div>
    </div>
  );
}