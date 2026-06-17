// components/call/OutgoingCallModal.tsx
"use client"
import { useEffect } from "react"
import { Phone, PhoneOff, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useCallStore } from "@/store/callStore"
import { endCall } from "@/api/call"

export const OutgoingCallModal = () => {
    const outgoingCall = useCallStore(s => s.outgoingCall)
    const clearOutgoingCall = useCallStore(s => s.clearOutgoingCall)

    // play ringing sound
    useEffect(() => {
        if (!outgoingCall) return
        const audio = new Audio("/sounds/calling.mp3")
        audio.loop = true
        audio.play().catch(() => {})  // catch autoplay block

        return () => {
            audio.pause()
            audio.currentTime = 0
        }
    }, [outgoingCall])

    if (!outgoingCall) return null  // not visible when no outgoing call

    const handleCancel = async () => {
        try {
            await endCall(outgoingCall.callId)
        } catch (err) {
            console.error(err)
        } finally {
            clearOutgoingCall()
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col items-center justify-center gap-8">

            <p className="text-sm text-muted-foreground">
                {outgoingCall.type === "video" ? "Video calling..." : "Calling..."}
            </p>

            <div className="relative">
                <Avatar className="w-28 h-28 ring-4 ring-primary/20 animate-pulse">
                    <AvatarImage src={outgoingCall.receiverAvatar ?? undefined} />
                    <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                        {outgoingCall.receiverName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    {outgoingCall.type === "video"
                        ? <Video className="w-4 h-4 text-white" />
                        : <Phone className="w-4 h-4 text-white" />
                    }
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-semibold">{outgoingCall.receiverName}</h2>
                <p className="text-muted-foreground text-sm mt-1">Ringing...</p>
            </div>
            <Button
                onClick={handleCancel}
                size="icon"
                className="w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90"
            >
                <PhoneOff className="w-7 h-7 text-white" />
            </Button>

        </div>
    )
}