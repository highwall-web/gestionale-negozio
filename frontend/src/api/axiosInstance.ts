import Axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from './tokenStore';

const AXIOS_INSTANCE = Axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const url: string = config.url || '';

        // Escludi login e healthcheck
        const isExcluded: boolean = url.includes('/auth/login') || url.includes('/health');

        if (!isExcluded) {
            const token: string | null = tokenStore.get();
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

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

AXIOS_INSTANCE.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            const url: string = originalRequest.url || '';

            // Non tentare il refresh per login o refresh stesso
            if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return AXIOS_INSTANCE(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await Axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
                    null,
                    { withCredentials: true }
                );
                const newToken = data.accessToken;

                tokenStore.set(newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                processQueue(null, newToken);

                return AXIOS_INSTANCE(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenStore.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export const axiosInstance = async <T>(config: AxiosRequestConfig): Promise<T> => {
    const { data } = await AXIOS_INSTANCE({
        ...config,
    });
    return data;
};

export default axiosInstance;
