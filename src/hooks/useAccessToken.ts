import { useEffect, useState } from 'react';

export const useAccessToken = (): string => {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem('accessToken') ?? '';
      setToken(accessToken);
    } catch (error) {
      console.warn('localStorage access failed:', error);
      setToken('');
    }
  }, []);

  return token;
};
