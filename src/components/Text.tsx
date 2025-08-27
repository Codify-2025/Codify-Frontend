import React from 'react';
import classNames from 'classnames';

type ElementTag = keyof JSX.IntrinsicElements;

interface TextProps {
  as?: ElementTag;
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'body-lg' | 'body' | 'caption';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'inverted';
  className?: string;
  children: React.ReactNode;
}

const VARIANT = {
  display: 'text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight',
  h1: 'text-3xl md:text-4xl tracking-tight leading-tight',
  h2: 'text-2xl md:text-3xl tracking-tight',
  h3: 'text-xl md:text-2xl',
  'body-lg': 'text-lg leading-7 md:leading-8',
  body: 'text-base leading-7',
  caption: 'text-sm leading-6',
};

const WEIGHT = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const COLOR = {
  default: 'text-gray-800',
  muted: 'text-gray-600',
  primary: 'text-blue-600',
  inverted: 'text-white',
};

const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  variant = 'body',
  weight = 'regular',
  color = 'default',
  className,
  children,
}) => {
  return (
    <Component
      className={classNames(
        VARIANT[variant],
        WEIGHT[weight],
        COLOR[color],
        'text-balance',
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Text;
