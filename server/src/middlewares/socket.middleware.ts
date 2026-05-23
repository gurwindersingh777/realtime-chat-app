import { verifyToken } from "@clerk/express";
import { Socket } from "socket.io";

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('No token provided'))
    }

    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY })
    socket.data.userId = payload.sub
    socket.data.clerkId = payload.sub
    next()
  } catch (error) {
    next(new Error('Invalid token'))
  }
}