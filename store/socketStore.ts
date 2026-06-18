import { create } from "zustand"
import { io, Socket } from "socket.io-client"
import { useConversationStore } from "./conversationStore"
import { useMessageStore } from "./messageStore"
import { useCallStore } from "./callStore"
import { getPeerConnection } from "@/lib/webrtc"

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

        socket.on("webrtc:offer", ({ offer }) => {
            console.log("📥 webrtc:offer received, storing in incomingCall")
            const incoming = useCallStore.getState().incomingCall
            if (incoming) {
                useCallStore.getState().setIncomingCall({
                    ...incoming,
                    offer
                })
                console.log("✅ offer stored in incomingCall")
            } else {
                console.log("❌ no incomingCall in store when offer arrived")
            }
        })

        socket.on("webrtc:answer", async ({ answer }) => {
            const pc = getPeerConnection()
            if (!pc) {
                console.log("✗ no peer connection found when answer arrived")
                return
            }

            try {
                const state = pc.signalingState
                if (state === "have-local-offer" || state === "have-remote-offer") {
                    await pc.setRemoteDescription(answer)
                    console.log("✓ answer applied to peer connection")
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
                console.log("✓ ICE candidate added")
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
    console.log("✅ room joined by caller:", callId)

})


        socket.on("call:rejected", () => {
            useCallStore.getState().clearOutgoingCall()
        })

        socket.on("call:ended", () => {
            useCallStore.getState().endCall()
        })

      
socket.on("call:incoming", (data) => {
    // get caller info from conversation store
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
            console.log('before', message)

            const activeId = useMessageStore.getState().activeConversationId
            if (activeId === message.conversationId) {
                useMessageStore.getState().addMessage(message)
            }

            useConversationStore.getState().updateConversationOnNewMessage(message)
        })


        set({ socket })
    },

    disconnect: () => {
        get().socket?.disconnect()
        set({ socket: null })
    }
}))