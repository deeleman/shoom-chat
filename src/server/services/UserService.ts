import { PUBLIC_CHANNEL } from "./constants";
import type { RoomUsers, User, Room } from "./types";

/**
 * The UserService class is a centralized stateful
 * provider for handling users by chat room channel.
 */
export class UserService {
  private usersByRoom: RoomUsers = {
    [PUBLIC_CHANNEL]: [],
  };

  private userRoomMap = new Map<string, Room>();

  /**
   * Registers a new user within a specific room channel.
   * @param user {@link User} instance to register in the provided room channel.
   * @param room {@link Room} for attaching the {@link User} to. 
   */
  registerUser(user: User, room = PUBLIC_CHANNEL): void {
    if (room in this.usersByRoom) {
      this.usersByRoom[room].push(user);
    } else {
      this.usersByRoom[room] = [user];
    }

    this.userRoomMap.set(user.socketId, room);
  }

  /**
   * Removes the informed {@link User} by its `socketId` from a specific channel provided.
   * @param userSocketId String representing the `Socket.socketId` of the finished connection.
   */
  unRegisterUser(userSocketId: string): void {
    const room = this.userRoomMap.get(userSocketId);
    if (room) {
      this.usersByRoom[room] = this.usersByRoom[room].filter((user) => user.socketId !== userSocketId);
      this.userRoomMap.delete(userSocketId);
    } else {
      throw new Error('The requested channel or user does not exist');
    }
  }

  /**
   * Returns all the users existing in a given room channel, except for the given user.
   * @param room {@link Room} object whose {@link User} instances we want to retrieve.
   * @returns An array of user peers to chat with in the room channel selected.
   */
  getPeersByChannel(room = PUBLIC_CHANNEL): User[] | never {
    if (room in this.usersByRoom) {
      return this.usersByRoom[room];
    }

    throw new Error('The requested room channel does not exist');
  }

  /**
   * Retrieves the room channel where the user provided is registered at.
   * @param user The {@link User} object whose room channel we want to retrieve.
   * @returns The {@link Room} object representing the room channel the suer is subscribed to.
   */
  getUserChannel(user: User): Room | undefined {
    return this.userRoomMap.get(user.socketId);
  }

  /**
   * Helper function to return all room channels created.
   * @returns A {@link Room} objects array.
   */
  getRooms(): Room[] {
    return Object.keys(this.usersByRoom);
  }
}
