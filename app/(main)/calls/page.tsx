// app/(main)/calls/page.tsx — only shown if no conversation selected while Calls tab is active
import { Phone, Video } from "lucide-react"

export default function CallsEmptyPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-background select-none gap-4">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
        <Phone className="w-7 h-7 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground">Your call history</h2>
        <p className="text-sm text-muted-foreground max-w-xs mt-1">
          Select a call from the sidebar to open the conversation, or call back directly.
        </p>
      </div>
    </div>
  )
}