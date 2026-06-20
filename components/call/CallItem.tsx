"use client"
import { Phone, PhoneMissed, Video, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"
import { CallButtons } from "./CallButton"

interface Props {
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

const formatDuration = (seconds: number | null) => {
    if (!seconds) return null
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
}

const formatCallTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    return date.toLocaleDateString([], { day: "numeric", month: "short" })
}

const CallItem = (call: Props) => {
    const user = useAuthStore(s => s.user)
    // console.log("Rendering CallItem with props:", call)
    console.log("Current user:", call.conversationId, call.receiverId, call.receiverAvatar, call.receiverUsername) // Log relevant props to verify data

    // figure out who "the other person" is relative to me
    const isOutgoing = call.callerId === user?.id
    const peerName = isOutgoing ? call.receiverUsername : call.callerUsername
    const peerAvatar = isOutgoing ? call.receiverAvatar : call.callerAvatar

    const isMissed = call.status === "missed" || call.status === "rejected"

    return (
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-secondary cursor-pointer transition-colors">

            {/* Avatar */}
            <Avatar className="w-12 h-12 shrink-0">
                <AvatarImage src={peerAvatar ?? undefined} alt={peerName} />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {peerName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            {/* Name + call info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">{peerName}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                    {/* direction arrow */}
                    {isOutgoing
                        ? <ArrowUpRight className={cn("w-3.5 h-3.5", isMissed ? "text-destructive" : "text-green-500")} />
                        : <ArrowDownLeft className={cn("w-3.5 h-3.5", isMissed ? "text-destructive" : "text-green-500")} />
                    }

                    {/* call type icon */}
                    {call.type === "video"
                        ? <Video className="w-3.5 h-3.5 text-muted-foreground" />
                        : <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    }

                    <span className={cn(
                        "text-xs",
                        isMissed ? "text-destructive" : "text-muted-foreground"
                    )}>
                        {isMissed
                            ? "Missed"
                            : formatDuration(call.duration) ?? "Connected"
                        }
                    </span>
                </div>
            </div>

            {/* Time + call back button */}
            <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs text-muted-foreground">
                    {formatCallTime(call.createdAt)}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        // trigger call back — wire to your CallButtons logic
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors"
                >
                    <CallButtons conversationId={call.conversationId} peerId={call.receiverId} peerName={call?.receiverUsername} peerAvatar={call?.receiverAvatar ?? ""} />
                </button>
            </div>

        </div>
    )
}

export default CallItem