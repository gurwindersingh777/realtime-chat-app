'use client'
import ChatHeader from "@/components/chat/ChatHeader"
import MessageInput from "@/components/chat/MessageInput"
import MessageList from "@/components/chat/MessageList"
import { useMessages } from "@/hooks/useMessages"
import { useSocketStore } from "@/store/socket.store"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params.conversationId as string
  const socket = useSocketStore((s) => s.socket)
  const isConnected = useSocketStore((s) => s.isConnected)
  
  useMessages(conversationId) 

  useEffect(() => {
    if (!socket || !conversationId || !isConnected) return
    socket.emit('join-conversation', conversationId)
    return () => {
      socket.emit('leave-conversation', conversationId)
    }
  }, [socket, conversationId, isConnected])

  return (
    <div className="flex flex-col h-full">
      <ChatHeader conversationId={conversationId} />
      <MessageList conversationId={conversationId} />
      <MessageInput conversationId={conversationId} />
    </div>
  )
}