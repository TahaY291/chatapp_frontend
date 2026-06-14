import api from "@/lib/axios";


export const getGroupConversations = async () => {
    const response = await api.get('/group/groups')
    return response.data
}