import { Request, Response, NextFunction } from 'express'
import { requireAuth } from '@clerk/express'

export const protect = [
  requireAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    const userId = req.auth?.userId
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }
    req.userId = userId
    next()
  }
]