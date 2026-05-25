import { useChatStore } from '@/store/chat.store'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function MessageList({ conversationId }: { conversationId: string }) {
  const messages = useChatStore((s) => s.messages)
  const typingUsers = useChatStore((s) => s.typingUsers)
  const { user } = useUser()
  const bottomRef = useRef<HTMLDivElement>(null)

  const typingInThisConversation = typingUsers[conversationId] || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingInThisConversation])


  return (
    <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-1">
      {messages.map((message, index) => {
        const isOwn = message.sender.clerkId === user?.id
        const prevMessage = messages[index - 1]
        const showAvatar = !isOwn && message.sender._id !== prevMessage?.sender._id

        return (
          <MessageBubble
            key={message._id}
            message={message}
            isOwn={isOwn}
            showAvatar={showAvatar}
          />
        )
      })}

      {typingInThisConversation.length > 0 && (
        <TypingIndicator conversationId={conversationId} />
      )}

      <div ref={bottomRef} />
    </div>
  )
}
