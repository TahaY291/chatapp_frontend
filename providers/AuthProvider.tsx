"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { getMe } from "@/api/auth"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, clearUser, setHasHydrated } = useAuthStore()

    useEffect(() => {
        const hydrate = async () => {
            try {
                const data = await getMe()
                setUser(data.data)
            } catch (error) {
                clearUser()
            } finally {
                setHasHydrated(true)
            }
        }
        hydrate()
    }, [])

    return <>{children}</>
}