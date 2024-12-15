import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const setupApi = (logout: () => void) => {
  let isRefreshing = false;
  let failedRequestQueue = [] as {
    onSuccess: () => void;
    onFailure: (err: AxiosError) => void;
  }[];

  return api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status !== 401) {
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
        })
        .catch(() => {
          failedRequestQueue.forEach((request) => request.onFailure(error));
          logout();
        })
        .finally(() => {
          isRefreshing = false;
        });
    }
  );
};

export default api;
export { setupApi };
