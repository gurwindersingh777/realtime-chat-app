import { Router, Request, Response } from 'express'
import { protect } from '../middlewares/auth.middleware'
import { User } from '../models/user.model'

const userRouter = Router()

userRouter.use(protect)

userRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query

    if (!q || (q as string).trim().length < 2) {
      return res.json({ users: [] })
    }

    const currentUser = await User.findOne({ clerkId: req.userId })
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const users = await User.find({
      _id: { $ne: currentUser._id },
      $or: [{ username: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } },],
    }).select('username email avatar isOnline').limit(10)

    res.json({ users })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default userRouter