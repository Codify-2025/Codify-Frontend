import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  text: string;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

type VariantType = 'primary' | 'secondary' | 'danger';

const VARIANT_STYLES: Record<VariantType, string> = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
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
  onClick,
}) => {
  const buttonClass = classNames(
    'flex items-center justify-center rounded-lg transition duration-200',
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    {
      'opacity-50 cursor-not-allowed': disabled || isLoading,
    }
  );

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="loader">
          {loadingText ? loadingText : 'Loading...'}
        </span>
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
