import { Router, Request, Response } from 'express'
import { protect } from '../middlewares/auth.middleware'
import { Message } from '../models/message.model'
import { Conversation } from '../models/conversation.model'
import { User } from '../models/user.model'

const messageRouter = Router()

messageRouter.use(protect)

messageRouter.get('/:conversationId', async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = 30
    const skip = (page - 1) * limit

    const currentUser = await User.findOne({ clerkId: req.userId })
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const conversation = await Conversation.findOne({ _id: conversationId, participants: currentUser._id, })
    if (!conversation) {
      return res.status(403).json({ message: 'Not a participant' })
    }

    const messages = await Message.find({ conversationId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({ messages: messages.reverse(), page, limit })
  } catch (error) {
    console.error('Get messages error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

messageRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { conversationId, content, type = 'text' } = req.body

    const currentUser = await User.findOne({ clerkId: req.userId })
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const conversation = await Conversation.findOne({ _id: conversationId, participants: currentUser._id, })
    if (!conversation) {
      return res.status(403).json({ message: 'Not a participant' })   
    }

    const message = await Message.create({
      conversationId,
      sender: currentUser._id,
      content,
      type,
      status: 'sent',
    })

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
    })

    const populated = await message.populate('sender', 'username avatar')

    res.status(201).json({ message: populated })
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default messageRouter