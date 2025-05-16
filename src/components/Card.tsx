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
    <div className={classNames('bg-white rounded-lg shadow-md p-4', className)}>
      {title && (
        <Text variant="heading" weight="bold" color="gray" className="mb-2">
          {title}
        </Text>
      )}
      <div className="mb-4">{children}</div>
      {footer && <div className="border-t pt-2 mt-2">{footer}</div>}
    </div>
  );
};

export default Card;
