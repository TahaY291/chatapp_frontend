import { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"
import { FileText } from "lucide-react"
import { useRagStore } from "@/store/rag.store"

const RagChat = () => {
    const { messages, streaming, streamingMessage, currentFile } = useRagStore()
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, streamingMessage])

    if (!currentFile) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <FileText className="w-10 h-10" />
                    <p className="text-sm">Upload a PDF to start asking questions</p>
                </div>
            </div>
        )
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    Ask your first question about {currentFile.originalName}
                </p>
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto px-4">
            {messages.map((msg, i) => (
                <MessageBubble
                    key={msg.id}
                    question={msg.question}
                    answer={msg.answer}
                    isStreaming={streaming && i === messages.length - 1}
                    streamingMessage={streamingMessage}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    )
}

export default RagChat