/**
 * Represents a specific Room within the Shoom Chat room channels pool.
 */
export type Room = string;

/**
 * Represents a particular user metadata within a channel.
 */
export type User = {
  /** Unique id from `Socket` connection. */
  socketId: string;
  /** Full user name, for messaging purposes. */
  name: string;
};

/**
 * Represents all users grouped by room channels in the system.
 */
export type RoomUsers = Record<Room, User[]>

/**
 * Web Socket events definition. Event message types must conform to
 * a naming convention based on a message type name in PascalCase
 * followed by either `Response` for Server messages or `Request` for Client messages.
 */
export enum SocketEventMessage {
  /** Server response after connecting to server. */
  WelcomeResponse = 'welcome-response',

  /** Client request to join a specific room channel while providing additional metadata. */
  ChannelJoinRequest = 'channel-join-request',

  /** Server response with channel metadata upon receiving a join request. */
  ChannelWelcomeResponse = 'channel-join-response',

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
