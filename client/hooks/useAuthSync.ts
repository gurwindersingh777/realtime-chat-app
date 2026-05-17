import { useAuth } from "@clerk/nextjs"
import { useEffect } from "react"


export const useAuthSync = () => {
  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    const sync = async () => {
      const token = await getToken()

      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    }
    sync()
  }, [isSignedIn])
}