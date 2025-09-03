import axios, { AxiosRequestHeaders } from 'axios';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
if (!BASE_URL) {
  console.warn('[API] VITE_APP_BASE_URL is empty.');
}

export const FIXED_UUID = '123e4567-e89b-12d3-a456-426614174000';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// 요청 인터셉터: 모든 요청에 USER-UUID 헤더 주입
axiosInstance.interceptors.request.use((config) => {
  // 헤더 객체 보장
  config.headers = (config.headers || {}) as AxiosRequestHeaders;

  // 고정 UUID 헤더
  config.headers['USER-UUID'] = FIXED_UUID;

  // JSON 기본
  if (!('Content-Type' in config.headers)) {
    config.headers['Contenty-Type'] = 'application/json';
  }

  return config;
});

export default axiosInstance;
