// components/chat/MessageInput.tsx
"use client"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Send, Paperclip, Smile, X,
    ImageIcon, FileText, Film, Music, File
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ReplyTo {
    messageId: string
    content: string
    senderName: string
}

interface SelectedFile {
    file: File
    previewUrl: string | null   // only images/videos get a preview URL
    type: "image" | "video" | "document" | "audio"
}

interface Props {
    onSendMessage: (content: string, files?: SelectedFile[], replyToId?: string) => void
    replyTo?: ReplyTo | null
    onCancelReply?: () => void
}

// derive the file category from mime type
const getFileType = (file: File): SelectedFile["type"] => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    if (file.type.startsWith("audio/")) return "audio"
    return "document"
}

const getFileIcon = (type: SelectedFile["type"]) => {
    switch (type) {
        case "image": return <ImageIcon className="w-5 h-5 text-blue-400" />
        case "video": return <Film className="w-5 h-5 text-purple-400" />
        case "audio": return <Music className="w-5 h-5 text-green-400" />
        case "document": return <FileText className="w-5 h-5 text-orange-400" />
        default: return <File className="w-5 h-5 text-muted-foreground" />
    }
}

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// accepted mime types
const ACCEPTED_TYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "video/mp4", "video/quicktime",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "audio/mpeg", "audio/wav",
].join(",")

const MessageInput = ({ onSendMessage, replyTo, onCancelReply }: Props) => {
    const [message, setMessage] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
    const [showAttachMenu, setShowAttachMenu] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? [])
        if (!files.length) return

        const newFiles: SelectedFile[] = files.map(file => {
            const type = getFileType(file)
            const previewUrl = (type === "image" || type === "video")
                ? URL.createObjectURL(file)
                : null
            return { file, previewUrl, type }
        })

        setSelectedFiles(prev => [...prev, ...newFiles])
        setShowAttachMenu(false)
        // reset input so same file can be selected again
        e.target.value = ""
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => {
            const updated = [...prev]
            // revoke object URL to free memory
            if (updated[index].previewUrl) {
                URL.revokeObjectURL(updated[index].previewUrl!)
            }
            updated.splice(index, 1)
            return updated
        })
    }

    const handleSend = () => {
        if (!message.trim() && selectedFiles.length === 0) return
        onSendMessage(message.trim(), selectedFiles, replyTo?.messageId)
        setMessage("")
        setSelectedFiles([])
        inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const canSend = message.trim().length > 0 || selectedFiles.length > 0

    return (
        <div className="shrink-0 border-t border-border bg-card">

            {/* Reply preview */}
            {replyTo && (
                <div className="flex items-center gap-3 px-4 py-2 bg-secondary border-b border-border">
                    <div className="w-1 h-8 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-primary">{replyTo.senderName}</p>
                        <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="w-6 h-6 shrink-0" onClick={onCancelReply}>
                        <X className="w-3.5 h-3.5" />
                    </Button>
                </div>
            )}

            {/* File preview strip — shows selected files before sending */}
            {selectedFiles.length > 0 && (
                <div className="flex items-end gap-2 px-4 py-3 border-b border-border overflow-x-auto">
                    {selectedFiles.map((sf, i) => (
                        <div key={i} className="relative shrink-0 group">

                            {/* image preview */}
                            {sf.type === "image" && sf.previewUrl && (
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                                    <Image
                                        src={sf.previewUrl}
                                        alt={sf.file.name}
                                        width={80} height={80}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* video preview */}
                            {sf.type === "video" && sf.previewUrl && (
                                <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center">
                                    <video src={sf.previewUrl} className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* document / audio — no visual preview, show icon + name */}
                            {(sf.type === "document" || sf.type === "audio") && (
                                <div className="w-40 h-16 rounded-lg border border-border bg-secondary flex items-center gap-2 px-3">
                                    {getFileIcon(sf.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-foreground truncate font-medium">{sf.file.name}</p>
                                        <p className="text-xs text-muted-foreground">{formatFileSize(sf.file.size)}</p>
                                    </div>
                                </div>
                            )}

                            {/* remove button */}
                            <button
                                onClick={() => removeFile(i)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>

                        </div>
                    ))}
                </div>
            )}

            {/* Input bar */}
            <div className="flex items-center gap-2 px-4 py-3 relative">

                {/* Attachment button + dropdown */}
                <div className="relative shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setShowAttachMenu(p => !p)}
                    >
                        <Paperclip className="w-5 h-5" />
                    </Button>

                    {/* Attach menu */}
                    {showAttachMenu && (
                        <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 w-44">
                            {[
                                { label: "Image / GIF", accept: "image/*", icon: <ImageIcon className="w-4 h-4 text-blue-400" /> },
                                { label: "Video", accept: "video/*", icon: <Film className="w-4 h-4 text-purple-400" /> },
                                { label: "Document", accept: ".pdf,.docx,.xlsx", icon: <FileText className="w-4 h-4 text-orange-400" /> },
                                { label: "Audio", accept: "audio/*", icon: <Music className="w-4 h-4 text-green-400" /> },
                            ].map(item => (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.accept = item.accept
                                            fileInputRef.current.click()
                                        }
                                        setShowAttachMenu(false)
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_TYPES}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Text input */}
                <div className="flex-1 relative">
                    <Input
                        ref={inputRef}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary pr-10"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 text-muted-foreground hover:text-foreground"
                    >
                        <Smile className="w-4 h-4" />
                    </Button>
                </div>

                {/* Send button */}
                <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!canSend}
                    className={cn(
                        "shrink-0 transition-all",
                        canSend
                            ? "bg-primary hover:bg-primary/90"
                            : "bg-secondary text-muted-foreground cursor-not-allowed"
                    )}
                >
                    <Send className="w-4 h-4" />
                </Button>

            </div>
        </div>
    )
}

export default MessageInput