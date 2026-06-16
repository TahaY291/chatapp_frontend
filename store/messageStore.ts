import { create } from "zustand"
import { getMessagesByConversationId } from "@/api/message"

interface MessageStore {
    messages: any[]
    pagination: any
    loading: boolean
    loadingMore: boolean
    activeConversationId: string | null

    fetchMessages: (conversationId: string, page?: number) => Promise<void>
    loadMore: () => Promise<void>
    addMessage: (message: any) => void        // called by socket
    setActiveConversation: (id: string) => void
    reset: () => void
}

export const useMessageStore = create<MessageStore>((set, get) => ({
    messages: [],
    pagination: null,
    loading: false,
    loadingMore: false,
    activeConversationId: null,

    setActiveConversation: (id) => set({ activeConversationId: id }),

    fetchMessages: async (conversationId, page = 1) => {
        try {
            page === 1
                ? set({ loading: true })
                : set({ loadingMore: true })

            const data = await getMessagesByConversationId(conversationId, page)
            const { messages: newMessages, pagination } = data.data

            if (page === 1) {
                set({
                    messages: Array.isArray(newMessages) ? newMessages : [],
                    pagination
                })
            } else {
                set(state => ({
                    messages: [...(Array.isArray(newMessages) ? newMessages : []), ...state.messages],
                    pagination
                }))
            }
        } catch (err) {
            set({ messages: [] })
        } finally {
            set({ loading: false, loadingMore: false })
        }
    },

    loadMore: async () => {
        const { pagination, loadingMore, activeConversationId } = get()
        if (!pagination?.hasMore || loadingMore || !activeConversationId) return
        const nextPage = pagination.currentPage + 1
        await get().fetchMessages(activeConversationId, nextPage)
    },

    // called directly by socket store when new message arrives
    addMessage: (message) => {
        set(state => ({
            messages: [...state.messages, message]  // append at bottom (newest)
        }))
    },

    reset: () => set({
        messages: [],
        pagination: null,
        loading: false,
        activeConversationId: null
    })
}))