import { Server, type ServerOptions, type Socket } from "socket.io";
import { type Room, type User, SocketEventMessage } from "./types.js";
import { UserService } from "./UserService.js";
import { PUBLIC_CHANNEL } from "./constants.js";

export class SocketService {
  private io: Server;

  private constructor(
    private readonly httpServer: Partial<ServerOptions>,
    private readonly userService: UserService,
  ) {
    // Socket.IO server instantiation
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'], // Allows Vite dev server to connect
        methods: ["GET", "POST"]
      }
    });

    // Socket.IO connection handling
    this.io.on('connection', (socket: Socket) => {
      this.submitWelcomeResponse(socket);

      socket.on(SocketEventMessage.ChannelJoinRequest,
        (request: { user: User, room?: Room }) => this.joinRoom(socket, request.user, request.room));

      socket.on(SocketEventMessage.ConnectionOfferRequest, (socketId, description) => {
        socket.to(socketId).emit(SocketEventMessage.ConnectionOfferRequest, socket.id, description);
      });

      socket.on(SocketEventMessage.ConnectionOfferResponse, (socketId, description) => {
        socket.to(socketId).emit(SocketEventMessage.ConnectionOfferResponse, description);
      });

      socket.on(SocketEventMessage.ICECandidateRequest, (socketId, signal) => {
        socket.to(socketId).emit(SocketEventMessage.ICECandidateRequest, signal);
      });

      socket.on(SocketEventMessage.DisconnectResponse, () => {
        this.userService.unRegisterUser(socket.id);
      });
    });
  }

  /**
   * Initializes the Web Socket Messaging service
   * @param config The required config options.
   * @returns A {@link SocketService} service provider object instance.
   */
  static initialize(config: {
    /** The `http` object instance, required for instrumenting the Web Sockets server. */
    httpServer: any,
    /** The `UserService` object instance to track user video room subscriptions. */
    userService: UserService,
    /** An optional callback  */
    onReady: () => void,
  }): SocketService {
    const { httpServer, userService, onReady } = config;
    const socketService = new SocketService(httpServer, userService);

    if (typeof onReady === 'function') {
      onReady();
    }

    return socketService;
  }

  /**
   * Submits a welcome response informing the user about all the users already connected.
   * This information will prove to be mandatory for implementing the P2P communications later on.
   * @param socket A main SocketJS object for interacting with a client.
   */
  submitWelcomeResponse(socket: Socket): void {
    this.io.to(socket.id).emit(SocketEventMessage.WelcomeResponse, {
      socketId: socket.id,
      channels: this.userService.getRooms(),
      peers: this.userService.getPeersByChannel(PUBLIC_CHANNEL)
    });
  }

  /**
   * Registers a new {@link User} in the system and attaches it to a Socket room, emitting a Socket message back
   * with all users currently registered in that chat room.
   * @param socket A main SocketJS object for interacting with a client.
   * @param user The {@link User} instance to join the given room channel.
   * @param room Optional {@link Room} channel the user wants to join. Defaults to {@link PUBLIC_CHANNEL}.
   */
  joinRoom(socket: Socket, user: User, room = PUBLIC_CHANNEL): void {
    this.userService.registerUser(user, room);
    socket.join(room);

    this.io.to(user.socketId).emit(SocketEventMessage.ChannelWelcomeResponse, {
      peers: this.userService.getPeersByChannel(room),
    });
  }
}
