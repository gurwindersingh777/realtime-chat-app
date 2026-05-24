import { getSocket } from "@/lib/socket"
import { useChatStore } from "@/store/chat.store"
import { useSocketStore } from "@/store/socket.store"
import { useAuth } from "@clerk/nextjs"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export const useSocket = () => {
  const { getToken, isSignedIn } = useAuth()
  const { setSocket, setConnected, setOnlineUsers, addOnlineUser, removeOnlineUser } = useSocketStore()
  const { addMessage, addTypingUser, removeTypingUser } = useChatStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isSignedIn) return

    const initSocket = async () => {
      const token = await getToken()
      const socket = getSocket()

      socket.auth = { token }

      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off('online-users')
      socket.off('user-online')
      socket.off('user-offline')
      socket.off('receive-message')
      socket.off('typing-start')
      socket.off('typing-stop')

      if (!socket.connected) {
        socket.connect()
      }

      socket.on('connect', () => {
        console.log('Socket connected')
        setSocket(socket)
        setConnected(true)
      })
      socket.on('connect_error', (error) => {
        console.error('Socket connect_error:', error.message)
      })
      socket.on('disconnect', () => {
        console.log('Socket disconnected')
        setConnected(false)
      })

      socket.on('online-users', (users) => setOnlineUsers(users))
      socket.on('user-online', (clerkId) => addOnlineUser(clerkId))
      socket.on('user-offline', (clerkId) => removeOnlineUser(clerkId))

      socket.on('receive-message', (message) => {
        addMessage(message)
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      })

      socket.on('typing-start', ({ userId, conversationId }) => {
        addTypingUser(conversationId, userId)
      })

      socket.on('typing-stop', ({ userId, conversationId }) => {
        removeTypingUser(conversationId, userId)
      })
    }

    initSocket()

    return () => {
      const socket = getSocket()
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off('online-users')
      socket.off('user-online')
      socket.off('user-offline')
      socket.off('receive-message')
      socket.off('typing-start')
      socket.off('typing-stop')
    }
  }, [isSignedIn])
}