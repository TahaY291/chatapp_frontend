// api/users.ts
import api from "@/lib/axios"
export const searchUser = async (query: string) => {
  const res = await api.get(`/user/search?email=${query}`)
  return res.data.data
}

export const saveContact = async (contactId: string, nickname?: string) => {
  const res = await api.post("/contact/save", { contactId, nickname })
  return res.data
}