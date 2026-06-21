import { Check, CheckCheck, FileText, Download, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

type MessageStatus = "sent" | "delivered" | "read"
type MessageType = "text" | "image" | "video" | "audio" | "file"

interface Props {
    content: string | null
    mediaUrl?: string | null
    type: MessageType
    isMine: boolean
    time: string
    status?: MessageStatus
}

const statusIcon = (status: MessageStatus) => {
    if (status === "read")
        return <CheckCheck className="w-3.5 h-3.5 text-primary" />
    if (status === "delivered")
        return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />
    return <Check className="w-3.5 h-3.5 text-muted-foreground" />
}

const getFileName = (url: string) => {
    try {
        const parts = url.split("/")
        return parts[parts.length - 1]
    } catch {
        return "Document"
    }
}

const MessageItem = ({ content, mediaUrl, type, isMine, time, status }: Props) => {
    const isUploading = mediaUrl === "uploading"

    return (
        <div className={cn(
            "flex w-full px-4 py-0.5",
            isMine ? "justify-end" : "justify-start"
        )}>
            <div className={cn(
                "rounded-2xl overflow-hidden",
                type === "text" ? "max-w-[65%] px-3.5 py-2" : "max-w-75",
                isMine
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary text-foreground rounded-bl-sm"
            )}>

                {/* ── IMAGE ───────────────────────────────────────── */}
                {type === "image" && mediaUrl && (
                    <div className="relative">
                        {isUploading ? (
                            <div className="w-70 h-50 bg-black/10 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin opacity-60" />
                            </div>
                        ) : (
                            <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={mediaUrl}
                                    alt="Shared image"
                                    width={280}
                                    height={280}
                                    className="w-full h-auto max-h-80 object-cover cursor-pointer"
                                />
                            </a>
                        )}
                        {content && (
                            <p className="text-sm px-3 py-2 leading-relaxed wrap-break-words">{content}</p>
                        )}
                    </div>
                )}

                {/* ── VIDEO ───────────────────────────────────────── */}
                {type === "video" && mediaUrl && (
                    <div className="relative">
                        {isUploading ? (
                            <div className="w-70 h-50 bg-black/10 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin opacity-60" />
                            </div>
                        ) : (
                            <video
                                src={mediaUrl}
                                controls
                                className="w-full max-h-80 bg-black"
                            />
                        )}
                        {content && (
                            <p className="text-sm px-3 py-2 leading-relaxed wrap-break-words">{content}</p>
                        )}
                    </div>
                )}

                {/* ── AUDIO ───────────────────────────────────────── */}
                {type === "audio" && mediaUrl && (
                    <div className="px-3 py-2.5">
                        {isUploading ? (
                            <div className="flex items-center gap-2 text-xs opacity-60">
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                Uploading audio...
                            </div>
                        ) : (
                            <audio src={mediaUrl} controls className="max-w-65 h-9" />
                        )}
                        {content && (
                            <p className="text-sm mt-2 leading-relaxed wrap-break-words">{content}</p>
                        )}
                    </div>
                )}

                {/* ── FILE / DOCUMENT ────────────────────────────── */}
                {type === "file" && mediaUrl && (
                    <div className="px-3 py-2.5">
                        {isUploading ? (
                            <div className="flex items-center gap-2 text-xs opacity-60">
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                Uploading document...
                            </div>
                        ) : (
                            <a
                                href={mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    "flex items-center gap-3 rounded-lg p-2.5 transition-colors",
                                    isMine ? "bg-white/10 hover:bg-white/15" : "bg-background hover:bg-muted"
                                )}
                            >
                                <div className={cn(
                                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                    isMine ? "bg-white/15" : "bg-secondary"
                                )}>
                                    <FileText className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{getFileName(mediaUrl)}</p>
                                    <p className={cn("text-[10px]", isMine ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                        Tap to open
                                    </p>
                                </div>
                                <Download className="w-3.5 h-3.5 shrink-0 opacity-70" />
                            </a>
                        )}
                        {content && (
                            <p className="text-sm mt-2 leading-relaxed wrap-break-words">{content}</p>
                        )}
                    </div>
                )}

                {/* ── TEXT ONLY ───────────────────────────────────── */}
                {type === "text" && (
                    <p className="text-sm leading-relaxed wrap-break-words">{content}</p>
                )}

                {/* Time + status — shown for every type */}
                <div className={cn(
                    "flex items-center gap-1 mt-1",
                    isMine ? "justify-end" : "justify-start",
                    type !== "text" && "px-3 pb-2"
                )}>
                    <span className={cn(
                        "text-[10px]",
                        isMine ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                        {time}
                    </span>
                    {isMine && status && statusIcon(status)}
                </div>

            </div>
        </div>
    )
}

export default MessageItem