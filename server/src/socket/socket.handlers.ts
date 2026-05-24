import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../../shared/types";
import { addOnlineUser, getOnlineUsers, removeOnlineUser } from "./online.store";
import { User } from "../models/user.model";
import { Conversation } from "../models/conversation.model";
import { Message } from "../models/message.model";

export const registerSocketHandlers = (
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  const clerkId = socket.data.clerkId

  // CONNECT
  const handleConnect = async () => {
    try {
      addOnlineUser(clerkId, socket.id)

      await User.findOneAndUpdate(
        { clerkId },
        { isOnline: true, lastSeen: new Date() }
      )

      io.emit('user-online', clerkId)
      socket.emit('online-users', getOnlineUsers())
    } catch (error) {
      console.error('Connect handler error:', error)
    }
  }

  //  JOIN CONVERSATION
  const handleJoinConversation = async (conversationId: string) => {
    try {
      const currentUser = await User.findOne({ clerkId })
      const conversation = await Conversation.findOne({ _id: conversationId, participants: currentUser._id })
      if (!conversation) {
        socket.emit('error', "Not a participant of this conversation")
        return
      }
      socket.join(conversationId)
    } catch (error) {
      console.error('Join conversation error:', error)
    }
  }

  // LEAVE CONVERSATION
  const handleLeaveConversation = async (conversationId: string) => {
    socket.leave(conversationId)
    console.log(`${clerkId} left room ${conversationId}`)
  }

  // SEND MESSAGE
  const handleSendMessage = async (data: {
    conversationId: string
    content: string
    type?: 'text' | 'image' | 'file'
  }) => {
    try {
      const { conversationId, content, type = 'text' } = data

      const currentUser = await User.findOne({ clerkId })
      if (!currentUser) return

      const conversation = await Conversation.findOne({ _id: conversationId, participants: currentUser._id })
      if (!conversation) return

      const message = await Message.create({
        conversationId,
        sender: currentUser._id,
        content,
        type,
        status: 'sent'
      })

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        lastMessageAt: new Date(),
      })

      const populated = await message.populate('sender', 'username avatar clerkId')
      
      io.to(conversationId).emit('receive-message', populated.toObject() as any)
    } catch (error) {
      console.error('Send message error:', error)
    }
  }

  // TYPING 
  const handleTypingStart = async (conversationId: string) => {
    socket.to(conversationId).emit('typing-start', { userId: clerkId, conversationId })
  }

  const handleTypingStop = async (conversationId: string) => {
    socket.to(conversationId).emit('typing-stop', { userId: clerkId, conversationId })
  }

  // MARK SEEN
  const handleMarkSeen = async (messageId: string) => {
    try {
      const currentUser = await User.findOne({ clerkId })
      if (!currentUser) return

      const message = await Message.findByIdAndUpdate(messageId,
        {
          status: 'seen',
          $addToSet: { seenBy: currentUser._id },
        },
        { returnDocument: 'before' }
      )

      if (!message) return

      io.to(message.conversationId.toString()).emit('message-seen', messageId)
    } catch (error) {
      console.error('Mark seen error:', error)
    }
  }

  // DISCONNECT 
  const handleDisconnect = async () => {
    try {
      removeOnlineUser(clerkId)

      await User.findOneAndUpdate({ clerkId }, { isOnline: false, lastSeen: new Date() })

      io.emit('user-offline', clerkId)
    } catch (error) {
      console.error('Disconnect handler error:', error)
    }
  }

  handleConnect()

  socket.on('join-conversation', handleJoinConversation)
  socket.on('leave-conversation', handleLeaveConversation)
  socket.on('send-message', handleSendMessage)
  socket.on('typing-start', handleTypingStart)
  socket.on('typing-stop', handleTypingStop)
  socket.on('mark-seen', handleMarkSeen)
  socket.on('disconnect', handleDisconnect)
}
