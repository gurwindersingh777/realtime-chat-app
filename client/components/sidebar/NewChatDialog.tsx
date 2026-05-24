import { useCreateDM } from "@/hooks/useConversations"
import { useUserSearch } from "@/hooks/useUserSearch"
import { useChatStore } from "@/store/chat.store"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { User } from "../../../shared/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Loader2, Plus, Search } from "lucide-react"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export default function NewChatDialog() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const { data: users, isLoading } = useUserSearch(searchQuery)
  const createDM = useCreateDM()
  const setActiveConversation = useChatStore((s) => s.setActiveConversation)

  const handleSelectUser = async (user: User) => {
    const conversation = await createDM.mutateAsync(user._id)
    setActiveConversation(conversation)
    router.push(`/chat/${conversation._id}`)
    setOpen(false)
    setSearchQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"  className="hover:bg-neutral-700 rounded-full" >
          <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-neutral-800 text-neutral-200 border border-neutral-800">
        <DialogHeader>
          <DialogTitle>New conversation</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 pb-1.5 text-neutral-200 border focus:ring-neutral-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1">
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {users?.length === 0 && searchQuery.length >= 2 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              No users found
            </p>
          )}

          {users?.map((user) => (
            <button
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar className="w-9 h-9">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
