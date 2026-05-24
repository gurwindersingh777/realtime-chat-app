import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useMemo } from "react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true
})

export const useApi = () => {
  const { getToken } = useAuth()

  const instance = useMemo(() => {
    const client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
      withCredentials: true
    })

    client.interceptors.response.use(async (config) => {
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    return client
  }, [getToken])

  return instance
}