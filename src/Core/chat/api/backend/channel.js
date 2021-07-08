import uuidv4 from 'uuidv4';
import AsyncStorage from '@react-native-community/async-storage';
import { IMLocalized } from '../../../localization/IMLocalization';

const baseAPIURL = 'http://localhost:3000/api/';

export const subscribeChannels = (userID, callback) => {
  AsyncStorage.getItem("jwt_token", (_error, token) => {
    const config = {
        headers: { 'Authorization': token }
    };
    fetch(baseAPIURL + "chat/channels?userID=" + userID + "&orderBy=createdAt&desc=true", config)
      .then(response => response.json())
      .then(data => {
        callback(data.channels)
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
  });
  return null
};

export const subscribeSingleChannel = (channelID, callback) => {
  AsyncStorage.getItem("jwt_token", (_error, token) => {
    const config = {
        headers: { 'Authorization': token }
    };
    fetch(baseAPIURL + "chat/channel/" + channelID, config)
      .then(response => response.json())
      .then(data => {
        callback(data?.channel)
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
  });
  return null
};

export const subscribeThreadSnapshot = (
  channel,
  callback,
  userID = '',
) => {
  AsyncStorage.getItem("jwt_token", (_error, token) => {
    const config = {
        headers: { 'Authorization': token }
    };
    fetch(baseAPIURL + "chat/channel/" + channel.id + '/thread/?orderBy=createdAt&desc=true', config)
      .then(response => response.json())
      .then(data => {
        callback(data.messages)
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
  });
  return null
};

export const sendMessage = (
  sender,
  channel,
  message,
  downloadURL,
  inReplyToItem,
  participantProfilePictureURLs,
) => {
  return new Promise((resolve) => {
    const { profilePictureURL } = sender;
    const userID = sender.id || sender.userID;
    const data = {
      content: message,
      createdAt: Math.round((new Date()).getTime() / 1000),
      recipientFirstName: '',
      recipientID: '',
      recipientLastName: '',
      recipientProfilePictureURL: '',
      senderFirstName: sender.firstName || sender.fullname,
      senderID: userID,
      senderLastName: '',
      senderProfilePictureURL: profilePictureURL,
      url: downloadURL,
      inReplyToItem: inReplyToItem,
      readUserIDs: [userID],
      participantProfilePictureURLs,
    };
    const channelID = channel.id;

    try {
      AsyncStorage.getItem("jwt_token", async (_error, token) => {
        const res = await fetch(baseAPIURL + 'chat/message/add', {
          method: 'post',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: data, channelID: channelID }),
        })
        resolve({ success: true });
      });
    } catch (error) {
      console.log(error)
      resolve({ success: false, error: error });
    }
  });
};

export const deleteMessage = ({
  sender,
  channel,
  threadItemID,
  isLastCreatedThreadItem,
  newLastCreatedThreadItem,
}) => {
  if (!channel?.id || !threadItemID) {
    return;
  }

  try {
    AsyncStorage.getItem("jwt_token", async (_error, token) => {
      const res = await fetch(baseAPIURL + 'chat/message/delete', {
        method: 'delete',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messageID: threadItemID, channelID: channel?.id }),
      })
    });
  } catch (error) {
    console.log(error)
    alert(error)
  }
};

export const markChannelTypingUsers = async (channelID, typingUsers) => {
  try {
    AsyncStorage.getItem("jwt_token", async (_error, token) => {
      const res = await fetch(baseAPIURL + 'chat/channel/typing', {
        method: 'post',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channelID: channelID, typingUsers: typingUsers }),
      })
    });
  } catch (error) {
    console.log(error)
    alert(error)
  }
};

export const markChannelThreadItemAsRead = async (
  channelID,
  userID,
  threadMessageID,
  readUserIDs,
  participants,
) => {
  try {
    AsyncStorage.getItem("jwt_token", async (_error, token) => {
      const res = await fetch(baseAPIURL + 'chat/channel/markasread', {
        method: 'post',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channelID: channelID, userID: userID, messageID: threadMessageID, readUserIDs: readUserIDs }),
      })
    });
  } catch (error) {
    console.log(error)
    alert(error)
  }
};

export const createChannel = (creator, otherParticipants, name) => {
  return new Promise((resolve) => {
    var channelID = uuidv4();
    const id1 = creator.id || creator.userID;
    if (otherParticipants.length == 1) {
      const id2 = otherParticipants[0].id || otherParticipants[0].userID;
      if (id1 == id2) {
        // We should never create a self chat
        resolve({ success: false });
        return;
      }
      channelID = id1 < id2 ? id1 + id2 : id2 + id1;
    }
    const channelData = {
      creatorID: id1,
      id: channelID,
      channelID,
      name: name || '',
      participants: [...otherParticipants, creator],
    };

    try {
      AsyncStorage.getItem("jwt_token", async (_error, token) => {
        const res = await fetch(baseAPIURL + 'chat/channel/add', {
          method: 'post',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({channelData: channelData, userData: creator}),
        })
        resolve({ success: true, channel: channelData });
      });
    } catch (error) {
      console.log(error)
      resolve({ success: false, error: error });
    }
  });
};

export const onLeaveGroup = async (channelId, userId, callback) => {
  try {
    AsyncStorage.getItem("jwt_token", async (_error, token) => {
      const res = await fetch(baseAPIURL + 'chat/group/leave', {
        method: 'post',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({channelID: channelId, userID: userId}),
      })
      callback({ success: true });
    });
  } catch (error) {
    console.log(error)
    callback({
      success: false,
      error: error,
    });
  }
};

export const onRenameGroup = (groupName, channel, callback) => {
  try {
    AsyncStorage.getItem("jwt_token", async (_error, token) => {
      const res = await fetch(baseAPIURL + 'chat/group/update', {
        method: 'post',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({channelID: channel.id, updatedData: {name: groupName, title: groupName}}),
      })
      callback({ success: true, newChannel: {...channel, name: groupName} });
    });
  } catch (error) {
    console.log(error)
    callback({
      success: false,
      error: IMLocalized('An error occurred while renaming the group. Please try again.'),
    });
  }
};
