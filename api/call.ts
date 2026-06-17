// api/call.ts
import api from "@/lib/axios"

export const initiateCall = async (conversationId: string, callType: "audio" | "video") => {
    const res = await api.post("/call/initiate", { conversationId, callType })
    return res.data.data  // { callId }
}

export const acceptCall = async (callId: string) => {
    const res = await api.patch(`/call/${callId}/accept`)
    return res.data.data
}

export const rejectCall = async (callId: string) => {
    const res = await api.patch(`/call/${callId}/reject`)
    return res.data.data
}

export const endCall = async (callId: string) => {
    const res = await api.patch(`/call/${callId}/end`)
    return res.data.data
}