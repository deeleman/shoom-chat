import { Server, type ServerOptions, type Socket } from "socket.io";
import { type Room, type User, SocketEvent } from "./types.js";
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

      socket.on(SocketEvent.ChannelJoinRequest,
        (request: { user: User, room?: Room }) => this.joinRoom(socket, request.user, request.room));

      socket.on(SocketEvent.ICECandidateRequest, (socketId, signal) => {
        socket.to(socketId).emit(SocketEvent.ICECandidateRequest, socket.id, signal);
      });

      socket.on(SocketEvent.ConnectionOfferRequest, (socketId, description) => {
        socket.to(socketId).emit(SocketEvent.ConnectionOfferRequest, socket.id, description);
      });

      socket.on(SocketEvent.ConnectionOfferResponse, (socketId, description) => {
        socket.to(socketId).emit(SocketEvent.ConnectionOfferResponse, socket.id, description);
      });

      socket.on(SocketEvent.DisconnectResponse, () => {
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
    this.io.to(socket.id).emit(SocketEvent.WelcomeResponse, {
      socketId: socket.id,
      rooms: this.userService.getRooms(),
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

    this.io.to(user.socketId).emit(SocketEvent.ChannelJoinResponse, {
      peers: this.userService.getPeersByChannel(room),
    });
  }
}
