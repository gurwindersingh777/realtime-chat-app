
const onlineUsers = new Map<string, string>()

export const addOnlineUser = (clerkId: string, socketId: string) => {
  onlineUsers.set(clerkId, socketId)
}

export const removeOnlineUser = (clerkId: string) => {
  onlineUsers.delete(clerkId)
}

export const isUserOnline = (clerkId: string): boolean => {
  return onlineUsers.has(clerkId)
}

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers.keys())
}

export const getSocketId = (clerkId: string): string | undefined => {
  return onlineUsers.get(clerkId)
}