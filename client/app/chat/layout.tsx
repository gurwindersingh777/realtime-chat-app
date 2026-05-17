'use client'
import { useAuthSync } from "@/hooks/useAuthSync"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  useAuthSync()
  return <>{children}</>
}