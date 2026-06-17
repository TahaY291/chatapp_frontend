// components/call/CallButton.tsx
"use client"
import { Phone, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCallStore } from "@/store/callStore"
import { initiateCall } from "@/api/call"
import { createPeerConnection, getLocalStream } from "@/lib/webrtc"
import { useSocketStore } from "@/store/socketStore"


interface Props {
    conversationId: string
    peerId: string
    peerName: string
    peerAvatar: string
}

export const CallButtons = ({ conversationId, peerId, peerName, peerAvatar }: Props) => {
    const setOutgoingCall = useCallStore(s => s.setOutgoingCall)
    const socket = useSocketStore(s => s.socket)

const handleCall = async (type: "audio" | "video") => {
    if (!socket) return

    try {
        const { callId, callerId } = await initiateCall(conversationId, type)

        const localStream = await getLocalStream(type)
        const pc = createPeerConnection()

        localStream.getTracks().forEach(track => pc.addTrack(track, localStream))

        const iceCandidates: RTCIceCandidateInit[] = []
        pc.onicecandidate = ({ candidate }) => {
            if (candidate) {
                iceCandidates.push(candidate)
                // send to target user
                socket.emit("webrtc:ice-candidate", { callId, candidate, targetUserId: peerId })
            }
        }

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        // join room first
        socket.emit("join-room", callId)

setTimeout(() => {
    socket.emit("webrtc:offer", { callId, offer, targetUserId: peerId })
    console.log("📤 offer sent to room:", callId)
}, 500)

        setOutgoingCall({
            callId,
            callerId,
            receiverId: peerId,
            receiverName: peerName,
            receiverAvatar: peerAvatar,
            type,
            conversationId
        })

    } catch (err) {
        console.error("Failed to initiate call:", err)
    }
}
    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCall("audio")}
                className="text-muted-foreground hover:text-foreground"
            >
                <Phone className="w-5 h-5" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCall("video")}
                className="text-muted-foreground hover:text-foreground"
            >
                <Video className="w-5 h-5" />
            </Button>
        </div>
    )
}