import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
  <div className="w-full h-screen">
  <section className="relative min-h-screen overflow-hidden">
    <div className="absolute top-8 left-8 z-20">
      <img src="/src/assets/svg/Sociopolis.svg" alt="Sociopolis Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto" />
    </div>


    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 min-h-screen md:px-16 z-20">
      <div className="flex justify-center mt-[40vh]">
        <img src="/src/assets/soci.png" alt="Soci character" className="max-h-[400px] w-auto" />
      </div>
      <div className="flex flex-col items-center mt-[10vh] space-y-8 py-4">
        <h1 className="h3 text-center max-w-[40vw]">
          The free, fun, effective way of learning sociology
        </h1>
        <br />
        <br />
        <button className="btn" onClick={() => navigate("/register")}>
          GET STARTED
        </button>
        <button className="btn-v1" onClick={() => navigate("/auth")}>
          I ALREADY HAVE AN ACCOUNT
        </button>
      </div>
    </div>


    <div
      className="absolute bottom-0 left-0 w-full h-[400px] bg-repeat-x bg-bottom z-0 opacity-30"
      style={{
        backgroundImage: "url('/src/assets/city_skyline.png')",
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center bottom'
      }}
    />
  </section>

  <section className="min-h-screen bg-white flex flex-col items-center mt-[10vh] px-6">
  <h1 className="h2 text-center max-w-[40vw] mb-6">
    Our Goals
  </h1>
  <p className="text-center max-w-[65vw] text-2xl text-[#283D52] mb-24">
    Sociopolis empowers learners of every background to build social literacy
    through playful, accessible pathways that honor diverse cultures. We turn
    growth into an inclusive, engaging journey where skills are practiced,
    progress is visible, and every voice belongs.
  </p>

  <h1 className="h2 max-w-[40vw] mb-12 self-start px-12 pl-32">
    Notable Features
  </h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-12 md:px-32 mb-24">
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
      <div className="text-3xl mb-4">📖</div>
      <h3 className="text-xl font-bold text-[#1E293B] mb-2">Interactive Lessons</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Learn critical sociological theories, structures, and norms through structured, slide-based learning maps.
      </p>
    </div>
    
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
      <div className="text-3xl mb-4">✨</div>
      <h3 className="text-xl font-bold text-[#1E293B] mb-2">Gamified Check-ins</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Earn experience points (XP) directly by completing quick comprehension check-ins embedded inside the lessons.
      </p>
    </div>

    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
      <div className="text-3xl mb-4">🏆</div>
      <h3 className="text-xl font-bold text-[#1E293B] mb-2">XP Leaderboard</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Track your community ranking, compete with others, and stay motivated as your level increases.
      </p>
    </div>

    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
      <div className="text-3xl mb-4">👤</div>
      <h3 className="text-xl font-bold text-[#1E293B] mb-2">Customizable Sprites</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Personalize your avatar guide companion that walks with you along the dynamic city learning route.
      </p>
    </div>

    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
      <div className="text-3xl mb-4">🌓</div>
      <h3 className="text-xl font-bold text-[#1E293B] mb-2">Personalized Theme</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Switch seamlessly between light and dark modes to tailor your reading contrast and color settings.
      </p>
    </div>

    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left">
      <div className="text-3xl mb-4">🔒</div>
      <h3 className="text-xl font-bold text-[#1E293B] mb-2">Secure Authentication</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        Keep your progress, attempts history, and personalization profile safe using Firebase authentication.
      </p>
    </div>
  </div>
</section>
<section
  className="min-h-screen bg-white flex flex-col items-center pt-[20vh] px-6"
  style={{
    background: "radial-gradient(circle at center, white 20%, #DFEAF5 100%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%"
  }}
>

  <h1 className="h2 max-w-[40vw] mb-6 self-start mb-10 pl-32">
    Meet The Team
  </h1>

  <p className="text-center max-w-4xl mb-4 text-2xl pt-16 pb-32">
    Born at the University of Florida, Sociopolis is open‑source software
    making learning more accessible and enjoyable.
  </p>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    <div className="flex flex-col items-center">
      <img
        src="/emily-headshot.jpg"
        alt="Emily Apel"
        className="w-48 h-48 object-cover rounded-full mx-auto shadow-md border-4 border-white mb-4"
      />
      <h3 className="text-lg font-bold text-[#283D52]">Emily Apel</h3>
      <p className="text-sm text-gray-500 font-medium text-center">Frontend Developer, UX Designer</p>
    </div>
    <div className="flex flex-col items-center">
      <img
        src="/isa-headshot.jpg"
        alt="Isabel Hernandez"
        className="w-48 h-48 object-cover rounded-full mx-auto shadow-md border-4 border-white mb-4"
      />
      <h3 className="text-lg font-bold text-[#283D52]">Isabel Hernandez</h3>
      <p className="text-sm text-gray-500 font-medium text-center">Project Manager, Developer</p>
    </div>
    <div className="flex flex-col items-center">
      <img
        src="/tomas-headshot.png"
        alt="Tomas Martinez"
        className="w-48 h-48 object-cover rounded-full mx-auto shadow-md border-4 border-white mb-4"
      />
      <h3 className="text-lg font-bold text-[#283D52]">Tomas Martinez</h3>
      <p className="text-sm text-gray-500 font-medium text-center">Full Stack Developer</p>
    </div>
    <div className="flex flex-col items-center">
      <img
        src="/vincent-headshot.jpg"
        alt="Vincent Lin"
        className="w-48 h-48 object-cover rounded-full mx-auto shadow-md border-4 border-white mb-4"
      />
      <h3 className="text-lg font-bold text-[#283D52]">Vincent Lin</h3>
      <p className="text-sm text-gray-500 font-medium text-center">Backend Developer</p>
    </div>
  </div>
</section>


</div>
  );
}