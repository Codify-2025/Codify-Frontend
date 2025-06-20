import React from 'react';
import Button from '../Button';
import Text from '../Text';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@stores/useAuthStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthStore();

  return (
    <header className="bg-white p-4 flex justify-between items-center">
      {/* Logo */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <Text variant="heading" weight="bold" color="gray">
          Codify
        </Text>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <Button
            text="로그인"
            variant="custom"
            className="bg-gray-800 text-black px-4 py-2 rounded-lg"
            onClick={() => navigate('/login')}
          />
        ) : (
          <Button
            text="로그아웃"
            variant="custom"
            className="bg-gray-200 text-black px-4 py-2 rounded-lg"
            onClick={() => {
              logout();
              navigate('/');
            }}
          />
        )}
        <Button
          text="대시보드"
          variant="custom"
          className="bg-black text-white border border-black px-4 py-2 rounded-lg"
          // onClick={() =>
          //   isLoggedIn
          //     ? navigate('/dashboard')
          //     : navigate('/login', { state: { from: '/dashboard' } })
          // }
          onClick={() => navigate('/dashboard')}
        />
      </div>
    </header>
  );
};

export default Header;
