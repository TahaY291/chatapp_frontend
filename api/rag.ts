import api from "@/lib/axios"

export const getRagConversation = async () => {
    const res = await api.get(`/rag/conversations/`)
    return res.data.conversations
}

export const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/rag/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data.file
}

export const askQuestion = async (question: string, fileId: string) => {
    const res = await api.post('/rag/query', { question, fileId })
    return res.data
}

export const deleteFile = async (fileId: string) => {
    const res = await api.delete(`/rag/delete/${fileId}`)
    return res.data
}