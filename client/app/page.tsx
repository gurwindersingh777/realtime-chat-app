'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function RootPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn) {
      router.replace('/chat')
    } else {
      router.replace('/sign-in')
    }
  }, [isLoaded, isSignedIn])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}