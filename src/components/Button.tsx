import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  text: string;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
  type?: 'button' | 'submit' | 'reset';
}

const BASE =
  'inline-flex items-center justify-center rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 disabled:opacity-60 disabled:cursor-not-allowed';

const VARIANT = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
  secondary:
    'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm',
  ghost: 'bg-transparent text-blue-700 hover:bg-blue-50',
};

const SIZE = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  text,
  loadingText,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading,
  disabled,
  className,
  onClick,
  ariaLabel,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      aria-label={ariaLabel || text}
      className={classNames(BASE, VARIANT[variant], SIZE[size], className)}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-disabled={disabled || isLoading || undefined}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {isLoading ? (loadingText ?? 'Loading…') : text}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;
