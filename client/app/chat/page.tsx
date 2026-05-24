import { MessageSquare } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
      <MessageSquare className="w-12 h-12" />
      <p className="text-lg font-medium">Select a conversation</p>
      <p className="text-sm">Choose from your chats or start a new one</p>
    </div>
  )
}