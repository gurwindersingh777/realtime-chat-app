import express from "express";
import "dotenv/config"
import { createServer } from "http";
import { Server } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents } from "../../shared/types"
import cors from "cors"
import mongoose from "mongoose";

const app = express()
const httpServer = createServer(app)

export const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
})

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err))

io.on("connection", (socket) => {
  console.log('Socket connected:', socket.id)
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});