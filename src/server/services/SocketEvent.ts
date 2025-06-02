/**
 * Web Socket events definition. Event message types must conform to
 * a naming convention based on a message type name in PascalCase
 * followed by either `Response` for Server messages or `Request` for Client messages.
 */
export enum SocketEvent {
  /** Socket message to inform what users are available. */
  PeerRefresh = 'peers-available',

  /** The user has been disconnected. */
  DisconnectResponse = 'disconnect',

  /** Client caller request to initiate a P2P connection with another user or callee. */
  ConnectionOfferRequest = 'connection-request',

  /** Client callee response to establish a P2P connection with a caller user. */
  ConnectionOfferReply = 'connection-reply',

  /** Client request that issues a Signal to establish the Communication channel */
  ICECandidateSignal = 'ice-candidate-signaling',
}
