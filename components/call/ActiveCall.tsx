// components/call/ActiveCallModal.tsx
"use client"
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useCallStore } from "@/store/callStore"
import { useSocketStore } from "@/store/socketStore"
import { endCall as endCallApi } from "@/api/call"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { cleanup, getCurrentLocalStream } from "@/lib/webrtc"

export const ActiveCallModal = () => {

    const [elapsed, setElapsed] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const activeCall = useCallStore(s => s.activeCall)
    const endCall = useCallStore(s => s.endCall)
    const toggleMute = useCallStore(s => s.toggleMute)
    const toggleCamera = useCallStore(s => s.toggleCamera)
    const socket = useSocketStore(s => s.socket)


    useEffect(() => {
        if (activeCall?.status === "connected") {
            timerRef.current = setInterval(() => {
                setElapsed(prev => prev + 1)
            }, 1000)
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
                timerRef.current = null
            }
            setElapsed(0)
        }
    }, [activeCall?.status])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0")
        const s = (seconds % 60).toString().padStart(2, "0")
        return `${m}:${s}`
    }



    useEffect(() => {
        if (!activeCall) return
        try {
            const localVideo = document.getElementById("local-video") as HTMLVideoElement | null
            const stream = getCurrentLocalStream()
            if (localVideo && stream) {
                localVideo.srcObject = stream
            }
        } catch (err) {
        }
    }, [activeCall])

    if (!activeCall) return null
    const handleEndCall = async () => {
        try {
            await endCallApi(activeCall.callId)
            socket?.emit("leave-room", activeCall.callId)
        } catch (err) {
            console.error(err)
        } finally {
            cleanup()
            endCall()
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">

            {/* video area — for audio calls this stays a centered avatar */}
            <div className="flex-1 flex items-center justify-center relative">

                {activeCall.type === "video" && !activeCall.isCameraOff ? (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                        {/* remote video element goes here once webrtc stream is wired */}
                        <video id="remote-video" autoPlay playsInline className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                            <AvatarImage src={activeCall.peerAvatar ?? undefined} />
                            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                                {activeCall.peerName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold">{activeCall.peerName}</h2>
                            <p className="text-muted-foreground text-sm mt-1">
                                {activeCall.status === "connecting" ? "Connecting..." : formatTime(elapsed)}
                            </p>
                        </div>
                    </div>
                )}

                {/* local video preview — picture in picture, video calls only */}
                {activeCall.type === "video" && (
                    <div className="absolute bottom-6 right-6 w-28 h-40 rounded-lg overflow-hidden border-2 border-border bg-secondary">
                        <video id="local-video" autoPlay playsInline muted className="w-full h-full object-cover" />
                    </div>
                )}
                <audio id="remote-audio" autoPlay playsInline className="hidden" />

            </div>

            {/* controls bar */}
            <div className="flex items-center justify-center gap-4 py-8">

                <Button
                    onClick={toggleMute}
                    size="icon"
                    className={cn(
                        "w-14 h-14 rounded-full",
                        activeCall.isMuted
                            ? "bg-destructive hover:bg-destructive/90"
                            : "bg-secondary hover:bg-secondary/80"
                    )}
                >
                    {activeCall.isMuted
                        ? <MicOff className="w-6 h-6 text-white" />
                        : <Mic className="w-6 h-6 text-foreground" />
                    }
                </Button>

                {activeCall.type === "video" && (
                    <Button
                        onClick={toggleCamera}
                        size="icon"
                        className={cn(
                            "w-14 h-14 rounded-full",
                            activeCall.isCameraOff
                                ? "bg-destructive hover:bg-destructive/90"
                                : "bg-secondary hover:bg-secondary/80"
                        )}
                    >
                        {activeCall.isCameraOff
                            ? <VideoOff className="w-6 h-6 text-white" />
                            : <Video className="w-6 h-6 text-foreground" />
                        }
                    </Button>
                )}

                <Button
                    onClick={handleEndCall}
                    size="icon"
                    className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90"
                >
                    <PhoneOff className="w-7 h-7 text-white" />
                </Button>

            </div>

        </div>
    )
}