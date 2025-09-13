import React from 'react';
import Button from '../Button';
import Text from '../Text';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@stores/useAuthStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  // const { isLoggedIn, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          aria-label="홈으로 이동"
          className="inline-flex items-center gap-2"
        >
          <Text as="span" variant="h3" weight="bold">
            Codify
          </Text>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* {!isLoggedIn ? (
            <>
              <Button
                text="로그인"
                variant="secondary"
                onClick={() => navigate('/login')}
              />
            </>
          ) : (
            <Button
              text="로그아웃"
              variant="secondary"
              onClick={() => {
                logout();
                navigate('/');
              }}
            />
          )} */}

          <Button
            text="대시보드"
            onClick={() =>
              // 로그인 요구 로직을 쓰려면 아래로 교체
              // isLoggedIn ? navigate('/dashboard') : navigate('/login', { state: { from: '/dashboard' } })
              navigate('/dashboard')
            }
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
