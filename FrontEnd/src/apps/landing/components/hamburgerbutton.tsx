export const HamburgerButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute bottom-4 left-4 z-50 p-2 rounded !border-transparent !bg-transparent w-10 h-10 !p-0"
    aria-label="Toggle menu"
  >
    <img
      src="/src/assets/svg/hamburger.svg" // adjust path as needed
      alt="Menu Expand Button"
      className=""
    />
  </button>
)
