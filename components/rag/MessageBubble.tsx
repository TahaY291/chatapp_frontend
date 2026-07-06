import { Loader2 } from "lucide-react"

interface Props {
    question: string
    answer: string | null
    isStreaming?: boolean
    streamingMessage?: string
}

const ThreeDots = () => (
    <span className="flex items-center gap-1 py-1">
        <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
        <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
        <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
    </span>
)

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
                            {!streamingMessage && <ThreeDots />}
                        </span>
                    ) : (
                        answer ?? <ThreeDots />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble