import { useApi } from "@/lib/axios"
import { useChatStore } from "@/store/chat.store"
import { useQuery } from "@tanstack/react-query"
import { Message } from "../../shared/types"
import { useEffect } from "react"

export const useMessages = (conversationId: string | undefined) => {
  const api = useApi()
  const setMessages = useChatStore((state) => state.setMessages)

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data } = await api.get<{ messages: Message[] }>(`/api/messages/${conversationId}`)
      return data.messages
    }
  })

  useEffect(() => {
    if (query.data) setMessages(query.data)
  }, [query.data])

  return query
}

