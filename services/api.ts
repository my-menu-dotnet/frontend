import axios, { AxiosError } from "axios";
import { ToastContent, ToastOptions } from "react-toastify";

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
  let failedRequestQueue = [] as {
    onSuccess: () => void;
    onFailure: (err: AxiosError) => void;
  }[];

  return api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
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

      const originalRequest = error.config;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: () => {
              resolve(api(originalRequest!));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;
      api
        .post("/auth/refresh-token")
        .then(() => {
          console.log("Token refreshed");
          failedRequestQueue.forEach((request) => request.onSuccess());
          failedRequestQueue = [];
          return api(originalRequest!);
        })
        .catch(() => {
          failedRequestQueue.forEach((request) => request.onFailure(error));
          failedRequestQueue = [];
          logout();
          return Promise.reject(error);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }
  );
};

export default api;
export { setupApi };
