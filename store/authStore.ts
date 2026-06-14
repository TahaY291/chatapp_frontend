// store/authStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "@/types/auth.type"

interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    hasHydrated: boolean          // ← add this
    setUser: (user: User) => void
    clearUser: () => void
    setHasHydrated: (state: boolean) => void  // ← add this
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            hasHydrated: false,        // ← starts false

            setUser: (user) => set({ user, isAuthenticated: true }),

            clearUser: () => set({ user: null, isAuthenticated: false }),

            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: "auth-store",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)   // ← fires after localStorage is read
            }
        }
    )
)