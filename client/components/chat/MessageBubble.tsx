import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Message } from '../../../shared/types'

interface Props {
  message: Message
  isOwn: boolean
  showAvatar: boolean
}

export default function MessageBubble({ message, isOwn, showAvatar }: Props) {
  return (

    <div className={`flex gap-2 items-end ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      
      <div className="w-7 shrink-0">
        {showAvatar && !isOwn && (
          <Avatar className="w-7 h-7">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback className="text-xs">
              {message.sender.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className={`flex flex-col gap-1 max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className={`px-3 py-2 rounded-2xl text-sm wrap-break-word ${
          isOwn
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-neutral-700 text-neutral-100 rounded-bl-sm'
        }`}>
          {message.content}
        </div>
        <span className="text-[10px] text-muted-foreground px-1">
          {format(new Date(message.createdAt), 'HH:mm')}
        </span>
      </div>
    </div>
  )
}