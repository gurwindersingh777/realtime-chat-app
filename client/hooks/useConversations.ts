import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/lib/axios'
import { Conversation } from '../../shared/types/index'

export const useConversations = () => {
  const api = useApi()

  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await api.get<{ conversations: Conversation[] }>('/api/conversations')
      return data.conversations
    },
  })
}

export const useCreateDM = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data } = await api.post<{ conversation: Conversation }>('/api/conversations/dm', { targetUserId })
      return data.conversation
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  })
}