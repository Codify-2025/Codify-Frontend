import React from 'react';
import classNames from 'classnames';

type AsTag =
  | 'p'
  | 'span'
  | 'div'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'label'
  | 'small'
  | 'strong'
  | 'em'
  | 'blockquote'
  | 'figcaption';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: AsTag;
  variant?:
    | 'display'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'body-lg'
    | 'body'
    | 'caption'
    // ⬇️ 구버전 호환
    | 'heading'
    | 'subtitle';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'inverted';
  className?: string;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<NonNullable<TextProps['variant']>, string> = {
  display: 'text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight',
  h1: 'text-3xl md:text-4xl leading-tight tracking-tight',
  h2: 'text-2xl md:text-3xl leading-snug',
  h3: 'text-xl md:text-2xl leading-snug',
  'body-lg': 'text-lg leading-7 md:leading-8',
  body: 'text-base leading-7',
  caption: 'text-sm leading-6',
  // 구버전 별칭
  heading: 'text-2xl md:text-3xl leading-tight tracking-tight',
  subtitle: 'text-lg md:text-xl leading-snug',
};

const WEIGHT_STYLES: Record<NonNullable<TextProps['weight']>, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const COLOR_STYLES: Record<NonNullable<TextProps['color']>, string> = {
  default: 'text-gray-800',
  muted: 'text-gray-600',
  primary: 'text-blue-600',
  inverted: 'text-white',
};

const Text: React.FC<TextProps> = ({
  as,
  variant = 'body',
  weight = 'regular',
  color = 'default',
  className = '',
  children,
  ...rest // id, aria-*, role 등 전달 가능
}) => {
  // ✅ HTML 전용 태그만 사용
  const Component = (as ?? 'p') as React.ElementType;

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

export default Text;
