export const MenuItem = ({
  label,
  iconSrc,
  onClick,
}: {
  label: string
  iconSrc: string
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 w-full text-left 
               !bg-transparent !border-transparent !rounded-none"
  >
    <img
      src={iconSrc}
      alt={`${label} icon`}
      className="w-8 h-8 mb-2 object-contain"
    />
    <span className="h4 !text-md">{label}</span>
  </button>
)
