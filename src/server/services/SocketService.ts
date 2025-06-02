import { Server, Socket, type ServerOptions } from "socket.io";
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

    // Socket.IO message handling
    this.io.on('connection', (socket) => {
      this.connectedPeers.push(socket.id);

      const peers = this.connectedPeers.filter(socketId => socketId !== socket.id);
      socket.emit(SocketEvent.PeerRefresh, peers);

      socket.on(SocketEvent.ConnectionOfferRequest, (socketId, description) => {
        socket.to(socketId).emit(SocketEvent.ConnectionOfferRequest, socket.id, description);
      });

      socket.on(SocketEvent.ConnectionOfferReply, (socketId, description) => {
        socket.to(socketId).emit(SocketEvent.ConnectionOfferReply, description);
      });

      socket.on(SocketEvent.ICECandidateSignal, (socketId, signal) => {
        socket.to(socketId).emit(SocketEvent.ICECandidateSignal, signal);
      });

      socket.on(SocketEvent.DisconnectResponse, () => {
        this.connectedPeers = this.connectedPeers.filter((socketId) => socketId !== socket.id);
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
