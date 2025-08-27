import React from 'react';
import Text from '../Text';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-900 py-6">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <Text variant="caption" color="inverted">
          &copy; {new Date().getFullYear()} Codify — All Rights Reserved.
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
