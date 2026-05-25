'use client'
import ChatHeader from "@/components/chat/ChatHeader"
import MessageInput from "@/components/chat/MessageInput"
import MessageList from "@/components/chat/MessageList"
import { useMessages } from "@/hooks/useMessages"
import { useApi } from "@/lib/axios"
import { useSocketStore } from "@/store/socket.store"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params.conversationId as string
  const socket = useSocketStore((s) => s.socket)
  const isConnected = useSocketStore((s) => s.isConnected)
  const queryClient = useQueryClient()
  const api = useApi()
  
  useMessages(conversationId)

  useEffect(() => {
    if (!socket || !conversationId || !isConnected) return

    socket.emit('join-conversation', conversationId)

    const markSeen = async () => {
      try {
        await api.post(`/api/messages/seen/${conversationId}`)
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      } catch (error) {
        console.error('Mark seen error:', error)
      }
    }

    markSeen()

    return () => { socket.emit('leave-conversation', conversationId) }
  }, [socket, conversationId, isConnected])

  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversationId={conversationId} />
      <MessageList conversationId={conversationId} />
      <MessageInput conversationId={conversationId} />
    </div>
  )
}