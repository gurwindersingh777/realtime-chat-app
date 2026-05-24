import { create } from 'zustand'
import { Conversation, Message } from '../../shared/types/index'

interface ChatStore {
  activeConversation: Conversation | null
  messages: Message[]
  typingUsers: Record<string, string[]>
  setActiveConversation: (conversation: Conversation | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  addTypingUser: (conversationId: string, userId: string) => void
  removeTypingUser: (conversationId: string, userId: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  activeConversation: null,
  messages: [],
  typingUsers: {},
  setActiveConversation: (conversation) => set({ activeConversation: conversation, messages: [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message], })),
  addTypingUser: (conversationId, userId) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [conversationId]: [...(state.typingUsers[conversationId] || []).filter((id) => id !== userId), userId,],
    },
  })),
  removeTypingUser: (conversationId, userId) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [conversationId]: (state.typingUsers[conversationId] || []).filter((id) => id !== userId),
    },
  })),
}))