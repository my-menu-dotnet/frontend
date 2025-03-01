import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedRequestQueue: Array<{
  onSuccess: () => void;
  onFailure: (err: AxiosError) => void;
}> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestQueue.push({
          onSuccess: () => resolve(api(originalRequest)),
          onFailure: (err) => reject(err),
        });
      });
    }

    isRefreshing = true;

    return new Promise((resolve, reject) => {
      api
        .post("/auth/refresh-token")
        .then(() => {
          failedRequestQueue.forEach((request) => request.onSuccess());
          failedRequestQueue = [];

          resolve(api(originalRequest));
        })
        .catch((err: AxiosError) => {
          failedRequestQueue.forEach((request) => request.onFailure(err));
          failedRequestQueue = [];

          api.post("/auth/logout").then(() => {
            localStorage.removeItem("authenticated");
          });
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
);

export default api;
