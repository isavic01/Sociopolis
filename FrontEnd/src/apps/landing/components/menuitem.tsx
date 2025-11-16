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
  className="flex items-center gap-2 px-3 !py-5 w-full text-left
            !bg-transparent !border-transparent !rounded-none"
>
  <img
    src={iconSrc}
    alt={`${label} icon`}
    className="w-8 h-8 !object-contain !align-middle"
  />
  <h4 className="!m-[0] !text-md leading-none !self-center">{label}</h4>
</button>
)
