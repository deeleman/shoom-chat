import { Server, type ServerOptions, type Socket } from "socket.io";
import { SocketEvent } from "./SocketEvent.js";

export class SocketService {
  private io: Server;

  private connectedPeers: string[] = []

  private constructor(httpServer: Partial<ServerOptions>) {
    // Socket.IO server instantiation
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'], // Allows Vite dev server to connect
        methods: ["GET", "POST"]
      }
    });

    // Socket.IO connection handling
    this.io.on('connection', (socket: Socket) => {
      this.connectedPeers.push(socket.id);

      socket.emit(SocketEvent.PeerRefresh, {
        peers: this.connectedPeers.filter((peerSocketId) => peerSocketId !== socket.id)
      });

      socket.on(SocketEvent.ICECandidateRequest, (socketId, signal) => {
        socket.to(socketId).emit(SocketEvent.ICECandidateRequest, socket.id, signal);
      });

      socket.on(SocketEvent.ConnectionOfferRequest, (socketId, description) => {
        socket.to(socketId).emit(SocketEvent.ConnectionOfferRequest, description);
      });

      socket.on(SocketEvent.ConnectionOfferResponse, (socketId, description) => {
        socket.to(socketId).emit(SocketEvent.ConnectionOfferResponse, description);
      });

      socket.on(SocketEvent.DisconnectResponse, () => {
        console.log(`Socked ID ${socket.id} was disconnected.`);
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
    /** An optional callback  */
    onReady: () => void,
  }): SocketService {
    const { httpServer, onReady } = config;
    const socketService = new SocketService(httpServer);

    if (typeof onReady === 'function') {
      onReady();
    }

    return socketService;
  }
}
