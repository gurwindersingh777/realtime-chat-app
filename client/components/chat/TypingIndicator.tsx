'use client'
import { useChatStore } from '@/store/chat.store'

export default function TypingIndicator({ conversationId }: { conversationId: string }) {
  const typingUsers = useChatStore((s) => s.typingUsers)
  const typing = typingUsers[conversationId] || []

  if (typing.length === 0) return null

  return (
    <div className="flex items-center gap-2 px-3 py-1">
      <div className="flex gap-1 items-center bg-muted px-3 py-2 rounded-2xl rounded-bl-sm">
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-muted-foreground">typing...</span>
    </div>
  )
}