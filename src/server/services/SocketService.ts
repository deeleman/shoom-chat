import { Server, type ServerOptions, type Socket } from "socket.io";
import { UserService } from "./UserService.js";

export class SocketService {
  private constructor(
    private readonly httpServer: Partial<ServerOptions>,
    private readonly userService: UserService,
  ) {
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'], // Allow Vite dev server to connect
        methods: ["GET", "POST"]
      }
    });

    // Socket.IO connection handling
    io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      userService.registerUser(socket.id);

      // Send a welcome message to the newly connected client
      socket.emit('message', `Welcome, you are connected with ID: ${socket.id}`);

      // Listen for a 'chatMessage' event from the client
      socket.on('peers', () => {
        console.log(`Received peers request message from ${socket.id}`);
        // Broadcast the message to all connected clients
        io.emit('peers', userService.getPeersByChannel());
      });

      // Handle client disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit('message', `User ${socket.id} has left the chat.`);
      });
    });
  }

  static initialize(config: {
    httpServer: any,
    userService: UserService,
    onReady: () => void,
  }): SocketService {
    const { httpServer, userService, onReady } = config;
    const socketService = new SocketService(httpServer, userService);

    if (typeof onReady === 'function') {
      onReady();
    }

    return socketService;
  }
}
