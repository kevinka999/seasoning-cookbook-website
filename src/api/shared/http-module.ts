import type { AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axios-instance";
import { getModuleUrl, type ApiModule } from "./config";
import { localStorageUtils } from "../../utils/localStorage";

const ACCESS_TOKEN_KEY = "access_token";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || "";
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || "";

class HttpModule {
  private buildUrl(module: ApiModule, url: string): string {
    const baseURL = getModuleUrl(module);
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    return `${baseURL}/${cleanUrl}`;
  }

  private getDefaultHeaders(module: ApiModule): Record<string, string> {
    const headers: Record<string, string> = {};

    const token = localStorageUtils.get(ACCESS_TOKEN_KEY);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (module === "identity") {
      headers["x-client-id"] = CLIENT_ID;
      headers["x-client-secret"] = CLIENT_SECRET;
    }

    return headers;
  }

  private mergeHeaders(
    module: ApiModule,
    config?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const defaultHeaders = this.getDefaultHeaders(module);
    const configHeaders = config?.headers || {};

    return {
      ...config,
      headers: {
        ...defaultHeaders,
        ...configHeaders,
      },
    };
  }

  async get<T>(
    module: ApiModule,
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = this.buildUrl(module, url);
    const mergedConfig = this.mergeHeaders(module, config);
    const response = await axiosInstance.get<T>(fullUrl, mergedConfig);
    return response.data;
  }

  async post<T>(
    module: ApiModule,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = this.buildUrl(module, url);
    const mergedConfig = this.mergeHeaders(module, config);
    const response = await axiosInstance.post<T>(fullUrl, data, mergedConfig);
    return response.data;
  }

  async put<T>(
    module: ApiModule,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = this.buildUrl(module, url);
    const mergedConfig = this.mergeHeaders(module, config);
    const response = await axiosInstance.put<T>(fullUrl, data, mergedConfig);
    return response.data;
  }

  async patch<T>(
    module: ApiModule,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = this.buildUrl(module, url);
    const mergedConfig = this.mergeHeaders(module, config);
    const response = await axiosInstance.patch<T>(fullUrl, data, mergedConfig);
    return response.data;
  }

  async delete<T>(
    module: ApiModule,
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const fullUrl = this.buildUrl(module, url);
    const mergedConfig = this.mergeHeaders(module, config);
    const response = await axiosInstance.delete<T>(fullUrl, mergedConfig);
    return response.data;
  }
}

export const httpModule = new HttpModule();
