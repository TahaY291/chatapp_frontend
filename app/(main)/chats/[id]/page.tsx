import ChatWindow from "@/components/chat/ChatWindow"

export default async function ChatPage({ params }: { params: { id: string } }) {
    const {id} = await params
    return <ChatWindow conversationId={id} />
}