// components/chat/ChatWindow.tsx
"use client"
import { useState, useEffect } from "react"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import { useConversationStore } from "@/store/conversationStore"
import { useAuthStore } from "@/store/authStore"

interface ReplyTo {
  messageId: string
  content: string
  senderName: string
}

interface Props {
  conversationId: string
}

const ChatWindow = ({ conversationId }: Props) => {
  const [messages, setMessages] = useState<any[]>([])
  const [replyTo, setReplyTo] = useState<ReplyTo | null>(null)
  const [loading, setLoading] = useState(true)

  const user = useAuthStore(s => s.user)
  const conversations = useConversationStore(s => s.conversations)

  // find the active conversation data from the store
  const activeConv = conversations.find(c => c.conversationId === conversationId)

  // fetch messages when conversationId changes
  useEffect(() => {
    if (!conversationId) return
    setLoading(true)
    setMessages([])
    setReplyTo(null)

    const fetchMessages = async () => {
      try {
        // replace with your actual API call
        // const data = await getMessages(conversationId)
        // setMessages(data)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [conversationId])

  const handleSendMessage = (content: string, files?: any[], replyToId?: string) => {
    // this will be wired to socket in next step
    console.log("send:", { content, files, replyToId })
  }

  // conversation not found in store yet
  if (!activeConv) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading conversation...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">

      {/* Top — fixed header */}
      <ChatHeader
        name={activeConv.name}
        image={activeConv.image}
        isOnline={activeConv.isOnline}
      />

      {/* Middle — scrollable message list */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <MessageList
          messages={messages}
          onReply={(msg) => setReplyTo({
            messageId: msg.id,
            content: msg.content,
            senderName: msg.senderId === user?.id ? "You" : activeConv.name
          })}
        />
      )}

      {/* Bottom — fixed input bar */}
      <MessageInput
        onSendMessage={handleSendMessage}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />

    </div>
  )
}

export default ChatWindow