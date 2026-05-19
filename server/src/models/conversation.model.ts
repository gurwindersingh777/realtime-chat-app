import mongoose, { Document } from "mongoose";


export interface ConversationDocument extends Document {
  participants: mongoose.Types.ObjectId[]
  isGroup: boolean
  groupName?: string
  groupAvatar?: string
  admin?: mongoose.Types.ObjectId
  lastMessage?: mongoose.Types.ObjectId
  lastMessageAt: Date
}

const ConversationSchema = new mongoose.Schema<ConversationDocument>({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  isGroup: {
    type: Boolean,
    default: false,
  },
  groupName: {
    type: String,
    trim: true,
  },
  groupAvatar: {
    type: String,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,                   
  },
}, { timestamps: true })

export const Conversation = mongoose.model<ConversationDocument>('Conversation', ConversationSchema)