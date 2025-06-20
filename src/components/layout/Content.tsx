import React from 'react';
import Text from '../Text';

interface ContentProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Content: React.FC<ContentProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <main className={`flex-1 p-6 ${className ?? 'bg-gray-100'}`}>
      {title && (
        <Text variant="heading" weight="bold" color="primary" className="mb-4">
          {title}
        </Text>
      )}
      {description && (
        <Text variant="body" weight="regular" color="gray" className="mb-6">
          {description}
        </Text>
      )}
      {children}
    </main>
  );
};

export default Content;
