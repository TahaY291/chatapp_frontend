import { MessageCircleDashed, Video, Phone, Lock } from "lucide-react"

const ChatsPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-background select-none gap-6">

      {/* Top icons — video, chat, phone */}
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
          <Video className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <MessageCircleDashed className="w-7 h-7 text-primary" />
        </div>
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
          <Phone className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-semibold text-foreground">
          Start a conversation
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          Select a contact from the sidebar to chat, make a voice call, or start a video call. Your conversations are synced across all your devices.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex items-center gap-2">
        {["Messaging", "Voice calls", "Video calls", "Groups"].map(f => (
          <span
            key={f}
            className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border"
          >
            {f}
          </span>
        ))}
      </div>

      {/* Bottom encrypted note */}
      <div className="absolute bottom-6 flex items-center gap-1.5">
        <Lock className="w-3 h-3 text-muted-foreground/50" />
        <p className="text-xs text-muted-foreground/50">
          End-to-end encrypted
        </p>
      </div>

    </div>
  )
}

export default ChatsPage