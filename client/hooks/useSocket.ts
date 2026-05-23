import { getSocket } from "@/lib/socket"
import { useSocketStore } from "@/store/socket.store"
import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"


export const useSocket = () => {
  const { getToken, isSignedIn } = useAuth()

  const { setSocket, setConnected, setOnlineUsers, addOnlineUser, removeOnlineUser } = useSocketStore()

  useEffect(() => {
    if (!isSignedIn) return

    const initSocket = async () => {
      const token = await getToken()
      const socket = getSocket()

      socket.auth = { token }
      socket.connect()
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
    }

    initSocket()

    return () => {
      const socket = getSocket()
      socket.disconnect()
    }
  }, [isSignedIn])
}