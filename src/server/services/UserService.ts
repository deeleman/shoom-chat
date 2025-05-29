import type { ChannelUsers, User, Channel } from "./types.js";

/**
 * The UserService class is a centralized stateful
 * provider for handling users by video channel.
 */
export class UserService {
  private userChannels: ChannelUsers = {
    public: [],
  };

  private userChannelMap = new Map<User, Channel>();

  /**
   * Registers a new user within a specific channel.
   * @param user {@link User} instance to register in the provided channel.
   * @param channel Optional {@link Channel} for attaching the {@link User} to. Defaults to `public` if not explicitly provided.
   */
  registerUser(user: User, channel: Channel = 'public'): void {
    if (channel in this.userChannels) {
      this.userChannels[channel].push(user);
    } else {
      this.userChannels[channel] = [user];
    }

    this.userChannelMap.set(user, channel);
  }

  /**
   * Removes the informed {@link User} from a specific channel provided.
   * @param user {@link User} instance to remove from the provided channel.
   * @param channel Optional {@link Channel} for removing the {@link User} from. Defaults to `public` if not explicitly provided.
   */
  unRegisterUser(user: User, channel: Channel = 'public'): void {
    if (channel in this.userChannels) {
      this.userChannels[channel] = this.getPeersByChannel(user, channel);
      this.userChannelMap.delete(user);
    } else {
      throw new Error('The requested channel does not exist');
    }
  }

  /**
   * Returns all the users existing in a given channel, except for the given user.
   * @param user Optional {@link User} instance whose peers we want to inspect. If not provided it will return ALL users in the channel.
   * @param channel Optional {@link Channel} whose {@link User} instances we want to retrieve. Defaults to `public` if not explicitly provided.
   * @returns An array of user peers to chat with in the channel selected.
   */
  getPeersByChannel(user?: User, channel: Channel = 'public'): User[] | never {
    if (user && channel.indexOf(user) < 0) {
      throw new Error('The user does not belong in this channel');
    }

    if (channel in this.userChannels) {
      return this.userChannels[channel].filter((peer) => peer !== user);
    }

    throw new Error('The requested channel does not exist');
  }

  /**
   * Retrieves the channel where the user provided is registered at.
   * @param user The {@link User} object whose channel we want to retrieve.
   * @returns The {@link Channel} object representing the channel the suer is subscribed to.
   */
  getUserChannel(user: User): Channel | undefined {
    return this.userChannelMap.get(user);
  }

  /**
   * Helper function to return all channels created.
   * @returns A {@link Channel} objects array.
   */
  getChannels(): Channel[] {
    return Object.keys(this.userChannels);
  }
}