import ChatWindow from "@/components/chat/ChatWindow"

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatWindow conversationId={params.id} />
}