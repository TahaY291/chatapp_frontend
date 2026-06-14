// components/shared/ConversationTabs.tsx
"use client"
import { useConversationStore } from "@/store/conversationStore"

export const ConversationTabs = () => {
  const { activeType, setActiveType } = useConversationStore()

  return (
    <div className="flex border-b border-border">
      <button
        onClick={() => setActiveType("direct")}
        className={`flex-1 py-2 text-sm font-medium transition-colors
          ${activeType === "direct"
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
          }`}
      >
        Direct
      </button>
      <button
        onClick={() => setActiveType("group")}
        className={`flex-1 py-2 text-sm font-medium transition-colors
          ${activeType === "group"
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
          }`}
      >
        Groups
      </button>
    </div>
  )
}