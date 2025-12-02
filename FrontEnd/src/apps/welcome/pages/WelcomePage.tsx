import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
  <div className="w-full h-screen">
  {/* Slide 1 */}
  <section className="relative min-h-screen overflow-hidden">
    {/* Logo */}
    <div className="absolute top-8 left-8 z-20">
      <img src="/src/assets/svg/Sociopolis.svg" alt="Sociopolis Logo" className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto" />
    </div>

    {/* Content */}
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

    {/* Skyline at bottom of first slide */}
    <div
      className="absolute bottom-0 left-0 w-full h-[400px] bg-repeat-x bg-bottom z-0 opacity-30"
      style={{
        backgroundImage: "url('/src/assets/city_skyline.png')",
        backgroundSize: 'auto 100%',
        backgroundPosition: 'center bottom'
      }}
    />
  </section>

  {/* Slide 2 */}
  <section className="min-h-screen bg-white flex flex-col items-center mt-[10vh] px-6">
  {/* Slide 2 content */}
  <h1 className="h2 text-center max-w-[40vw] mb-6">
    Our Goals
  </h1>
  <p className="text-center max-w-[65vw] text-2xl text-[#283D52] mb-24">
    Sociopolis empowers learners of every background to build social literacy
    through playful, accessible pathways that honor diverse cultures. We turn
    growth into an inclusive, engaging journey where skills are practiced,
    progress is visible, and every voice belongs.
  </p>

  <h1 className="h2 max-w-[40vw] mb-6 self-start px-12  pl-32">
    Notable Features?
  </h1>
</section>
<section
  className="min-h-screen bg-white flex flex-col items-center pt-[20vh] px-6"
  style={{
    background: "radial-gradient(circle at center, white 20%, #DFEAF5 100%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%"
  }}
>
  {/* Heading */}
  <h1 className="h2 max-w-[40vw] mb-6 self-start mb-10 pl-32">
    Meet The Team
  </h1>

  {/* Description */}
  <p className="text-center max-w-4xl mb-4 text-2xl pt-16 pb-32">
    Born at the University of Florida, Sociopolis is open‑source software
    making learning more accessible and enjoyable.
  </p>

  {/* Team grid */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    <img
      src="/src/assets/testTeammemebr.jpeg"
      alt="Team member 1"
      className="w-48 h-48 object-cover rounded-full mx-auto shadow-md"
    />
    <img
      src="/src/assets/testTeammemebr.jpeg"
      alt="Team member 2"
      className="w-48 h-48 object-cover rounded-full mx-auto shadow-md"
    />
    <img
      src="/src/assets/testTeammemebr.jpeg"
      alt="Team member 3"
      className="w-48 h-48 object-cover rounded-full mx-auto shadow-md"
    />
    <img
      src="/src/assets/testTeammemebr.jpeg"
      alt="Team member 4"
      className="w-48 h-48 object-cover rounded-full mx-auto shadow-md"
    />
  </div>
</section>


</div>
  );
}