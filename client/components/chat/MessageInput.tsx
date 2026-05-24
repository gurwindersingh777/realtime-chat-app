import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSocketStore } from '@/store/socket.store'
import {  SendHorizontal } from 'lucide-react'

export default function MessageInput({ conversationId }: { conversationId: string }) {
  const [content, setContent] = useState('')
  const socket = useSocketStore((s) => s.socket)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)

  const handleTyping = () => {
    if (!socket) return

    if (!isTypingRef.current) {
      isTypingRef.current = true
      socket.emit('typing-start', conversationId)
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
      socket.emit('typing-stop', conversationId)
    }, 2000)
  }

  const handleSend = () => {
    if (!socket || !content.trim()) return
    socket.emit('send-message', {
      conversationId,
      content: content.trim(),
      type: 'text',
    })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    isTypingRef.current = false
    socket.emit('typing-stop', conversationId)

    setContent('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [])

  return (
    <div className="p-4 border-t border-neutral-600 shrink-0">
      <div className="flex gap-2 items-center">
        <Input
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            handleTyping()
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 border-2 border-neutral-400 py-4 pb-5 focus:ring-neutral-700"
        />
        <Button
          onClick={handleSend}
          disabled={!content.trim()}
          size="icon"
          className='bg-neutral-700 p-5'
        >
          <SendHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}