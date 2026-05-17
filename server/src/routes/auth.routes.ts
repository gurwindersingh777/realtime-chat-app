import { Router, Request, Response } from "express";
import { protect } from "../middlewares/auth.middleware";
import { User } from "../models/user.model";
import { clerkClient } from "@clerk/express";


const authRouter = Router()

authRouter.post('/sync', protect, async (req: Request, res: Response) => {
  try {
    const { userId } = req

    const existingUser = await User.findOne({ clerkId: userId })
    if (existingUser) {
      res.json({ user: existingUser })
      return
    }

    const clerkUser = await clerkClient.users.getUser(userId!)
    const email = clerkUser.emailAddresses[0]?.emailAddress
    const username = clerkUser.username || clerkUser.firstName || email?.split('@')[0] || 'User'

    const newUser = await User.create({
      clerkId: userId,
      username,
      email,
      avatar: clerkUser.imageUrl,
      isOnline: true,
      lastSeen: new Date(),
    })

    res.status(201).json({ user: newUser })

  } catch (error) {
    console.error('Sync error:', error)
    res.status(500).json({ message: 'Failed to sync user' })
  }
})

export default authRouter