import { create } from "zustand"
import { io, Socket } from "socket.io-client"
import { useConversationStore } from "./conversationStore"
import { useMessageStore } from "./messageStore"
import { useCallStore } from "./callStore"
import { getPeerConnection } from "@/lib/webrtc"
import { useRagStore } from "./rag.store"

interface SocketStore {
    socket: Socket | null
    connect: (userId: string) => void
    disconnect: () => void
}

export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,

    connect: (userId) => {
        // ✅ GUARD: if a live socket already exists, don't create another one
        const existing = get().socket
        if (existing?.connected) {

            return
        }
        // clean up any stale/disconnected socket before creating a fresh one
        existing?.disconnect()

        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            query: { userId }
        })

        socket.on("connect", () => {
            socket.emit("user:online", userId)
        })

        socket.on("webrtc:offer", ({ offer }) => {
            const incoming = useCallStore.getState().incomingCall
            if (incoming) {
                useCallStore.getState().setIncomingCall({
                    ...incoming,
                    offer
                })
            }
        })

        socket.on("webrtc:answer", async ({ answer }) => {
            const pc = getPeerConnection()
            if (!pc) return

            try {
                const state = pc.signalingState
                if (state === "have-local-offer" || state === "have-remote-offer") {
                    await pc.setRemoteDescription(answer)
                } else {
                    console.warn("⚠️ received answer in wrong signaling state", state)
                }
            } catch (err) {
                console.error("✗ failed to set remote answer:", err)
            }
        })

        socket.on("webrtc:ice-candidate", async ({ candidate }) => {
            const pc = getPeerConnection()
            if (!pc || !candidate || !candidate.candidate) return

            try {
                await pc.addIceCandidate(candidate)
            } catch (err) {
                console.error("✗ failed to add ICE candidate:", err)
            }
        })

        socket.on("call:accepted", async ({ callId }) => {
            const outgoing = useCallStore.getState().outgoingCall
            if (!outgoing) return

            useCallStore.getState().clearOutgoingCall()
            useCallStore.getState().setActiveCall({
                callId,
                peerId: outgoing.receiverId,
                peerName: outgoing.receiverName,
                peerAvatar: outgoing.receiverAvatar,
                type: outgoing.type,
                status: "connecting",
                isMuted: false,
                isCameraOff: false
            })

            socket.emit("join-room", callId)
        })

        socket.on("call:rejected", () => {
            useCallStore.getState().clearOutgoingCall()
        })

        socket.on("call:ended", () => {
            useCallStore.getState().endCall()
        })

        socket.on("call:incoming", (data) => {
            const conversations = useConversationStore.getState().conversations
            const conv = conversations.find(c => c.conversationId === data.conversationId)

            useCallStore.getState().setIncomingCall({
                callId: data.callId,
                callerId: data.callerId,
                callerName: conv?.otherUsername ?? "Unknown",
                callerAvatar: conv?.otherAvatarUrl ?? null,
                type: data.type,
                conversationId: data.conversationId,
                offer: null
            })
        })

        socket.on("receive-message", (message) => {
            const activeId = useMessageStore.getState().activeConversationId
            if (activeId === message.conversationId) {
                useMessageStore.getState().addMessage(message)
            }
            useConversationStore.getState().updateConversationOnNewMessage(message)
        })

        socket.on("message-updated", (message) => {
            const activeId = useMessageStore.getState().activeConversationId
            if (activeId === message.conversationId) {
                useMessageStore.getState().updateMessage(message)
            }
            useConversationStore.getState().updateConversationOnNewMessage(message)
        })

        socket.on('rag:token', ({ token }: { token: string }) => {
            useRagStore.getState().appendToken(token)
        })

        socket.on('rag:done', () => {
            useRagStore.getState().finalizeAnswer()
        })

        set({ socket })
    },

    disconnect: () => {
        get().socket?.disconnect()
        set({ socket: null })
    }
}))