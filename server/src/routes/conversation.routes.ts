import { Response, Request, Router } from "express"
import { protect } from "../middlewares/auth.middleware"
import { User } from "../models/user.model"
import { Conversation } from "../models/conversation.model"
import { Message } from "../models/message.model"

const conversationRouter = Router()

conversationRouter.use(protect)

conversationRouter.get('/', async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ clerkId: req.userId })
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const conversations = await Conversation.find({ participants: currentUser._id })
      .populate('participants', 'username email avatar isOnline lastSeen  clerkId')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 })

    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          sender: { $ne: currentUser._id },
          status: { $ne: 'seen' },
        })
        return { ...conv.toObject(), unreadCount }
      })
    )

    res.json({ conversations: conversationsWithUnread })
  } catch (error) {
    console.error('Get conversations error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

conversationRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ clerkId: req.userId })

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: currentUser?._id,
    })
      .populate('participants', 'username email avatar isOnline lastSeen clerkId')
      .populate('lastMessage')

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' })
      return
    }

    res.json({ conversation })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

conversationRouter.post('/dm', async (req: Request, res: Response) => {
  try {
    const { targetUserId } = req.body

    const currentUser = await User.findOne({ clerkId: req.userId })
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const existingConversation = await Conversation.findOne(
      { isGroup: false, participants: { $all: [currentUser._id, targetUserId] } })
      .populate('participants', 'username email avatar isOnline lastSeen  clerkId')
      .populate('lastMessage')

    if (existingConversation) {
      return res.json({ conversation: existingConversation })
    }

    const conversation = await Conversation.create({
      participants: [currentUser._id, targetUserId],
      isGroup: false,
    })

    const populated = await conversation.populate(
      'participants',
      'username email avatar isOnline lastSeen'
    )

    res.status(201).json({ conversation: populated })

  } catch (error) {
    console.error('Create DM error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

conversationRouter.post('/group', async (req: Request, res: Response) => {
  try {
    const { participantIds, groupName } = req.body

    if (!groupName?.trim()) {
      return res.status(400).json({ message: 'Group name is required' })
    }

    if (!participantIds || participantIds.length < 2) {
      return res.status(400).json({ message: 'Group needs at least 2 other members' })
    }

    const currentUser = await User.findOne({ clerkId: req.userId })
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const conversation = await Conversation.create({
      participants: [currentUser._id, ...participantIds],
      isGroup: true,
      groupName: groupName.trim(),
      admin: currentUser._id
    })

    const populated = await conversation.populate('participants', 'username email avatar isOnline lastSeen  clerkId')

    res.status(201).json({ conversation: populated })
  } catch (error) {
    console.error('Create group error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default conversationRouter