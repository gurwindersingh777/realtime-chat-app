declare global {
  namespace Express {
    interface Request {
      userId?: string
      auth?: {
        userId?: string
      }
    }
  }
}

export { }