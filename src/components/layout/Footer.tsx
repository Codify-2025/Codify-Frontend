import React from 'react';
import Text from '../Text';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 p-4 mt-auto flex justify-center items-center">
      <Text variant="caption" weight="regular" color="gray">
        &copy; {new Date().getFullYear()} Codify - All Rights Reserved.
      </Text>
    </footer>
  );
};

export default Footer;
