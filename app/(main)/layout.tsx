"use client"
import { useEffect } from "react"
import { useConversationStore } from "@/store/conversationStore"
import { useSocketStore } from "@/store/socketStore"
import { useAuthStore } from "@/store/authStore"
import Sidebar from "@/components/shared/Sidebar"
import { useRouter } from "next/navigation"
import { OutgoingCallModal } from "@/components/call/OutgoingCallModal"
import { IncomingCallModal } from "@/components/call/IncomingCallModal"
import { ActiveCallModal } from "@/components/call/ActiveCall"

export default function Layout({ children }: { children: React.ReactNode }) {
  const fetchConversations = useConversationStore(s => s.fetchConversations)
  const activeType = useConversationStore(s => s.activeType)
  const { connect, disconnect } = useSocketStore()
  const user = useAuthStore(s => s.user)
  const hasHydrated = useAuthStore(s => s.hasHydrated)  // ← read this
  const router = useRouter()

  useEffect(() => {
    if (!hasHydrated) return       // ← wait, do nothing yet

    if (!user) {
      router.push("/login")
      return
    }

    fetchConversations(activeType)
    connect(user.id)               // ← safe, no ! needed

    return () => disconnect()
  }, [hasHydrated, user])          // ← depend on both

if (!hasHydrated) return (
  <div className="flex h-screen items-center justify-center bg-background">
    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
)


  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-80 shrink-0 flex flex-col border-r border-border">
        <Sidebar />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
        <OutgoingCallModal/>
        <IncomingCallModal/>
        <ActiveCallModal/>
    </div>
  )
}