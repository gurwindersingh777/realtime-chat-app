'use client'
import Sidebar from "@/components/sidebar/Sidebar"
import { useAuthSync } from "@/hooks/useAuthSync"
import { useSocket } from "@/hooks/useSocket"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  useAuthSync()
  useSocket()

  return <div className="flex h-screen bg-background overflow-hidden">
    <Sidebar />
    <main className="flex-1 flex flex-col overflow-hidden bg-neutral-800 text-neutral-200">
      {children}
    </main>
  </div>
}