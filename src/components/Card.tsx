import React from 'react';
import classNames from 'classnames';
import Text from './Text';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, footer, className }) => {
  return (
    <div
      className={classNames(
        'rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200',
        className
      )}
    >
      {title && (
        <Text variant="heading" weight="bold" className="mb-2">
          {title}
        </Text>
      )}
      <div className="mb-4">{children}</div>
      {footer && <div className="mt-2 border-t pt-2">{footer}</div>}
    </div>
  );
};

export default Card;
