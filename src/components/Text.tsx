import React from 'react';
import classNames from 'classnames';

type As = React.ElementType;

type TextOwnProps = {
  as?: As;
  variant?:
    | 'display'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'body-lg'
    | 'body'
    | 'caption'
    | 'heading'
    | 'subtitle';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'inverted';
  className?: string;
  children: React.ReactNode;
};

type PolymorphicProps<E extends As> = Omit<
  React.ComponentPropsWithoutRef<E>,
  keyof TextOwnProps | 'as'
> &
  TextOwnProps & { as?: E };

export type TextProps<E extends As = 'p'> = PolymorphicProps<E>;

const VARIANT_STYLES: Record<NonNullable<TextOwnProps['variant']>, string> = {
  display: 'text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight',
  h1: 'text-3xl md:text-4xl leading-tight tracking-tight',
  h2: 'text-2xl md:text-3xl leading-snug',
  h3: 'text-xl md:text-2xl leading-snug',
  'body-lg': 'text-lg leading-7 md:leading-8',
  body: 'text-base leading-7',
  caption: 'text-sm leading-6',
  heading: 'text-2xl md:text-3xl leading-tight tracking-tight',
  subtitle: 'text-lg md:text-xl leading-snug',
};

const WEIGHT_STYLES: Record<NonNullable<TextOwnProps['weight']>, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const COLOR_STYLES: Record<NonNullable<TextOwnProps['color']>, string> = {
  default: 'text-gray-800',
  muted: 'text-gray-600',
  primary: 'text-blue-600',
  inverted: 'text-white',
};

const TextImpl = <E extends As = 'p'>({
  as,
  variant = 'body',
  weight = 'regular',
  color = 'default',
  className = '',
  children,
  ...rest
}: TextProps<E>) => {
  const Component = (as ?? 'p') as As;

  const textClass = classNames(
    VARIANT_STYLES[variant],
    WEIGHT_STYLES[weight],
    COLOR_STYLES[color],
    'text-balance',
    className
  );

  return (
    <Component className={textClass} {...rest}>
      {children}
    </Component>
  );
};

type TextComponent = <E extends As = 'p'>(props: TextProps<E>) => JSX.Element;
const Text = TextImpl as TextComponent;

export default Text;
