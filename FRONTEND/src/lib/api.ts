// src/lib/api.ts
import axios from 'axios';
import  useAuthStore  from '@/store/useStore';

// 클라이언트 전용 인스턴스
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_IP,
  withCredentials: true, // ← Refresh Cookie 자동 전송
});

// 요청 인터셉터: 메모리에서 토큰 가져와서 자동 붙임
api.interceptors.request.use(async (config) => {
  let token = useAuthStore.getState().accessToken;
  
  // token이 없으면 refresh 토큰으로 새로 받아오기 시도
  if (!token) {
    console.log("토큰이 없습니다. refresh 토큰으로 새로 받아옵니다.");
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_IP}/auth/Oauth2/updateToken`,
        {},
        { withCredentials: true }
      );

      
      const newToken = data[1].accessToken;
      useAuthStore.getState().setAccessToken(newToken);
      token = newToken;
      console.log("새 토큰을 받았습니다:",data, token);
    } catch (error) {
      console.log("토큰 갱신 실패:", error);
      // refresh 토큰도 없거나 만료된 경우 - 로그인 필요
      // 여기서는 에러를 던지지 않고 계속 진행 (응답 인터셉터에서 처리)
    }
  }
  
  console.log(token, "token입니다")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// 응답 인터셉터: 401 잡아서 자동 리프레시 + 재시도
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
	
	
    // error의 status가 401일때만 새로 요청 
    console.log(error.response?.status, "error.response?.status")
    if ((error.response?.status === 401) && !originalRequest._retry) {
      if (isRefreshing) {
        // 다른 요청이 리프레시 중이면 기다리기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_IP}/auth/refreshTokens`,
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // 재시도
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout(); // 여기서 로그아웃!
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;