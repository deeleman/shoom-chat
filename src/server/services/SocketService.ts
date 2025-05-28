import { Server, type ServerOptions } from "socket.io";
import { UserService } from "./UserService.js";
import { IncomingMessage, ServerResponse } from "node:http";

export class SocketService {
  private constructor(
    private readonly server: Partial<ServerOptions>,
    private readonly userService: UserService,
  ) {
    const io = new Server(server);

    io.on('connection', (socket) => {
      console.log(`User ${socket.id} has connected successfully`);

      this.userService.registerUser(socket.id);
      io.emit('peers', userService.getPeersByChannel());

      io.on('disconnection', () => {
        userService.unRegisterUser(socket.id);
      });
    });
  }

  static initialize(
    server: Partial<ServerOptions>,
    userService: UserService,
    next: () => void,
  ): SocketService {
    const socketService = new SocketService(server, userService);

    if (typeof next === 'function') {
      next();
    }

    return socketService;
  }
}
