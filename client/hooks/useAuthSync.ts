'use client'
import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"

export const useAuthSync = () => {
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    if (!isSignedIn) return

    const sync = async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/sync`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        const data = await res.json()

      } catch (error) {
        console.error(error)
      }
    }

    sync()
  }, [isSignedIn, getToken])
}