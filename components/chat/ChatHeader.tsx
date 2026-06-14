import { Phone, Video, MoreVertical } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Props {
  name: string
  image: string
  isOnline: boolean
}

const ChatHeader = ({ name, image, isOnline }: Props) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">

      {/* Left — avatar + name + status */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-none mb-1">{name}</h3>
          <p className="text-xs text-muted-foreground">
            {isOnline ? "online" : "last seen recently"}
          </p>
        </div>
      </div>

      {/* Right — action icons */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Video className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

    </div>
  )
}

export default ChatHeader