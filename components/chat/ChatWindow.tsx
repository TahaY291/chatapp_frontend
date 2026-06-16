"use client"
import { useState, useEffect } from "react"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import { useConversationStore } from "@/store/conversationStore"
import { useAuthStore } from "@/store/authStore"
import { useMessageStore } from "@/store/messageStore"
import { onMarkAsRead, sendMessage } from "@/api/message"

interface ReplyTo {
    messageId: string
    content: string
    senderName: string
}

interface Props {
    conversationId: string
}

const ChatWindow = ({ conversationId }: Props) => {
    const [replyTo, setReplyTo] = useState<ReplyTo | null>(null)

    // ✅ everything from store now, no useState for messages/loading/pagination
    const messages = useMessageStore(s => s.messages)
    const loading = useMessageStore(s => s.loading)
    const loadingMore = useMessageStore(s => s.loadingMore)
    const pagination = useMessageStore(s => s.pagination)
    const fetchMessages = useMessageStore(s => s.fetchMessages)
    const loadMore = useMessageStore(s => s.loadMore)
    const setActiveConversation = useMessageStore(s => s.setActiveConversation)
    const reset = useMessageStore(s => s.reset)

    const user = useAuthStore(s => s.user)
    const conversations = useConversationStore(s => s.conversations)
    const activeConv = conversations.find(c => c.conversationId === conversationId)
    const resetUnreadCount = useConversationStore(s => s.resetUnreadCount)

    useEffect(() => {
        setActiveConversation(conversationId)
        fetchMessages(conversationId, 1)

        return () => reset()
    }, [conversationId])

    const handleReply = (msg: any) => {
        setReplyTo({
            messageId: msg.id,
            content: msg.content,
            senderName: msg.senderId === user?.id ? "You" : activeConv?.otherUsername ?? ""
        })
    }

const handleSendMessage = async (content: string, files?: any[], replyToId?: string) => {
    if (!content.trim() && (!files || files.length === 0)) return
    try {
        if (files && files.length > 0) {
            for (const selectedFile of files) {
                const newMessage = await sendMessage(
                    conversationId,
                    content.trim(),
                    selectedFile.file,
                    replyToId
                )
                useMessageStore.getState().addMessage(newMessage)
            }
        } else {
            const newMessage = await sendMessage(
                conversationId,
                content.trim(),
                undefined,
                replyToId
            )
            useMessageStore.getState().addMessage(newMessage)
        }

        useConversationStore.getState().updateConversationOnNewMessage({
            conversationId,
            content: files?.length
                ? files[0].type === "image" ? "📷 Photo"
                : files[0].type === "video" ? "🎥 Video"
                : files[0].type === "audio" ? "🎵 Audio"
                : "📄 Document"
                : content.trim(),
            type: files?.length ? files[0].type : "text",
            createdAt: new Date().toISOString(),
            senderId: user?.id
        })

        setReplyTo(null)

    } catch (err) {
        console.error("Failed to send message:", err)
    }
}
const handleMarkAsRead = async () => {
    resetUnreadCount(conversationId)
    try {
        await onMarkAsRead(conversationId) 
    } catch (err) {
        console.error("mark as read failed:", err)
    }
}
    if (!activeConv) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <p className="text-sm text-muted-foreground">Loading conversation...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-background">
            <ChatHeader
                otherUsername={activeConv.otherUsername}
                otherAvatarUrl={activeConv.otherAvatarUrl}
                otherIsOnline={activeConv.otherIsOnline}
                nickname={activeConv.nickname}
            />

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
            ) : (
                <MessageList
                    messages={messages}
                    onReply={handleReply}
                    onLoadMore={loadMore}
                    hasMore={pagination?.hasMore ?? false}
                    loadingMore={loadingMore}
                    conversationId={conversationId}
                    onMarkAsRead={handleMarkAsRead}
                />
            )}

            <MessageInput
                onSendMessage={handleSendMessage}
                replyTo={replyTo}
                onCancelReply={() => setReplyTo(null)}
            />
        </div>
    )
}

export default ChatWindow