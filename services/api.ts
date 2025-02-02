import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ToastContent, ToastOptions } from "react-toastify";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const setupApi = (
  logout: () => void,
  toast: (
    content: ToastContent<unknown>,
    options?: ToastOptions<unknown>
  ) => void
) => {
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
        if (error.response?.status !== 403) {
          // @ts-ignore
          const errorMessage = error.response?.data?.message;
          if (errorMessage) {
            toast(errorMessage, { type: "error" });
          }
        }
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
            
            console.log("SetupApi -> Refresh Token");

            resolve(api(originalRequest));
          })
          .catch((err: AxiosError) => {
            failedRequestQueue.forEach((request) => request.onFailure(err));
            failedRequestQueue = [];

            console.log("SetupApi -> Logout");
            
            logout();
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
  );

  return api;
};

export default api;
export { setupApi };
