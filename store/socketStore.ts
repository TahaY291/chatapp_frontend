// store/socket.store.ts
import { create } from "zustand"
import { io, Socket } from "socket.io-client"
import { useConversationStore } from "./conversationStore"
import { useMessageStore } from "./messageStore"

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

        socket.on("connect", () => {
            socket.emit("user:online", userId)
            console.log("Socket Connected")
        })

        socket.on("receive-message", (message) => {
            console.log('before',message)

            const activeId = useMessageStore.getState().activeConversationId
            if (activeId === message.conversationId) {
                useMessageStore.getState().addMessage(message)
            }
            console.log("after", message)

            useConversationStore.getState().updateConversationOnNewMessage(message)
        })


        set({ socket })
    },

    disconnect: () => {
        get().socket?.disconnect()
        set({ socket: null })
    }
}))