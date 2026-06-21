import api from '@/lib/axios'
import { LoginUser, RegisterUser, ResendOtp, VerifYEmail } from '../types/auth.type'

export const registerUser = async(data: RegisterUser)=> {
const response = await api.post("/user/register", data)
return response
}

export const verifyOtp= async(data: VerifYEmail)=> {
    const response = await api.post('/user/verify-email', data)
    return response
}

export const getMe = async () => {
    const response = await api.get("/user/me")
    return response.data
}

export const loginUser= async(data: LoginUser) => {
    const response  = await api.post('/user/login', data)
    return response
}
export const logOutUser= async() => {
    const response  = await api.post('/user/logout')
    return response
}

export const resendOtp = async (data: ResendOtp) => {
    const response = await api.post('/user/resend-otp' , data)
    return response
}