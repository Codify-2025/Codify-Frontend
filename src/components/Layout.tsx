import React from 'react';
import Header from './layout/Header';
import Content from './layout/Content';
import Footer from './layout/Footer';

interface LayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  contentClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({
  title,
  description,
  children,
  contentClassName,
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <Content
        title={title}
        description={description}
        className={contentClassName}
      >
        {children}
      </Content>
      <Footer />
    </div>
  );
};

export default Layout;
