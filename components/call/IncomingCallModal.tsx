// components/call/IncomingCallModal.tsx
"use client"
import { useEffect, useRef } from "react"
import { Phone, PhoneOff, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useCallStore } from "@/store/callStore"
import { useSocketStore } from "@/store/socketStore"
import { acceptCall, rejectCall } from "@/api/call"
import { createPeerConnection, getLocalStream } from "@/lib/webrtc"

export const IncomingCallModal = () => {
    const incomingCall = useCallStore(s => s.incomingCall)
    const clearIncomingCall = useCallStore(s => s.clearIncomingCall)
    const setActiveCall = useCallStore(s => s.setActiveCall)
    const socket = useSocketStore(s => s.socket)

    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)

    // play ringtone
    useEffect(() => {
        if (!incomingCall) return
        const audio = new Audio("/sounds/ringtone.mp3")
        audio.loop = true
        audio.play().catch(() => { })

        return () => {
            audio.pause()
            audio.currentTime = 0
        }
    }, [incomingCall])

    if (!incomingCall) return null

    const handleAccept = async () => {
        if (!incomingCall || !socket) return
        if (!incomingCall.offer) {
            console.error("❌ no offer yet — wait a moment")
            return
        }

        try {
            await acceptCall(incomingCall.callId)

            const localStream = await getLocalStream(incomingCall.type)
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream
            }

            const pc = createPeerConnection()

            localStream.getTracks().forEach(track => pc.addTrack(track, localStream))

            pc.onicecandidate = ({ candidate }) => {
                if (candidate) {
                    socket.emit("webrtc:ice-candidate", {
                        callId: incomingCall.callId,
                        candidate,
                        targetUserId: incomingCall.callerId
                    })
                }
            }

            pc.ontrack = ({ streams }) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = streams[0]
                }
            }

            socket.emit("join-room", incomingCall.callId)

            if (!incomingCall.offer) {
                throw new Error("No offer received from caller")
            }
            await pc.setRemoteDescription(incomingCall.offer)

            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)

            socket.emit("webrtc:answer", { callId: incomingCall.callId, answer, targetUserId: incomingCall.callerId })

            setActiveCall({
                callId: incomingCall.callId,
                peerId: incomingCall.callerId,
                peerName: incomingCall.callerName,
                peerAvatar: incomingCall.callerAvatar,
                type: incomingCall.type,
                status: "connecting",
                isMuted: false,
                isCameraOff: false,
            })
            clearIncomingCall()

        } catch (err) {
            console.error("Failed to accept call:", err)
            clearIncomingCall()
        }
    }

    const handleReject = async () => {
        try {
            await rejectCall(incomingCall.callId)
        } catch (err) {
            console.error(err)
        } finally {
            clearIncomingCall()
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col items-center justify-center gap-8">

            {/* hidden video elements — needed for the peer connection's tracks even before active call UI shows */}
            <video ref={localVideoRef} autoPlay playsInline muted className="hidden" />
            <video ref={remoteVideoRef} autoPlay playsInline className="hidden" />

            <p className="text-sm text-muted-foreground">
                Incoming {incomingCall.type === "video" ? "video call" : "call"}
            </p>

            <div className="relative">
                <Avatar className="w-28 h-28 ring-4 ring-primary/30 animate-pulse">
                    <AvatarImage src={incomingCall.callerAvatar ?? undefined} />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                        {incomingCall.callerName ?? " ".slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    {incomingCall.type === "video"
                        ? <Video className="w-4 h-4 text-white" />
                        : <Phone className="w-4 h-4 text-white" />
                    }
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-semibold">{incomingCall.callerName}</h2>
                <p className="text-muted-foreground text-sm mt-1">is calling you...</p>
            </div>

            <div className="flex items-center gap-6">
                <Button onClick={handleReject} size="icon" className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90">
                    <PhoneOff className="w-7 h-7 text-white" />
                </Button>
                <Button onClick={handleAccept} size="icon" className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700">
                    <Phone className="w-7 h-7 text-white" />
                </Button>
            </div>

        </div>
    )
}