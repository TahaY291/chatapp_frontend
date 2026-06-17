import { create } from "zustand";

interface IncomingCall {
    callId: string
    callerId: string
    callerName: string
    callerAvatar: string
    type: "audio" | "video"
    conversationId: string
    offer: RTCSessionDescriptionInit | null
}

interface OutgoingCall {
    callId: string
    callerId: string
    receiverId: string
    receiverName: string
    receiverAvatar: string
    type: "audio" | "video"
    conversationId: string
}

interface ActiveCall {
    callId: string
    peerId: string
    peerName: string
    peerAvatar: string
    type: "audio" | "video"
    status: "connecting" | "connected"
    isMuted: boolean
    isCameraOff: boolean
}

interface CallStore {
    incomingCall: IncomingCall | null
    outgoingCall: OutgoingCall | null
    activeCall: ActiveCall | null
    setIncomingCall: (call: IncomingCall) => void
    clearIncomingCall: () => void
    setOutgoingCall: (call: OutgoingCall) => void
    clearOutgoingCall: () => void
    setActiveCall: (call: ActiveCall) => void
    endCall: () => void
    toggleMute: () => void
    toggleCamera: () => void
}

export const useCallStore = create<CallStore>((set, get) => ({
    incomingCall: null,
    outgoingCall: null,
    activeCall: null,

    setIncomingCall: (call) => set({ incomingCall: call }),
    clearIncomingCall: () => set({ incomingCall: null }),

    setOutgoingCall: (call) => set({ outgoingCall: call }),
    clearOutgoingCall: () => set({ outgoingCall: null }),

    setActiveCall: (call) => set({ activeCall: call }),

    endCall: () => set({
        incomingCall: null,
        outgoingCall: null,
        activeCall: null
    }),

    toggleMute: () => set(state => ({
        activeCall: state.activeCall
            ? { ...state.activeCall, isMuted: !state.activeCall.isMuted }
            : null
    })),

    toggleCamera: () => set(state => ({
        activeCall: state.activeCall
            ? { ...state.activeCall, isCameraOff: !state.activeCall.isCameraOff }
            : null
    }))
}))