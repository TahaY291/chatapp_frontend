import { Phone, Video, MoreVertical } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CallButtons } from "../call/CallButton"

interface Props {
   otherAvatarUrl: string
  otherUsername: string
  nickname: string
  otherIsOnline: string
  conversationId: string
  otherUserId: string
}

const ChatHeader = ({ otherUsername, nickname, otherIsOnline , otherAvatarUrl , conversationId , otherUserId}: Props) => {
    let name = nickname ?? otherUsername

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">

      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherAvatarUrl} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {otherIsOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-none mb-1">{name}</h3>
          <p className="text-xs text-muted-foreground">
            {otherIsOnline ? "online" : "last seen recently"}
          </p>
        </div>
      </div>

      <CallButtons peerId={otherUserId} peerAvatar={otherAvatarUrl} peerName={name} conversationId={conversationId}  />
    </div>
  )
}

export default ChatHeader