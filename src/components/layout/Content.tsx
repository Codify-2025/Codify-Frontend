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
    <main className={className ? className : ''}>
      {/* 타이틀/디스크립션이 필요한 상세 페이지에서만 사용 */}
      {title && (
        <div className="mx-auto max-w-6xl px-6 pt-10">
          <Text variant="h1" weight="bold" className="mb-2">
            {title}
          </Text>
          {description && (
            <Text variant="body" color="muted" className="mb-6">
              {description}
            </Text>
          )}
        </div>
      )}
      {children}
    </main>
  );
};

export default Content;
