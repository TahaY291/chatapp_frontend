'use client'

import { useEffect } from "react"
import FileUpload from "@/components/rag/FileUpload"
import RagChat from "@/components/rag/RagChat"
import RagInput from "@/components/rag/RagInput"
import { useRagStore } from "@/store/rag.store"

const RagPage = () => {
    const { fetchMessages } = useRagStore()

    useEffect(() => {
          fetchMessages()
    }, [])

    return (
        <div className="flex flex-col h-full bg-background">
            <FileUpload />
            <RagChat />
            <RagInput />
        </div>
    )
}

export default RagPage