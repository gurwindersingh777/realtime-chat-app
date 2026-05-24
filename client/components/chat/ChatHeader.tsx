'use client'
import { useChatStore } from "@/store/chat.store"
import { useSocketStore } from "@/store/socket.store"
import { useAuth } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { format } from 'date-fns'
import { useConversation } from "@/hooks/useConversations"
import { useEffect } from "react"

export default function ChatHeader({ conversationId }: { conversationId: string }) {
  const { userId } = useAuth()
  const activeConversation = useChatStore((s) => s.activeConversation)
  const setActiveConversation = useChatStore((s) => s.setActiveConversation)
  const onlineUsers = useSocketStore((s) => s.onlineUsers)

  const { data: fetchedConversation } = useConversation(
    !activeConversation ? conversationId : ''
  )

  useEffect(() => {
    if (fetchedConversation && !activeConversation) {
      setActiveConversation(fetchedConversation)
    }
  }, [fetchedConversation])

  const conversation = activeConversation || fetchedConversation

  if (!conversation) return (
    <div className="h-16 border-b border-neutral-600 px-4 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      <div className="space-y-1">
        <div className="w-24 h-3 bg-muted animate-pulse rounded" />
        <div className="w-16 h-2 bg-muted animate-pulse rounded" />
      </div>
    </div>
  )

  const otherParticipant = conversation.isGroup
    ? null
    : conversation.participants.find((p) => p.clerkId !== userId)

  const isOnline = otherParticipant
    ? onlineUsers.includes(otherParticipant.clerkId)
    : false

  const displayName = conversation.isGroup
    ? conversation.groupName
    : otherParticipant?.username

  const avatar = conversation.isGroup
    ? conversation.groupAvatar
    : otherParticipant?.avatar

  return (
    <div className="h-16 border-b border-neutral-600 px-4 flex items-center gap-3 shrink-0">
      <div className="relative">
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatar} />
          <AvatarFallback>{displayName?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>
      <div>
        <p className="font-medium text-sm">{displayName}</p>
        <p className="text-xs text-muted-foreground">
          {isOnline ? 'Online' : otherParticipant?.lastSeen
            ? `Last seen ${format(new Date(otherParticipant.lastSeen), 'HH:mm')}`
            : 'Offline'}
        </p>
      </div>
    </div>
  )
}