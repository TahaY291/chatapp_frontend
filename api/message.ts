import api from "@/lib/axios"

export const getMessagesByConversationId = async (conversationId: string , page = 1) => {
    const response = await api.get(`/message/${conversationId}?page=${page}`)
    return response.data
}


export const sendMessage = async (
    conversationId: string,
    content: string,
    file?: File,
    replyToId?: string
) => {
    if (file) {
        const formData = new FormData()
        formData.append("conversationId", conversationId)
        formData.append("file", file)
        if (content) formData.append("content", content)
        if (replyToId) formData.append("replyToId", replyToId)

        const res = await api.post("/message/send", formData)
        return res.data.data
    }

    const res = await api.post("/message/send", {
        conversationId,
        content,
        ...(replyToId && { replyToId })
    })
    return res.data.data
}

export const onMarkAsRead = async (conversationId: string) => {
    const response = await api.patch(`/message/read/${conversationId}`)
    return response.data
}