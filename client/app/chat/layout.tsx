'use client'
import { useAuthSync } from "@/hooks/useAuthSync"
import { useSocket } from "@/hooks/useSocket"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  useAuthSync()
  useSocket() 
  return <>{children}</>
}