import { API_URL } from "@/const/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: API_URL,
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
        .post("/v1/oauth/refresh-token")
        .then(() => {
          failedRequestQueue.forEach((request) => request.onSuccess());
          failedRequestQueue = [];

          resolve(api(originalRequest));
        })
        .catch((err: AxiosError) => {
          failedRequestQueue.forEach((request) => request.onFailure(err));
          failedRequestQueue = [];

          api.post("/v1/oauth/logout");
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }
);

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const companyIdIndex = pathParts.indexOf('menu') + 1;
      const companyId = pathParts[companyIdIndex];
      
      if (companyId) {
        config.headers['X-Company-ID'] = companyId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
