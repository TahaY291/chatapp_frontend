import api from "@/lib/axios";

export const getDirectConversations = async () => {
    const response = await api.get('/message/conversations')
    return response.data.data ?? []
}

export const createConversation = async (participantId: string) => {
  const res = await api.post("/conversation/create", { participantId })
  return res.data.data
}