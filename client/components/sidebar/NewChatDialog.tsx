import { useCreateDM, useCreateGroup } from "@/hooks/useConversations"
import { useUserSearch } from "@/hooks/useUserSearch"
import { useChatStore } from "@/store/chat.store"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { User } from "../../../shared/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Loader2, MessageSquare, Plus, Search, Users, X } from "lucide-react"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type Mode = 'dm' | 'select' | 'group'

export default function NewChatDialog() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mode, setMode] = useState<Mode>('select')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [groupName, setGroupName] = useState('')
  const router = useRouter()

  const { data: users, isLoading } = useUserSearch(searchQuery)
  const createDM = useCreateDM()
  const createGroup = useCreateGroup()
  const setActiveConversation = useChatStore((s) => s.setActiveConversation)

  const handleClose = () => {
    setOpen(false)
    setMode('select')
    setSearchQuery('')
    setSelectedUsers([])
    setGroupName('')
  }

  const handleSelectUser = async (user: User) => {
    const conversation = await createDM.mutateAsync(user._id)
    setActiveConversation(conversation)
    router.push(`/chat/${conversation._id}`)
    setOpen(false)
    setSearchQuery('')
  }

  const toggleUserForGroup = (user: User) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u._id === user._id) ? prev.filter((u) => u._id !== user._id) : [...prev, user]
    )
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return
    const conversation = await createGroup.mutateAsync({
      participantIds: selectedUsers.map((u) => u._id),
      groupName: groupName.trim(),
    })
    setActiveConversation(conversation)
    router.push(`/chat/${conversation._id}`)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); setOpen(v) }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-neutral-700 text-neutral-200">
        <DialogHeader>
          <DialogTitle>
            {mode === 'select' && 'New conversation'}
            {mode === 'dm' && 'Direct message'}
            {mode === 'group' && 'Create group'}
          </DialogTitle>
        </DialogHeader>

        {mode === 'select' && (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="justify-start gap-3 h-12"
              onClick={() => setMode('dm')}
            >
              <MessageSquare className="w-4 h-4" />
              Direct message
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-3 h-12"
              onClick={() => setMode('group')}
            >
              <Users className="w-4 h-4" />
              Create group
            </Button>
          </div>
        )}

        {mode === 'dm' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
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
                  disabled={createDM.isPending}
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
          </div>
        )}

        {/* Group mode */}
        {mode === 'group' && (
          <div className="space-y-3">
            <Input
              placeholder="Group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              autoFocus
            />

            {/* Selected users chips */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-1 bg-accent rounded-full px-2 py-1 text-xs"
                  >
                    <span>{user.username}</span>
                    <button onClick={() => toggleUserForGroup(user)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Add members..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1">
              {isLoading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {users?.map((user) => {
                const isSelected = !!selectedUsers.find((u) => u._id === user._id)
                return (
                  <button
                    key={user._id}
                    onClick={() => toggleUserForGroup(user)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      isSelected ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-[10px] text-primary-foreground">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <Button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedUsers.length < 0 || createGroup.isPending}
              className="w-full bg-blue-600"
            >
              {createGroup.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Create group ({selectedUsers.length} members)
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
