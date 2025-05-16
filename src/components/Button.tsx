import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  text: string;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'custom';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const VARIANT_STYLES: Record<string, string> = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  custom: '',
};

const SIZE_STYLES: Record<string, string> = {
  small: 'px-3 py-1 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-5 py-3 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  text,
  loadingText,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
}) => {
  const buttonClass = classNames(
    'flex items-center justify-center rounded-lg transition duration-200',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    {
      'opacity-50 cursor-not-allowed': disabled || isLoading,
    },
    className
  );

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span>{loadingText ? loadingText : 'Loading...'}</span>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          {text}
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
