import { useRef } from "react"
import { Paperclip, Trash2, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadFile, deleteFile } from "@/api/rag"
import { useRagStore } from "@/store/rag.store"

const FileUpload = () => {
    const { currentFile, setCurrentFile, clearAll } = useRagStore()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setCurrentFile({ id: '', originalName: file.name, status: 'processing' })

        try {
            const data = await uploadFile(file)
            setCurrentFile({ id: data.id, originalName: data.originalName, status: 'ready' })
        } catch (err) {
            setCurrentFile(null)
        }
    }

    const handleDelete = async () => {
        if (!currentFile) return
        try {
            await deleteFile(currentFile.id)
            clearAll()
        } catch (err) {
            console.error(err)
        }
    }

    if (currentFile) {
        return (
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground font-medium">
                        {currentFile.originalName}
                    </span>
                    {currentFile.status === 'processing' && (
                        <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                    )}
                    {currentFile.status === 'ready' && (
                        <span className="text-xs text-green-500">ready</span>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="text-destructive hover:text-destructive"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center px-4 py-6 border-b border-border bg-card">
            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleUpload}
            />
            <Button
                variant="outline"
                className="gap-2"
                onClick={() => inputRef.current?.click()}
            >
                <Paperclip className="w-4 h-4" />
                Upload PDF to start chatting
            </Button>
        </div>
    )
}

export default FileUpload