"use client"
import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Loader2 } from "lucide-react"
import { useSearchStore } from "@/store/searchStore"
import { useAuthStore } from "@/store/authStore"
import { logOutUser } from "@/api/auth"
import { set } from "zod"

const Navbar = () => {
  const { query, results, loading, error, setQuery, searchUser, startConversation, clear } = useSearchStore()
  const { user , clearUser } = useAuthStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") searchUser()
    if (e.key === "Escape") clear()
  }

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        clear()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectUser = async (user: any) => {
    await startConversation(user)
  }

  const handleLogout = async () => {
    await logOutUser()
    clearUser()
  }

  const showDropdown = results || error || loading

  return (
    <nav>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-foreground tracking-tight">Converse</span>
        </div>
        <Avatar onClick={()=>handleLogout()} className="cursor-pointer hover:opacity-80 transition-opacity w-8 h-8">
          <AvatarImage src={user?.avatarUrl ?? ""} alt="Your profile" />
          <AvatarFallback className="bg-primary text-primary-foreground font-medium text-xs">
            yo
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Search */}
      <div className="relative px-3 py-2" ref={dropdownRef}>
        <div className="relative">
          {loading
            ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
            : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          }
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by email, press Enter..."
            className="pl-9 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">

            {/* loading state */}
            {loading && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {/* error state */}
            {error && !loading && (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                {error}
              </div>
            )}

            {/* result */}
            {results && !loading && (
              <div
                onClick={() => handleSelectUser(results)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary cursor-pointer transition-colors"
              >
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarImage src={results.avatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    {results.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{results.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{results.email}</p>
                </div>
                {results.isOnline && (
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar