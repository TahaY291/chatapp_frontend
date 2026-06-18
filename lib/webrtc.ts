import { useCallStore } from "@/store/callStore"

let peerConnection: RTCPeerConnection | null = null
let localStream: MediaStream | null = null

export const createPeerConnection = () => {
    peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
        ]
    })
    peerConnection.ontrack = (event) => {
        try {
            const remoteVideo = document.getElementById("remote-video") as HTMLVideoElement | null
            const remoteAudio = document.getElementById("remote-audio") as HTMLAudioElement | null
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0]
            }
            if (remoteAudio) {
                remoteAudio.srcObject = event.streams[0]
            }
        } catch (err) {
        }
    }

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
