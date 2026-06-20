import { getCallInfo } from "@/api/call";
import { create } from "zustand";

interface CallHistoryItem {
    callId: string
    callerId: string
    callerUsername: string
    callerAvatar: string | null
    receiverId: string
    receiverUsername: string
    receiverAvatar: string | null
    conversationId: string
    type: "audio" | "video"
    status: "completed" | "missed" | "rejected"
    duration: number | null
    startedAt: string | null
    endedAt: string | null
    createdAt: string
}

interface CallHistoryStore {
    callHistory: CallHistoryItem[]
    pagination: Pagination | null
    loading: boolean
    fetchCallHistory: () => Promise<void>
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
}


export const useCallHistoryStore = create<CallHistoryStore>((set) => ({
    callHistory: [],
    pagination: null,
    loading: false,

    fetchCallHistory: async () => {
        set({ loading: true })
        try {
            const response = await getCallInfo()
            set({
                callHistory: Array.isArray(response?.calls) ? response.calls : [],
                pagination: response?.pagination ?? null,
                loading: false
            })
        } catch (err) {
            console.error("Failed to fetch call history:", err)
            set({ callHistory: [], loading: false })
        }
    }
}))
