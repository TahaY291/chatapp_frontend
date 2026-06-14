// store/socket.store.ts
import { create } from "zustand"
import { io, Socket } from "socket.io-client"
import { useConversationStore } from "./conversationStore"

interface SocketStore {
    socket: Socket | null
    connect: (userId: string) => void
    disconnect: () => void
}

export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,

    connect: (userId) => {
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            query: { userId }
        })

        socket.on("receive-message", (message) => {
            useConversationStore.getState().updateConversationOnNewMessage(message)
        })

        socket.on("connect", () => console.log("socket connected"))

        set({ socket })
    },

    disconnect: () => {
        get().socket?.disconnect()
        set({ socket: null })
    }
}))