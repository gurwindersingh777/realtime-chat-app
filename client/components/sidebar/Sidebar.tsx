'use client'
import { useConversations } from "@/hooks/useConversations"
import { UserButton } from "@clerk/nextjs"
import { MessageSquare } from "lucide-react"
import NewChatDialog from "./NewChatDialog"
import ConversationItem from "./ConversationItem"

export default function Sidebar() {
  const { data: conversations, isLoading } = useConversations()

  return (
    <aside className="w-65 border-r border-neutral-600 flex flex-col bg-background shrink-0 bg-neutral-800 text-neutral-200">

      <div className="h-16 p-4 border-b border-neutral-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h1 className="font-semibold text-lg">Chats</h1>
        </div>
        <div className="flex items-center gap-2">
          <NewChatDialog />
          <UserButton />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted animate-pulse rounded w-24" />
                  <div className="h-3 bg-muted animate-pulse rounded w-36" />
                </div>
              </div>
            ))}
          </div>
        ) :
          conversations?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
              <MessageSquare className="w-8 h-8" />
              <p>No conversations yet</p>
              <p>Start a new chat!</p>
            </div>
          ) : (
            <div className="p-2">
              {conversations?.map((conversation) => (
                <ConversationItem key={conversation._id} conversation={conversation} />
              ))}
            </div>
          )}
      </div>

    </aside>
  )
}
