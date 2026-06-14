import { Check, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

type MessageStatus = "sent" | "delivered" | "read"

interface Props {
    content: string
    isMine: boolean
    time: string
    status?: MessageStatus
}

const statusIcon = (status: MessageStatus) => {
    if (status === "read")
        return <CheckCheck className="w-3.5 h-3.5 text-primary" />
    if (status === "delivered")
        return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />
    return <Check className="w-3.5 h-3.5 text-muted-foreground" />
}

const MessageItem = ({ content, isMine, time, status }: Props) => {
    return (
        <div className={cn(
            "flex w-full px-4 py-0.5",
            isMine ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "max-w-[65%] rounded-2xl px-3.5 py-2",
                isMine
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-foreground rounded-bl-sm"
            )}>

                {/* Message text */}
                <p className="text-sm leading-relaxed wrap-break-words">{content}</p>

                {/* Time + status */}
                <div className={cn(
                    "flex items-center gap-1 mt-1",
                    isMine ? "justify-end" : "justify-start"
                )}>
                    <span className={cn(
                        "text-[10px]",
                        isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                        {time}
                    </span>
                    {isMine && status && statusIcon(status)}
                </div>

            </div>
        </div>
    )
}

export default MessageItem