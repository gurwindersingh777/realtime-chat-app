import "dotenv/config"
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents } from "../../shared/types"
import cors from "cors"
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth.routes";

const app = express()
const httpServer = createServer(app)

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
})

app.use(clerkMiddleware())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))
app.use('/api/auth', authRouter)

io.on("connection", (socket) => {
  console.log('Socket connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id)
  })
})


const PORT = process.env.PORT || 5000

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})