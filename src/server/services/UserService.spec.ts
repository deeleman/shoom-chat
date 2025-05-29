import { UserService } from './UserService';
import type { User, Channel } from './types';

describe('UserService', () => {
  let userService: UserService;

  // Before each test, create a new instance of UserService to ensure a clean state
  beforeEach(() => {
    userService = new UserService();
  });

  describe('registerUser', () => {
    it('should register a user in the public channel by default', () => {
      const user: User = 'user1';
      userService.registerUser(user);
      expect(userService.getPeersByChannel(undefined, 'public')).toContain(user);
      expect(userService.getUserChannel(user)).toBe('public');
    });

    it('should register a user in a specified channel', () => {
      const user: User = 'user2';
      const channel: Channel = 'private-room';
      userService.registerUser(user, channel);
      expect(userService.getPeersByChannel(undefined, channel)).toContain(user);
      expect(userService.getUserChannel(user)).toBe(channel);
    });

    it('should add a user to an existing channel', () => {
      const user1: User = 'user3';
      const user2: User = 'user4';
      const channel: Channel = 'gaming-room';
      userService.registerUser(user1, channel);
      userService.registerUser(user2, channel);
      expect(userService.getPeersByChannel(undefined, channel)).toEqual(expect.arrayContaining([user1, user2]));
      expect(userService.getPeersByChannel(undefined, channel).length).toBe(2);
    });

    it('should create a new channel if it does not exist', () => {
      const user: User = 'user5';
      const channel: Channel = 'new-channel';
      userService.registerUser(user, channel);
      expect(userService.getChannels()).toContain(channel);
    });
  });

  describe('unRegisterUser', () => {
    it('should unregister a user from the public channel by default', () => {
      const user: User = 'user6';
      userService.registerUser(user);
      userService.unRegisterUser(user);
      expect(userService.getPeersByChannel(undefined, 'public')).not.toContain(user);
      expect(userService.getUserChannel(user)).toBeUndefined();
    });

    it('should unregister a user from a specified channel', () => {
      const user: User = 'user7';
      const channel: Channel = 'dev-channel';
      userService.registerUser(user, channel);
      userService.unRegisterUser(user, channel);
      expect(userService.getPeersByChannel(undefined, channel)).not.toContain(user);
      expect(userService.getUserChannel(user)).toBeUndefined();
    });

    it('should throw an error if the channel does not exist', () => {
      const user: User = 'user8';
      const nonExistentChannel: Channel = 'non-existent';
      expect(() => userService.unRegisterUser(user, nonExistentChannel)).toThrow('The requested channel does not exist');
    });

    it('should not remove other users from the channel when one is unregistered', () => {
      const user1: User = 'user9';
      const user2: User = 'user10';
      const channel: Channel = 'shared-channel';
      userService.registerUser(user1, channel);
      userService.registerUser(user2, channel);
      userService.unRegisterUser(user1, channel);
      expect(userService.getPeersByChannel(undefined, channel)).toContain(user2);
      expect(userService.getPeersByChannel(undefined, channel)).not.toContain(user1);
    });
  });

  describe('getPeersByChannel', () => {
    it('should return all users in a channel if no user is provided', () => {
      const user1: User = 'user11';
      const user2: User = 'user12';
      const channel: Channel = 'general';
      userService.registerUser(user1, channel);
      userService.registerUser(user2, channel);
      expect(userService.getPeersByChannel(undefined, channel)).toEqual(expect.arrayContaining([user1, user2]));
    });

    it('should return all users in a channel except the specified user', () => {
      const user1: User = 'user13';
      const user2: User = 'user14';
      const user3: User = 'user15';
      const channel: Channel = 'test-channel';
      userService.registerUser(user1, channel);
      userService.registerUser(user2, channel);
      userService.registerUser(user3, channel);
      expect(userService.getPeersByChannel(user1, channel)).toEqual(expect.arrayContaining([user2, user3]));
      expect(userService.getPeersByChannel(user1, channel)).not.toContain(user1);
    });

    it('should throw an error if the requested channel does not exist', () => {
      const user: User = 'user16';
      const nonExistentChannel: Channel = 'missing-channel';
      expect(() => userService.getPeersByChannel(user, nonExistentChannel)).toThrow('The requested channel does not exist');
    });

    it('should return an empty array if the channel exists but has no users', () => {
      const channel: Channel = 'empty-channel';
      // We don't register any user in this channel, so it should start empty
      // and only appear as a channel after someone registers.
      // This test case would be more relevant if there was a way to create an empty channel.
      // Given the current implementation, a channel is created only when a user is registered.
      // Let's modify the test to reflect the behavior:
      const user: User = 'tempUser';
      userService.registerUser(user, channel); // Create the channel
      userService.unRegisterUser(user, channel); // Then remove the user
      expect(userService.getPeersByChannel(undefined, channel)).toEqual([]);
    });

    it('should throw an error if the provided user does not belong to the channel', () => {
        const userInChannel: User = 'userIn';
        const userNotInChannel: User = 'userOut';
        const channel: Channel = 'specific-channel';
        userService.registerUser(userInChannel, channel);
        // The original code has `channel.indexOf(user) < 0` which doesn't seem right for `User` type.
        // Assuming `User` is a string, and you intended to check if the user is *not* in the channel's user list.
        // If 'user' is the string name of the user, `channel.indexOf(user)` would search in the *channel name*, not in the array of users.
        // Let's test based on the likely intended behavior: if the user is not in the channel's user list.
        // However, given the current `getPeersByChannel` implementation's `if (user && channel.indexOf(user) < 0)` condition,
        // it checks if the *channel name* contains the user string. This is a potential bug or misunderstanding of `User` and `Channel` types.
        // Assuming 'User' is a string and the intent was to check if the user is not in the list of users for that channel.
        // For the purpose of this test, we'll mimic what the current code would do if `user` was mistakenly checked against `channel` string.
        // But more correctly, this check should be `!this.userChannels[channel].includes(user)`.

        // Given the current implementation, if 'userNotInChannel' is passed and 'channel' is 'specific-channel',
        // 'specific-channel'.indexOf('userOut') would indeed be -1.
        // However, the error message 'The user does not belong in this channel' suggests the check should be against the channel's users.

        // If the `User` type can be something complex and `indexOf` is not appropriate, this line might need fixing.
        // For now, testing the actual implementation:
        // 'specific-channel'.indexOf('userOut') is -1, so it *will* throw based on current code.
        // If the `User` type is a string, and `channel` is also a string (as indicated by `Channel = string`),
        // then `channel.indexOf(user)` *does* check if the channel name string contains the user string.
        // This is highly likely *not* the intended logic. The intended logic should be to check if the user is *registered* in that channel.
        // Let's write the test assuming the current implementation's literal behavior, but flag it as a potential logic issue.

        // If 'userNotInChannel' is indeed not registered in 'specific-channel', and assuming `User` is a string
        // and `channel` is a string, then `channel.indexOf(userNotInChannel)` would be -1.
        // This would trigger the error "The user does not belong in this channel" based on the current code.
        expect(() => userService.getPeersByChannel(userNotInChannel, channel)).toThrow('The user does not belong in this channel');
    });
  });

  describe('getUserChannel', () => {
    it('should return the channel a user is registered in', () => {
      const user: User = 'user17';
      const channel: Channel = 'music-channel';
      userService.registerUser(user, channel);
      expect(userService.getUserChannel(user)).toBe(channel);
    });

    it('should return undefined if the user is not registered in any channel', () => {
      const user: User = 'user18';
      expect(userService.getUserChannel(user)).toBeUndefined();
    });

    it('should return undefined after a user is unregistered', () => {
      const user: User = 'user19';
      userService.registerUser(user, 'temp-channel');
      userService.unRegisterUser(user, 'temp-channel');
      expect(userService.getUserChannel(user)).toBeUndefined();
    });
  });

  describe('getChannels', () => {
    it('should return an array of all active channels', () => {
      userService.registerUser('user20', 'chat1');
      userService.registerUser('user21', 'chat2');
      userService.registerUser('user22', 'public'); // Public is a default channel
      const channels = userService.getChannels();
      expect(channels).toEqual(expect.arrayContaining(['public', 'chat1', 'chat2']));
      expect(channels.length).toBe(3);
    });

    it('should return only the public channel if no other channels are created', () => {
      // Public channel is always initialized
      expect(userService.getChannels()).toEqual(['public']);
    });

    it('should not return duplicate channels', () => {
      userService.registerUser('user23', 'duplicate-channel');
      userService.registerUser('user24', 'duplicate-channel');
      expect(userService.getChannels()).toEqual(expect.arrayContaining(['public', 'duplicate-channel']));
      expect(userService.getChannels().length).toBe(2);
    });
  });
});