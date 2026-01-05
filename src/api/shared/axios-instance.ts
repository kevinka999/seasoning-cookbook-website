import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { localStorageUtils } from "../../utils/localStorage";
import { getModuleUrl } from "./config";
import type { RefreshResponse } from "../../types/identity-service";

const ACCESS_TOKEN_KEY = "access_token";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const identityServiceUrl = getModuleUrl("identity");
    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "";
    const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || "";

    const response = await axios.post<RefreshResponse>(
      `${identityServiceUrl}/auth/refresh`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": CLIENT_ID,
          "x-client-secret": CLIENT_SECRET,
          Authorization: `Bearer ${localStorageUtils.get(ACCESS_TOKEN_KEY)}`,
        },
        withCredentials: true,
      }
    );

    const newToken = response.data.accessToken;
    localStorageUtils.set(ACCESS_TOKEN_KEY, newToken);
    return newToken;
  } catch (error) {
    localStorageUtils.remove(ACCESS_TOKEN_KEY);
    return null;
  }
};

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorageUtils.get(ACCESS_TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const identityServiceUrl = getModuleUrl("identity");
    const requestUrl = originalRequest.url || "";
    const isIdentityServiceEndpoint = requestUrl.startsWith(identityServiceUrl);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isIdentityServiceEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        if (newToken) {
          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return axiosInstance(originalRequest);
        } else {
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
