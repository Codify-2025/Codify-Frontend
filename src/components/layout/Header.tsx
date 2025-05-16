import React from 'react';
import Button from '../Button';
import Text from '../Text';

const Header: React.FC = () => {
  return (
    <header className="bg-white p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Text variant="heading" weight="bold" color="gray">
          Codify
        </Text>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <Button
          text="로그인"
          variant="custom"
          className="bg-gray-800 text-black px-4 py-2 rounded-lg"
        />
        <Button
          text="대시보드"
          variant="custom"
          className="bg-black text-white border border-black px-4 py-2 rounded-lg"
        />
      </div>
    </header>
  );
};

export default Header;
