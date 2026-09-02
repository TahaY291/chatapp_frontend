import { useAuthStore } from "@/store/authStore";
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

interface QueueEntry {
    resolve: () => void,
    reject: (error: unknown) => void
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}


const REFRESH_ENDPOINT = "/user/refresh-token";

const SKIP_INTERCEPT_URLS = [
    "/user/is-authenticated",
    "/user/login",
    "/user/register",        // ✅ add
    "/user/verify-email",      // ✅ add
    REFRESH_ENDPOINT,
] as const;


const api: AxiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});


let isRefreshing = false
let failedQueue: QueueEntry[] = []

const processQueue = (error: unknown): void => {
    failedQueue.forEach((entry) => {
        if (error) {
            entry.reject(error)
        } else {
            entry.resolve();
        }
    })
    failedQueue = []
}

const shouldSkipIntercept = (url: string | undefined): boolean => {
    if (!url) return false;
    return SKIP_INTERCEPT_URLS.some((skip) => url.includes(skip));
};


api.interceptors.response.use(
    (response) => response,

    async (error: unknown) => {
        const axiosError = error as {
            response?: { status: number };
            config?: RetryableRequestConfig;
        };

        const originalRequest = axiosError.config;


        if (!axiosError.response || !originalRequest) {
            return Promise.reject(error);
        }

        const { status } = axiosError.response;

        if (status !== 401 || originalRequest._retry || shouldSkipIntercept(originalRequest.url)) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() =>
                api(originalRequest as AxiosRequestConfig)
            ).catch((err: unknown) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await api.post(REFRESH_ENDPOINT);
            processQueue(null);
            return api(originalRequest as AxiosRequestConfig);

        } catch (refreshError: unknown) {
            processQueue(refreshError);
            useAuthStore.getState().clearUser();
            if (typeof window !== "undefined" && window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export default api;