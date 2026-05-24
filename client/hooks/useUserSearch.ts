import { useApi } from "@/lib/axios"
import { useDebounce } from "./useDebounce"
import { useQuery } from "@tanstack/react-query"
import { User } from "../../shared/types"


export const useUserSearch = (query: string) => {
  const api = useApi()
  const debouncedQuery = useDebounce(query, 400)

  return useQuery({
    queryKey: ['users', 'search', debouncedQuery],
    queryFn: async () => {
      const { data } = await api.get<{ users: User[] }>(`/api/users/search?q=${debouncedQuery}`)
      return data.users
    },
    enabled: debouncedQuery.length >= 2
  })
}