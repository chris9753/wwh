import io from 'socket.io-client';
import { setChannelsSubcribed, setChannels } from '../../redux';
import { setUserData } from '../../../onboarding/redux/auth';
import { setBannedUserIDs } from '../../../user-reporting/redux';
import { userAPIManager } from '../../../api';
import { reportingManager } from '../../../user-reporting';
import { subscribeChannels } from './channel';

export default class ChannelsTracker {
  constructor(reduxStore, userID) {
    this.reduxStore = reduxStore;
    this.userID = userID;

    this.socket = io.connect('http://localhost:3000', {
      transports: ['websocket'],
      jsonp: false,
    });

    this.socket.on('chatChannelsChange', (change) => {
      if (change.operationType == 'insert') {
        this.channels = this.modifiedChannelsListAfterAdding(
          this.channels,
          change.fullDocument,
        );
        this.updateChannelsIfNeeded();
      } else if (change.operationType == 'delete') {
        this.channels = this.modifiedChannelsListAfterRemoval(
          this.channels,
          change.documentKey,
        );
        this.updateChannelsIfNeeded();
      } else if (change.operationType == 'update') {
        if (!change.channelData) {
          return;
        }
        this.channels = this.modifiedChannelsListAfterUpdate(
          this.channels,
          change.channelData,
        );
        this.updateChannelsIfNeeded();
      }
    });
  }

  subscribeIfNeeded = () => {
    const userId = this.userID;
    const state = this.reduxStore.getState();
    if (!state.chat.areChannelsSubcribed) {
      this.reduxStore.dispatch(setChannelsSubcribed());
      this.currentUserUnsubscribe = userAPIManager?.subscribeCurrentUser(
        userId,
        this.onCurrentUserUpdate,
      );
      this.abusesUnsubscribe = reportingManager.unsubscribeAbuseDB(
        userId,
        this.onAbusesUpdate,
      );
      this.channelsUnsubscribe = subscribeChannels(
        userId,
        this.onChannelCollectionUpdate,
      );

      // Subscribe to changes in the channels list via sockets
      this.socket.on('connect', () => {
        this.socket.emit('subscriptionToChannelsChanges', {
          userID: userId,
        });
      });
    }
  };

  unsubscribe = () => {
    if (this.currentUserUnsubscribe) {
      this.currentUserUnsubscribe();
    }
    if (this.channelsUnsubscribe) {
      this.channelsUnsubscribe();
    }
    if (this.abusesUnsubscribe) {
      this.abusesUnsubscribe();
    }
  };

  onCurrentUserUpdate = (user) => {
    this.reduxStore.dispatch(setUserData({ user }));
  };

  onAbusesUpdate = (abuses) => {
    var bannedUserIDs = [];
    abuses.forEach((abuse) => bannedUserIDs.push(abuse.dest));
    this.reduxStore.dispatch(setBannedUserIDs(bannedUserIDs));
    this.bannedUserIDs = bannedUserIDs;
    this.updateChannelsIfNeeded();
  };

  onChannelCollectionUpdate = (channels) => {
    this.channels = channels;
    this.updateChannelsIfNeeded();
  };

  channelsWithNoBannedUsers = (channels, bannedUserIDs) => {
    const channelsWithNoBannedUsers = [];
    channels.forEach((channel) => {
      if (
        channel.participants &&
        channel.participants.length > 0 &&
        (!bannedUserIDs ||
          channel.participants.length != 1 ||
          !bannedUserIDs.includes(channel.participants[0].id))
      ) {
        channelsWithNoBannedUsers.push(channel);
      }
    });
    return channelsWithNoBannedUsers;
  };

  updateChannelsIfNeeded = () => {
    if (!this.channels || !this.bannedUserIDs) {
      return;
    }
    // We filter out all the users who are blocked by the currently logged in user
    const channels = this.channelsWithNoBannedUsers(
      this.channels,
      this.bannedUserIDs,
    );

    // We sort the channels again, in case new channels were added or removed in real-time
    const sortedChannels = channels.sort((a, b) => b.createdAt - a.createdAt);
    this.reduxStore.dispatch(setChannels(sortedChannels));
  };

  modifiedChannelsListAfterUpdate = (channels, channelData) => {
    // We remove the old channel
    const removed = this.modifiedChannelsListAfterRemoval(
      channels,
      channelData,
    );

    // We add back the update channel data
    return this.modifiedChannelsListAfterAdding(removed, channelData);
  };

  modifiedChannelsListAfterRemoval = (channels, docToBeRemoved) => {
    return channels.filter((channel) => channel?.id !== docToBeRemoved?._id);
  };

  modifiedChannelsListAfterAdding = (channels, channelToBeAdded) => {
    return channels.concat([channelToBeAdded]);
  };
}
