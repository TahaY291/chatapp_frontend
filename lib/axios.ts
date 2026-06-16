import axios, {AxiosInstance , AxiosRequestConfig , InternalAxiosRequestConfig} from "axios";

interface QueueEntry {
resolve : ()=> void,
reject: (error: unknown)=> void
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}
 

const REFRESH_ENDPOINT = "/user/refresh-token";

 const SKIP_INTERCEPT_URLS = [
    "/user/is-authenticated",
    "/user/login",
    "/user/register",        // ✅ add
    "/user/verify-otp",      // ✅ add
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
let failedQueue : QueueEntry[]= []

const processQueue = (error : unknown): void => {
    failedQueue.forEach((entry)=>{
        if (error) {
            entry.reject(error)
        }else{
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

        console.log("🔴 interceptor fired")
        console.log("status:", axiosError.response?.status)
        console.log("url:", originalRequest?.url)
        console.log("_retry:", originalRequest?._retry)
        console.log("shouldSkip:", shouldSkipIntercept(originalRequest?.url))

        if (!axiosError.response || !originalRequest) {
            console.log("❌ no response or config — rejecting")
            return Promise.reject(error);
        }

        const { status } = axiosError.response;

        if (status !== 401 || originalRequest._retry || shouldSkipIntercept(originalRequest.url)) {
            console.log("❌ skipping refresh because:", {
                notA401: status !== 401,
                alreadyRetried: originalRequest._retry,
                skippedUrl: shouldSkipIntercept(originalRequest.url)
            })
            return Promise.reject(error);
        }

        if (isRefreshing) {
            console.log("⏳ already refreshing — queuing request")
            return new Promise<void>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() =>
                api(originalRequest as AxiosRequestConfig)
            ).catch((err: unknown) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            console.log("🔄 attempting refresh...")
            await api.post(REFRESH_ENDPOINT);
            console.log("✅ refresh success — retrying original request")
            processQueue(null);
            return api(originalRequest as AxiosRequestConfig);

        } catch (refreshError: unknown) {
            console.log("❌ refresh failed:", refreshError)
            processQueue(refreshError);
            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);
 
export default api;