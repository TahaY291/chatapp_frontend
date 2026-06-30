import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { askQuestion } from "@/api/rag"
import { useRagStore } from "@/store/rag.store"

const RagInput = () => {
    const [input, setInput] = useState('')
    const { currentFile, streaming, addQuestion } = useRagStore()

    const handleSend = async () => {
        if (!input.trim() || !currentFile || streaming) return
        const question = input.trim()
        setInput('')
        addQuestion(question)
        try {
            await askQuestion(question, currentFile.id)
        } catch (err) {
            console.error(err)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card shrink-0">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                    !currentFile
                        ? "Upload a PDF first..."
                        : currentFile.status === 'processing'
                        ? "Processing file..."
                        : "Ask a question about your PDF..."
                }
                disabled={!currentFile || currentFile.status !== 'ready' || streaming}
                className="flex-1 bg-background"
            />
            <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || !currentFile || currentFile.status !== 'ready' || streaming}
            >
                <Send className="w-4 h-4" />
            </Button>
        </div>
    )
}

export default RagInput