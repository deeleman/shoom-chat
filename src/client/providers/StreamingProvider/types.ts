
export type UserStream = {
  socketId: string | null;
  fullName?: string;
  stream: MediaStream;
  hasCameraOn: boolean;
  hasMicrophoneOn: boolean;
};

export type StreamingContextType = {
  socketId: string | null;
  rooms: string[];
  streams: MediaStream[];
  peers: string[];
  joinRoom: (name: string, room?: string) => void;
  leaveRoom?: (room: string) => void;
};

export type WelcomeResponse = {
  socketId: string;
  rooms: string[];
  peers: Record<string, string[]>;
};

/**
 * Web Socket events definition. Event message types must conform to
 * a naming convention based on a message type name in PascalCase
 * followed by either `Response` for Server messages or `Request` for Client messages.
 */
export enum SocketEvent {
  /** Server response after connecting to server. */
  WelcomeResponse = 'welcome-response',

  /** Client request to join a specific room channel while providing additional metadata. */
  ChannelJoinRequest = 'channel-join-request',

  /** Server response with channel metadata upon receiving a join request. */
  ChannelJoinResponse = 'channel-join-response',

  /** The user has been disconnected. */
  DisconnectResponse = 'disconnect',

  /** Client caller request to initiate a P2P connection with another user or callee. */
  ConnectionOfferRequest = 'connection-offer',

  /** Client callee response to establish a P2P connection with a caller user. */
  ConnectionOfferResponse = 'connection-answer',

  /** Client request that issues a Signal to establish the Communication channel */
  ICECandidateRequest = 'ice-candidate-signaling'
  ,
}
