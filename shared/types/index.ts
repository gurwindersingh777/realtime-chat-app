export interface User {
  _id: string
  clerkId: string
  username: string
  email: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
  createdAt: Date
}

export interface Message {
  _id: string
  conversationId: string
  sender: User
  content: string
  type: 'text' | 'image' | 'file'
  status: 'sent' | 'delivered' | 'seen'
  createdAt: Date
}

export interface Conversation {
  _id: string
  participants: User[]
  isGroup: boolean
  groupName?: string
  groupAvatar?: string
  lastMessage?: Message
  unreadCount?: number
  createdAt: Date
}

export interface ServerToClientEvents {
  'receive-message': (message: Message) => void
  'user-online': (userId: string) => void
  'user-offline': (userId: string) => void
  'typing-start': (data: { userId: string; conversationId: string }) => void
  'typing-stop': (data: { userId: string; conversationId: string }) => void
  'message-delivered': (messageId: string) => void
  'message-seen': (messageId: string) => void
  'online-users': (userIds: string[]) => void
  'error': (message: string) => void
}

export interface ClientToServerEvents {
  'send-message': (data: {
    conversationId: string
    content: string
    type?: 'text' | 'image' | 'file'
  }) => void
  'join-conversation': (conversationId: string) => void
  'leave-conversation': (conversationId: string) => void
  'typing-start': (conversationId: string) => void
  'typing-stop': (conversationId: string) => void
  'mark-seen': (messageId: string) => void
}