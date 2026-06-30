import { create } from "zustand"
import { getRagConversation } from "@/api/rag"

interface FileConversation {
    id: string
    fileId: string
    question: string
    answer: string | null
    createdAt: string
}

interface CurrentFile {
    id: string
    originalName: string
    status: string
}

interface RagStore {
    currentFile: CurrentFile | null
    messages: FileConversation[]
    loading: boolean
    streaming: boolean
    streamingMessage: string

    setCurrentFile: (file: CurrentFile | null) => void
    fetchMessages: () => Promise<void>
    addQuestion: (question: string) => void
    appendToken: (token: string) => void
    finalizeAnswer: () => void
    clearAll: () => void
}

export const useRagStore = create<RagStore>((set, get) => ({
    currentFile: null,
    messages: [],
    loading: false,
    streaming: false,
    streamingMessage: '',

    setCurrentFile: (file) => set({ currentFile: file }),

    fetchMessages: async () => {
        try {
            set({ loading: true })
            const data = await getRagConversation()
            set({ messages: Array.isArray(data) ? data : [] })
        } catch (err) {
            set({ messages: [] })
        } finally {
            set({ loading: false })
        }
    },

    addQuestion: (question: string) => {
        const newMessage = {
            id: crypto.randomUUID(),
            fileId: get().currentFile?.id || '',
            question,
            answer: null,
            createdAt: new Date().toISOString()
        }
        set((state) => ({
            messages: [...state.messages, newMessage],
            streaming: true,
            streamingMessage: ''
        }))
    },

    appendToken: (token: string) => {
        set((state) => ({
            streamingMessage: state.streamingMessage + token
        }))
    },

    finalizeAnswer: () => {
        const { streamingMessage, messages } = get()
        const updatedMessages = [...messages]
        updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            answer: streamingMessage
        }
        set({
            messages: updatedMessages,
            streaming: false,
            streamingMessage: ''
        })
    },

    clearAll: () => set({
        currentFile: null,
        messages: [],
        streaming: false,
        streamingMessage: ''
    })
}))