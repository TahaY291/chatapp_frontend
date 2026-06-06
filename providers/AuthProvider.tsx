"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { getMe } from "@/api/auth"

export default function AuthProvider ( {
    children
}: {children : React.ReactNode}){
    const {setUser , clearUser} = useAuthStore()

    useEffect(()=>{
        const hydrate = async()=>{
            try {
                const data = await getMe()
                setUser(data.data)
            } catch (error) {
                clearUser()
            }

        }
         hydrate()
    }, [])
    return <>{children}</>
}