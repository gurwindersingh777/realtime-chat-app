import mongoose, { Document, models } from "mongoose"

export interface UserDocument extends Document {
  clerkId: string
  username: string
  email: string
  avatar?: string
  isOnline: boolean
  lastSeen: Date
  createdAt: Date
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export const User = models.User || mongoose.model<UserDocument>('User', UserSchema) 