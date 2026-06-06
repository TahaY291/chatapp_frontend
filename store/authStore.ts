import {create} from "zustand"
import { persist } from "zustand/middleware"
import { User } from "@/types/auth.type"

interface AuthStore {
    user: User | null,
    isAuthenticated: boolean,
    setUser: (user:User)=> void,
    clearUser : ()=> void
}

export const useAuthStore= create<AuthStore>()(
    persist(
        (set)=>({
            user: null,
            isAuthenticated: false,

            setUser:(user)=>set({
                user,
                isAuthenticated: true
            }),

            clearUser: ()=> ({
                user: null, 
                isAuthenticated: false
            })
        }),
        {
            name: "auth-store",
        }
    )
)
