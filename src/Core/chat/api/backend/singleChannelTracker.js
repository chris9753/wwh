import io from 'socket.io-client';
import { subscribeSingleChannel, subscribeThreadSnapshot } from './channel';

export default class SingleChannelTracker {
  constructor(channel, userID) {
    this.channel = channel;
    this.userID = userID;
    this.messages = [];

    this.socket = io.connect('http://localhost:3000', {
      transports: ['websocket'],
      jsonp: false,
    });

    this.socket.on('chatSingleChannelChange', (change) => {
      // A change has been observed for the channel metadata (e.g. channels table in the database)
      if (change && change.operationType == 'update' && change.channelData) {
        this.channel = { ...this.channel, ...change.channelData };
        this.onMetadataChangeCallback &&
          this.onMetadataChangeCallback(this.channel);
      }
    });

    this.socket.on('chatMessagesChange', (change) => {
      // A change has been observed for the messages list (e.g. "thread" subcollection of this channel ID in the database)
      if (change.operationType == 'insert') {
        this.messages = this.modifiedMessagesListAfterAdding(
          this.messages,
          change.fullDocument,
        );
        this.onMetadataChangeCallback &&
          this.onMessagesChangeCallback(this.messages);
      } else if (change.operationType == 'delete') {
        this.messages = this.modifiedMessagesListAfterRemoval(
          this.messages,
          change.documentKey,
        );
        this.onMetadataChangeCallback &&
          this.onMessagesChangeCallback(messages);
      }
    });
  }

  subscribe = (onMetadataChangeCallback, onMessagesChangeCallback) => {
    this.onMetadataChangeCallback = onMetadataChangeCallback;
    this.onMessagesChangeCallback = onMessagesChangeCallback;
    // We need to subscribe to the messages in this channelID

    // This fetches all the existing initial messages
    subscribeThreadSnapshot(this.channel, this.onMessagesChange, this.userID);

    // We need to subscribe to the channel metadata changes
    // This fetches the initial channel data (e.g. name of channel, last message, last message date, etc.)
    subscribeSingleChannel(this.channel.id, (channelData) => {
      this.onMetadataChange(channelData);
    });

    this.socket.on('connect', () => {
      // This subscribes to real-time changes in the messages list
      this.socket.emit('subscriptionToChatMessagesChanges', {
        channelID: this.channel?.id,
        userID: this.userID,
      });

      // This subscribes to real-time changes in the channel metadata
      this.socket.emit('subscriptionToChatSingleChannelChanges', {
        channelID: this.channel?.id,
        userID: this.userID,
      });
    });
  };

  unsubscribe = () => {
    // this.socket.emit('disconnect');
  };

  onMessagesChange = (messages) => {
    this.messages = messages;
    this.onMetadataChangeCallback && this.onMessagesChangeCallback(messages);
  };

  onMetadataChange = (channelData) => {
    this.channel = { ...this.channel, ...channelData };
    this.onMetadataChangeCallback &&
      this.onMetadataChangeCallback(this.channel);
  };

  modifiedMessagesListAfterRemoval = (messages, docToBeRemoved) => {
    return messages
      .filter((message) => message?.id !== docToBeRemoved?._id)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  modifiedMessagesListAfterAdding = (messages, messageToBeAdded) => {
    return messages
      .concat([messageToBeAdded])
      .sort((a, b) => b.createdAt - a.createdAt);
  };
}
