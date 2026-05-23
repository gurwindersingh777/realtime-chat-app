import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../shared/types/index"

let socket: Socket<ServerToClientEvents, ClientToServerEvents>

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      autoConnect: false,
      withCredentials: true,
    })
  }

  return socket
}