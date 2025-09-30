export const HamburgerButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="icon-button"
    aria-label="Open menu"
  >
    <img
      src="/src/assets/hamburger.png" //adjust once imported and created
      alt="Menu Expand Button"
      className="icon-button"
    />
  </button>
)

