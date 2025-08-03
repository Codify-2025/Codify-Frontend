export const useAccessToken = () => {
  return localStorage.getItem('accessToken') ?? '';
};
