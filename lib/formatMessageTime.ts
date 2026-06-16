export const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()

    const isToday = date.toDateString() === now.toDateString()

    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const isYesterday = date.toDateString() === yesterday.toDateString()

    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
    }

    if (isYesterday) {
        return "Yesterday"
    }

    if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: "long" })
    }

    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" })
}