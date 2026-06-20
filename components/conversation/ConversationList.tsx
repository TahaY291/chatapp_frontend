// components/shared/ConversationList.tsx
"use client"
import { useConversationStore } from "@/store/conversationStore"
import ConversationItem from "./ConversationItem"
import { ConversationSkeletonList } from "./ConversationItemSkeleton"

export const ConversationList = () => {
  const { conversations, loading } = useConversationStore()

  if (loading) return <ConversationSkeletonList />

  return (
    <div className="flex-1 overflow-y-auto ">
       {
        conversations.map(conv => {
          return(
            <ConversationItem key={conv.conversationId} {...conv}/> 
          )
        })
       }
    </div>
  )
}