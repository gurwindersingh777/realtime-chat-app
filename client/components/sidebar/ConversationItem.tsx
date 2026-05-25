import { useParams, useRouter } from "next/navigation"
import { Conversation } from "../../../shared/types"
import { useAuth } from "@clerk/nextjs"
import { useSocketStore } from "@/store/socket.store"
import { useChatStore } from "@/store/chat.store"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useQueryClient } from "@tanstack/react-query"

interface Props {
  conversation: Conversation
}

export default function ConversationItem({ conversation }: Props) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const params = useParams()
  const { userId } = useAuth()
  const onlineUsers = useSocketStore((s) => s.onlineUsers)
  const setActiveConversation = useChatStore((s) => s.setActiveConversation)

  const isActive = params.conversationId === conversation._id

  const otherParticipant = conversation.isGroup ? null
    : conversation.participants.find((p) => p.clerkId !== userId)

  const isOnline = otherParticipant ? onlineUsers.includes(otherParticipant.clerkId) : false

  const displayName = conversation.isGroup ? conversation.groupName : otherParticipant?.username

  const avatar = conversation.isGroup ? conversation.groupAvatar : otherParticipant?.avatar

  const handleClick = () => {
    queryClient.invalidateQueries({ queryKey: ['messages', conversation._id] })
    setActiveConversation(conversation)
    router.push(`/chat/${conversation._id}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left mb-2',
        isActive
          ? 'bg-neutral-900 text-white'
          : 'hover:bg-neutral-900/60'
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="w-7 h-7">
          <AvatarImage src={avatar} />
          <AvatarFallback>{displayName?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="font-medium text-xs truncate">{displayName}</span>
          {conversation.lastMessage && (
            <span className="text-[11px] text-muted-foreground shrink-0 ml-1">
              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs font-light text-muted-foreground truncate flex-1">
            {conversation.lastMessage?.content || 'No messages yet'}
          </p>
        
          {conversation.unreadCount > 0 && (
            <span className="ml-2 min-w-4.5 h-4.5 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center px-1 shrink-0">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
