import { useCallStore } from "@/store/callStore"

// lib/webrtc.ts
let peerConnection: RTCPeerConnection | null = null
let localStream: MediaStream | null = null

export const createPeerConnection = () => {
    peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
        ]
    })
    // Attach remote stream to the active remote video element when tracks arrive
    peerConnection.ontrack = (event) => {
        try {
            const remoteVideo = document.getElementById("remote-video") as HTMLVideoElement | null
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0]
            }
        } catch (err) {
            // running in non-DOM environment (SSR) — ignore
        }
    }

    // Update call status when connection state changes
    peerConnection.onconnectionstatechange = () => {
        const pc = peerConnection
        if (!pc) return
        try {
            if (pc.connectionState === "connected") {
                const active = useCallStore.getState().activeCall
                if (active) {
                    useCallStore.getState().setActiveCall({ ...active, status: "connected" })
                }
            }
        } catch (err) {
            // ignore
        }
    }

    return peerConnection
}

export const getPeerConnection = () => peerConnection   // ← add this

export const getLocalStream = async (callType: "audio" | "video") => {
    localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video"
    })
    try {
        const localVideo = document.getElementById("local-video") as HTMLVideoElement | null
        if (localVideo) localVideo.srcObject = localStream
    } catch (err) {
        // ignore when document is not present
    }
    return localStream
}
export const getCurrentLocalStream = () => localStream

export const cleanup = () => {
    localStream?.getTracks().forEach(t => t.stop())
    peerConnection?.close()
    peerConnection = null
    localStream = null
}
