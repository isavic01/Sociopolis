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
      className={`button ${disabled ? 'bg-gray-400 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  )
}

