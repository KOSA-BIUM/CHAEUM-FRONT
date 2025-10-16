import axios from 'axios';

const AS_BASE = import.meta.env.VITE_AS_BASE || 'http://localhost:8080';

let accessToken = null;

export function setAccessToken(token) { accessToken = token; }
export function getAccessToken() { return accessToken; }

export function getRefreshToken() { return sessionStorage.getItem('rt'); }
export function setRefreshToken(token) {
  if (token) sessionStorage.setItem('rt', token);
  else sessionStorage.removeItem('rt');
}

export const http = axios.create({
  baseURL: AS_BASE,
  withCredentials: true // 세션/쿠키 쓸 때 필요. 토큰만 쓰면 false도 가능.
});

// 요청 시 Bearer 자동 첨부
http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답: 401이면 refresh → 재시도(1회)
let refreshing = false;
let queue = [];

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;

      const rt = getRefreshToken();
      if (!rt) {
        redirectToLogin();
        return Promise.reject(error);
      }

      if (!refreshing) {
        refreshing = true;
        try {
          const body = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: import.meta.env.VITE_CLIENT_ID || 'vue-spa',
            refresh_token: rt
          });
          const { data } = await axios.post(
            `${AS_BASE}/oauth2/token`,
            body,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true }
          );
          setAccessToken(data.access_token);
          if (data.refresh_token) setRefreshToken(data.refresh_token);
          queue.forEach(fn => fn());
          queue = [];
          return http(original);
        } catch (e) {
          setAccessToken(null);
          setRefreshToken(null);
          redirectToLogin();
          return Promise.reject(e);
        } finally {
          refreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          queue.push(() => resolve(http(original)));
        });
      }
    }
    return Promise.reject(error);
  }
);

function redirectToLogin() {
  window.location.href = '/login';
}
