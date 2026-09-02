// api/auth.ts
import api from '@/lib/axios'

import { LoginUser, RegisterUser, ResendOtp, VerifYEmail, User , ApiResponse } from '../types/auth.type'

export const registerUser = async (data: RegisterUser): Promise<ApiResponse<User>> => {
    const response = await api.post("/user/register", data)
    return response.data
}

export const verifyOtp = async (data: VerifYEmail): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post('/user/verify-email', data)
    return response.data
}

export const getMe = async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/user/me")
    return response.data
}

export const loginUser = async (data: LoginUser): Promise<ApiResponse<{ loggedInUser: User }>> => {
    const response = await api.post('/user/login', data)
    return response.data
}

export const logOutUser = async (): Promise<ApiResponse<null>> => {
    const response = await api.post('/user/logout')
    return response.data
}

export const resendOtp = async (data: ResendOtp): Promise<ApiResponse<null>> => {
    const response = await api.post('/user/resend-otp', data)
    return response.data
}