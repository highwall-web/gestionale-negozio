import Axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

const AXIOS_INSTANCE = Axios.create({
  baseURL: 'http://localhost:8080',
});

AXIOS_INSTANCE.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const url: string = config.url || '';

    // Escludi login e healthcheck
    const isExcluded: boolean = url.includes('/auth/login') || url.includes('/health');

    if (!isExcluded) {
      const token: string | null = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export const axiosInstance = async <T>(config: AxiosRequestConfig): Promise<T> => {
    const {data} = await AXIOS_INSTANCE({
        ...config,
    });
    return data;
};

export default axiosInstance;
