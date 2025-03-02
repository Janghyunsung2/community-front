import axios from "axios";
import Router from "next/router";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // ✅ 쿠키 항상 포함
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.warn("세션 만료 또는 인증 실패. 로그인 페이지로 이동합니다.");
        Router.replace('/login');
      }
      return Promise.reject(error);
    }
  );

export default api;
