// components/shared/ConversationTabs.tsx
"use client"
import { useConversationStore } from "@/store/conversationStore"
import Link from "next/link"

export const ConversationTabs = () => {
  const { activeType, setActiveType } = useConversationStore()

  return (
    <div className="flex border-b border-border">
      <Link href={"/chats"}
        onClick={() => setActiveType("direct")}
        className={`flex-1 py-2 text-sm font-medium transition-colors text-center
      ${activeType === "direct"
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
          }`}>
        Chats
      </Link>

      <Link
        href="/calls"
        onClick={() => setActiveType("calls")}
        className={`flex-1 py-2 text-sm font-medium transition-colors text-center
      ${activeType === "calls"
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
          }`}
      >
        Calls
      </Link>
    </div>
  )
}