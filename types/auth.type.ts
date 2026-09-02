export interface RegisterUser {
    username: string,
    email: string,
    password: string
}

export interface LoginUser {
    email : string,
    password: string
}

export interface VerifYEmail {
    otp: string,
    email: string
}

export interface ResendOtp {
    email: string
}
export interface ForgotPasswordInput {
    email: string
}

export interface ResetPasswordInput {
    email: string
}

export interface User {
    id: string,
    username: string,
    email: string,
    avatarUrl: string | null,
    about: string | null,
    isOnline: boolean,
    isVerified: boolean,
    createdAt: string
}

export interface ApiResponse<T>{
    statusCode: number,
    data: T,
    message: string,
    success: boolean
}
