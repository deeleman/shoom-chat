/**
 * Represents a specific Channel within the SoomChat channels pool.
 */
export type Channel = string;

/**
 * Represents a particular user within a channel.
 */
export type User = string;

/**
 * Represents all users grouped by channels in the system.
 */
export type ChannelUsers = Record<Channel, User[]>
