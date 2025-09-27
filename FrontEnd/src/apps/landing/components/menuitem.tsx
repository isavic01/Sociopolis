export const MenuItem = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    className="menu-button"
    onClick={onClick}
  >
    {label}
  </button>
)
