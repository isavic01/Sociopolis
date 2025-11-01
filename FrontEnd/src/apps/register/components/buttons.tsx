import React from 'react'

type SubmitButtonProps = {
  label?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  label = 'Submit',
  onClick,
  type = 'submit',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="shadow-sm !bg-[#75BBFF] !border !text-[#FFFFFF] border-[#000000] focus:border-[#75BBFF] !px-4 !py-2 !mx-2 !rounded-lg w-full focus:outline-none"
    >
      {label}
    </button>
  )
}

