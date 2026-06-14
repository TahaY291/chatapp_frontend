// components/chat/MessageList.tsx
"use client"
import { useEffect, useRef } from "react"
import MessageItem from "./MessageItem"
import { useAuthStore } from "@/store/authStore"

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: string
    status: "sent" | "delivered" | "read"
}
interface Props {
    messages: any[]
    onReply: (msg: any) => void
}

const MessageList = ({ messages, onReply }: Props) => {
    const user = useAuthStore(s => s.user)
    const bottomRef = useRef<HTMLDivElement>(null)

    // auto scroll to bottom on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
            {messages.map((msg, i) => {
                const isMine = msg.senderId === user?.id
                const prevMsg = messages[i - 1]
                const isSameSenderAsPrev = prevMsg?.senderId === msg.senderId

                return (
                    <div
                        key={msg.id}
                        className={isSameSenderAsPrev ? "mt-0.5" : "mt-3"}
                        onDoubleClick={() => onReply(msg)}   // ← double click to reply
                    >
                        <MessageItem
                            content={msg.content}
                            isMine={isMine}
                            time={new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit", minute: "2-digit"
                            })}
                            status={isMine ? msg.status : undefined}
                        />
                    </div>
                )
            })}
            <div ref={bottomRef} />
        </div>
    )
}

export default MessageList