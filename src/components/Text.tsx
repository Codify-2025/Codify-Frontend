import React from 'react';
import classNames from 'classnames';

type ElementTag = keyof JSX.IntrinsicElements;

interface TextProps {
  as?: ElementTag;
  variant?: 'heading' | 'subtitle' | 'body' | 'caption';
  weight?: 'regular' | 'medium' | 'bold';
  color?: 'primary' | 'secondary' | 'danger' | 'gray' | 'white';
  children: React.ReactNode;
  className?: string;
}

const COLOR_STYLES: Record<string, string> = {
  primary: 'text-blue-500',
  secondary: 'text-gray-500',
  danger: 'text-red-500',
  gray: 'text-gray-500',
  white: 'text-white',
};

const VARIANT_STYLES: Record<string, string> = {
  heading: 'text-heading',
  subtitle: 'text-subtitle',
  body: 'text-body',
  caption: 'text-caption',
};

const WEIGHT_STYLES: Record<string, string> = {
  regular: 'font-regular',
  medium: 'font-medium',
  bold: 'font-bold',
};

const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'regular',
  color = 'gray',
  children,
  className = '',
}) => {
  const textClass = classNames(
    VARIANT_STYLES[variant],
    WEIGHT_STYLES[weight],
    COLOR_STYLES[color],
    className
  );

  return <p className={textClass}>{children}</p>;
};

export default Text;
