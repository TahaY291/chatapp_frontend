import { Loader2 } from "lucide-react"

interface Props {
    question: string
    answer: string | null
    isStreaming?: boolean
    streamingMessage?: string
}

const MessageBubble = ({ question, answer, isStreaming, streamingMessage }: Props) => {
    return (
        <div className="flex flex-col gap-3 py-4 border-b border-border last:border-none">
            {/* User question */}
            <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-2xl rounded-tr-sm max-w-[75%]">
                    {question}
                </div>
            </div>

            {/* LLM answer */}
            <div className="flex justify-start">
                <div className="bg-muted text-foreground text-sm px-4 py-2 rounded-2xl rounded-tl-sm max-w-[75%]">
                    {isStreaming ? (
                        <span>
                            {streamingMessage}
                            <Loader2 className="inline ml-1 w-3 h-3 animate-spin" />
                        </span>
                    ) : (
                        answer ?? <Loader2 className="w-3 h-3 animate-spin" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble