import React from 'react'

type SubmitButtonProps = {
  label?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  label = 'Submit',
  onClick,
  type = 'submit',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="button"
    >
      {label}
    </button>
  )
}
