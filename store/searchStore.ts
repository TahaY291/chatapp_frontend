import { create } from "zustand"
import { searchUser } from '@/api/user'
// import { saveContact } from "@/api/user"
import { createConversation } from "@/api/conversations"
import { useConversationStore } from "./conversationStore"

interface SearchedUser {
    id: string
    username: string
    email: string
    avatarUrl: string
    isOnline: string
}

interface SearchStore {
    query: string
    results: SearchedUser | null
    loading: boolean
    error: string | null
    setQuery: (q: string) => void
    searchUser: () => Promise<void>
    startConversation: (user: SearchedUser) => Promise<void>
    clear: () => void
}

export const useSearchStore = create<SearchStore>((set, get) => ({
    query: "",
    results: null,
    loading: false,
    error: null,

    setQuery: (q) => {
        set({ query: q, error: null })
        if (!q.trim()) set({ results: null })
    },

    searchUser: async () => {
        const { query } = get()
        if (!query.trim()) return
        set({ loading: true, error: null, results: null })
        try {
            const user = await searchUser(query)
            set({ results: user })
        } catch (err: any) {
            set({ error: err.response?.data?.message || "User not found" })
        } finally {
            set({ loading: false })
        }
    },

    startConversation: async (user) => {
        try {

            // await saveContact(user.id)
            const conversation = await createConversation(user.id)
            useConversationStore.getState().addConversation(conversation)
            get().clear()
        } catch (err: any) {
            // contact already saved is fine — still open the conversation
            if (err.response?.status !== 400) throw err
            const conversation = await createConversation(user.id)
            useConversationStore.getState().addConversation(conversation)
            get().clear()
        }
    },

    clear: () => set({ query: "", results: null, error: null }),

}))