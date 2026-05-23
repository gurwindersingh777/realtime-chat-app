import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared/types";
import { create } from "zustand";

interface SocketStore {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  isConnected: boolean
  onlineUsers: string[]
  setSocket: (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => void
  setConnected: (val: boolean) => void
  setOnlineUsers: (users: string[]) => void
  addOnlineUser: (clerkId: string) => void
  removeOnlineUser: (clerkId: string) => void
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  setSocket: (socket) => set({ socket }),
  setConnected: (val) => set({ isConnected: val }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addOnlineUser: (clerkId) => set((state) => ({
    onlineUsers: state.onlineUsers.includes(clerkId) ? state.onlineUsers : [...state.onlineUsers, clerkId]
  })),
  removeOnlineUser: (clerkId) => set((state) => ({
    onlineUsers: state.onlineUsers.filter((id) => id !== clerkId)
  }))
}))