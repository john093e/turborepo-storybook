import type { FC, ButtonHTMLAttributes } from 'react'

export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Button contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}
export const Button: FC<
  ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
> = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary
    ? 'bg-blue-600 text-white'
    : 'bg-transparent text-gray-800 border border-gray-300 shadow-inner'
  const sizes = {
    small: 'text-xs px-4 py-2',
    medium: 'text-sm px-5 py-3',
    large: 'text-base px-6 py-4',
  }
  return (
    <button
      type="button"
      className={`font-semibold rounded-full focus:outline-none ${sizes[size]} ${mode}`}
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  )
}