import { create } from "zustand"
import { getDirectConversations } from "@/api/conversations"
import { getGroupConversations } from "@/api/groups"
import { useAuthStore } from "./authStore"
type ConversationType = "direct" | "group"

interface ConversationStore {
    conversations: any[]
    activeType: ConversationType
    loading: boolean
    activeConversation: string | null
    fetchConversations: (type: ConversationType) => Promise<void>
    setActiveType: (type: ConversationType) => void,
    updateConversationOnNewMessage: (message: any) => void
    setActiveConversation: (conversationId: string) => void
    addConversation: (conversation: any) => void
    resetUnreadCount: (conversationId: string)=> void

}

export const useConversationStore = create<ConversationStore>((set, get) => ({
    conversations: [],
    activeType: "direct",
    loading: false,
    activeConversation: null,
    setActiveType: (type) => {
        set({ activeType: type })
        get().fetchConversations(type)
    },

    fetchConversations: async (type) => {
        set({ loading: true })
        try {
            const data = type === "direct"
                ? await getDirectConversations()
                : await getGroupConversations()
            set({ conversations: Array.isArray(data) ? data : [], loading: false })
        } catch (err) {
            set({ conversations: [], loading: false })  // ← stop loading on error too
        }
    },
    updateConversationOnNewMessage: (message) => {
        const currentUserId = useAuthStore.getState().user?.id
        
        set(state => ({
            conversations: state.conversations.map(conv => {
                if (conv.conversationId !== message.conversationId) return conv
                const isReceiver = message.senderId !== currentUserId

                return {
                    ...conv,
                    lastMessage: message.content,
                    lastMessageType: message.type,
                    lastMessageAt: message.createdAt,
                    unreadCount: isReceiver ? Number(conv.unreadCount) + 1 : Number(conv.unreadCount),
                }
            })
                .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
        }))
    },
    setActiveConversation: (conversationId) => set({
        activeConversation: conversationId
    }),
    addConversation: (conversation) => {
        set(state => {
            const list = Array.isArray(state.conversations) ? state.conversations : []  // ← guard
            const exists = list.find(c => c.conversationId === conversation.conversationId)
            if (exists) return state
            return { conversations: [conversation, ...list] }
        })
    },
    resetUnreadCount: (conversationId: string) => {
    set(state => ({
        conversations: state.conversations.map(conv =>
            conv.conversationId === conversationId
                ? { ...conv, unreadCount: 0 }
                : conv
        )
    }))
}
}))