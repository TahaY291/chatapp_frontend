import { useEffect } from 'react'
import { useCallHistoryStore } from '@/store/callHistoryStore'
import CallItem from './CallItem'
import { PhoneOff } from 'lucide-react'

const CallHistory = () => {
    const fetchCallHistory = useCallHistoryStore(s => s.fetchCallHistory)
    const callHistory = useCallHistoryStore(s => s.callHistory)
    const loading = useCallHistoryStore(s => s.loading)

    useEffect(() => {
        fetchCallHistory()
    }, [])

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        )
    }

    if (callHistory.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                    <PhoneOff className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No call history yet</p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto ">
            {callHistory.map(call => (
                <CallItem key={call.callId} {...call} />
            ))}
        </div>
    )
}

export default CallHistory