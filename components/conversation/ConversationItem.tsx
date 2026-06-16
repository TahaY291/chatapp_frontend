"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/navigation'
import { MoreVertical } from "lucide-react"
import { useConversationStore } from "@/store/conversationStore"
import { cn } from "@/lib/utils"
import { formatMessageTime } from "@/lib/formatMessageTime"

interface Props {
  conversationId: string
  otherAvatarUrl: string
  otherUsername: string
  nickname: string
  lastMessage: string
  lastSeen: string
  unreadCount?: number
  otherIsOnline?: boolean
  lastMessageAt: string
}

const ConversationItem = ({ conversationId, otherAvatarUrl, otherUsername , nickname, lastMessage, lastMessageAt, unreadCount, otherIsOnline }: Props) => {
  const router = useRouter()
  const setActiveConversation = useConversationStore(s => s.setActiveConversation)
  const activeConversation = useConversationStore(s => s.activeConversation)
  const name = nickname ?? otherUsername
  const isActive = activeConversation === conversationId   // ← derive active state


  const handleClick = () => {
    setActiveConversation(conversationId)
    router.push(`/chats/${conversationId}`)
  }


  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors group",
        isActive
          ? "bg-secondary border-l-2 border-primary"   // ← active: indigo left border + bg
          : "hover:bg-secondary/50 border-l-2 border-transparent"  // ← inactive: transparent border to prevent layout shift
      )}
    >
      {/* Avatar with online dot */}
      <div className="relative shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage src={otherAvatarUrl} alt={otherAvatarUrl} />
          <AvatarFallback className={cn(
            "font-medium",
            isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {otherIsOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
        )}
      </div>

      {/* Name + last message */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className={cn(
            "text-sm truncate",
            isActive ? "font-semibold text-foreground" : "font-medium text-foreground"
          )}>
            {name}
          </h3>
          <span className={cn(
            "text-xs shrink-0 ml-2",
            isActive ? "text-primary" : "text-muted-foreground"  // ← timestamp turns indigo when active
          )}>
            {formatMessageTime(lastMessageAt)}
          </span>
        </div>
        <p className={cn(
          "text-sm truncate",
          isActive ? "text-foreground" : "text-muted-foreground"  // ← last message slightly brighter when active
        )}>
          {lastMessage}
        </p>
      </div>

      {/* Right side — unread count or 3 dot menu */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        {unreadCount && unreadCount > 0 ? (
          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : (
          <MoreVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  )
}

export default ConversationItem