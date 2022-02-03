import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
  } from 'react-native';

import {actionChatIDSave} from '../actions';

import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui';
import {connect} from 'react-redux';
import PushNotifications from '../../core/components/PushNotifications';
import API from '../../utils/api';
import md5 from '../../utils/md5';
import {time} from '../../utils/date';
import {CHAT_MAIN_SOCKET} from '../../core/const';

import styleConst from '../../core/style-const';
import { get } from 'lodash';

const styles = StyleSheet.create({
  textMessageView: {
    padding: 10, 
  },
  authorName: {
    color: styleConst.color.blue,
    fontSize: 14,
    fontFamily: styleConst.font.medium,
    marginBottom: 10,
  },
  userName: {
    color: styleConst.color.white,
    textAlign: 'right',
  },
  authorText: {
    color: 'black',
    fontSize: 16,
  },
  authorDateText: {
    color: styleConst.color.greyText,
  },
  customText: {
    color: styleConst.color.darkBg,
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: styleConst.font.light,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  dateText: {
    color: 'white',
    fontSize: 11,
    marginTop: 5,
    fontFamily: styleConst.font.light,
    fontStyle: 'italic',
    textAlign: 'right'
  },
  customMessageView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  customMessageViewStopChat: {
    // paddingBottom: 8,
  }
});

const mapStateToProps = ({dealer, profile, contacts}) => {
  return {
    profile,
    dealerSelected: dealer.selected,
    session: contacts.chat.id,
  };
};

const mapDispatchToProps = {
  actionChatIDSave
};

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : (r % 4) + 8
    return v.toString(16)
  });
};

const removeDuplicates = (array, key) => {
  return array.reduce((arr, item) => {
    const removed = arr.filter(i => i[key] !== item[key]);
    return [...removed, item];
  }, []);
};

function connectSocket() {
  const chatSocket = new WebSocket(CHAT_MAIN_SOCKET, 'AtlantMChat', {
    headers: API.headers,
  });
  return chatSocket;
}

const intervalSecondsMini = 20;
const intervalMiliSeconds = intervalSecondsMini * 100;

const ChatScreen = ({dealer, profile, session, actionChatIDSave}) => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [loadingSocket, setLoadingSocket] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const userAtlantM = {
    id: '06c33e8b-e835-4736-80f4-63f44b66666c',
    firstName: 'Атлант-М',
    name: 'Атлант-М',
    imageUrl: 'https://cdn.atlantm.com/logo/Blue-square-256.png',
  };

  const userTmp = {
    "id": session,
    "name": [get(profile, 'login.NAME', get(profile, 'name')), get(profile, 'login.LAST_NAME', null)].join(' '),
    "avatarUrl": get(profile, 'login.UF_CRM_1639655792'),
    // "URL": "https://www.yandex.ru/",
    "phone": get(profile, 'login.PHONE[0].VALUE', get(profile, 'phone')),
    "email": get(profile, 'login.EMAIL[0].VALUE', get(profile, 'email')),
  };

  if (typeof chatSocket === 'undefined' || chatSocket.readyState === WebSocket.CLOSED) {
    chatSocket = connectSocket();
  }

  chatSocket.onopen = () => {
    // connection opened
    setLoadingSocket(false);
  };
  chatSocket.onclose = (e) => {
    // connection closed
    // connectSocket();
  };
  chatSocket.onmessage = (e) => {
    // a message was received
    const data = JSON.parse(e.data);
    if (data.body.Status) {
      let messageText = '';
      let type = 'text';
      switch (data.body.Status) {
        case 4: // Оператор закончил ввод сообщения
        break;
        case 3: // Оператор пишет сообщение
        break;
        case 5: // Оператор вышел из чата
          messageText = data.body.Text;
          userAtlantM.userEmail = data.body.UserEmail;
          type = 'custom';
          break;
        case 2: // Сообщение
          messageText = data.body.Text;
          userAtlantM.userEmail = data.body.UserEmail;
          break;
      }
      if (messageText) {
          let message = {
              author: userAtlantM,
              createdAt: Date.now(),
              id: uuidv4(),
              text: messageText,
              type
          };
          if (type == 'custom') {
            message.typeCustom = 'status' + data.body.Status;
          }
          addMessageToList(message);
      }
    }
  };
  chatSocket.onerror = (e) => {
    // an error occurred
        // console.warn('onError', e.message);
  };

  const renderTextMessage = ({author, createdAt, id, text, type}) => {
    const date = time(new Date(createdAt));
    if (author.id === userAtlantM.id) { // ответ Атлант-М
      return (
        <View style={styles.textMessageView}>
          <Text style={styles.authorName}>{author?.firstName}</Text>
          <Text style={styles.authorText}>{text}</Text>
          <Text style={[styles.dateText, styles.authorDateText]}>{date}</Text>
        </View>
      );
    }
    return (
      <View style={styles.textMessageView}>
        <Text style={[styles.authorName, styles.userName]}>{author?.firstName}</Text>
        <Text style={styles.messageText}>{text}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
    );
  };

  const renderCustomMessage = ({author, createdAt, id, text, type, typeCustom}) => {
    switch (typeCustom) {
      case 'status5': // Оператор вышел из чата
      case 'AGENT_STOP_CHAT':
        return (
          <View style={[styles.customMessageView, styles.customMessageViewStopChat]}>
            <Text style={styles.customText}>{text}</Text>
          </View>
        );
        break;
      default:
        break;
    }
  };

  const renderBubble = ({
    child,
    message,
    nextMessageInGroup
  }) => {
    const borderRadius = 15;

    switch (message?.typeCustom) {
      case 'AGENT_STOP_CHAT':
        return (<View style={{overflow: 'hidden'}}>{child}</View>);
        break;
      case 'USER_MESSAGE':
      case 'AGENT_MESSAGE':
      default:
        return (
          <View
            style={{
              backgroundColor: user.id !== message.author.id ? '#ffffff' : styleConst.color.blue,
              borderBottomLeftRadius:
                !nextMessageInGroup && user.id !== message.author.id ? 0 : borderRadius,
              borderTopRightRadius: borderRadius,
              borderTopLeftRadius: borderRadius,
              borderBottomRightRadius:
                !nextMessageInGroup && user.id === message.author.id ? 0 : borderRadius,
              borderColor: styleConst.color.accordeonGrey2,
              borderWidth: 1,
              overflow: 'hidden',
            }}>{child}</View>
        )
        break;
    }
  }

  // PushNotifications.showLocalMessage({title: 'Новое сообщение в чате', message: 'Наш оператор ответил вам'});

  const getUserID = (userID) => {
    let senderID = md5(JSON.stringify(userID));
    if (userTmp.email) {
      senderID = md5(JSON.stringify(userTmp.email));
    }
    if (userTmp.phone) {
      senderID = md5(JSON.stringify(userTmp.phone));
    }
    senderID = senderID.toLowerCase();

    return senderID;
  }

  const updateChat = useCallback((senderID) => { // история чата

    PushNotifications.addTag('ChatID', 'AtlantAPI_' + senderID);
    let isSubscribedInitChatData = true;

    API.chatData(senderID).then(res => {
      if (!isSubscribedInitChatData) {
        return false;
      }
      let messagesTmp = [];
      let historyMessages = get(res, 'data', false);
      if (!historyMessages) {
        historyMessages = [];
      }
      historyMessages.map(val => {
        let userIDFinal, userAvatar, messageText, userName = null;
        let messageType = 'text';
        switch (val.message.type) {
          case 'USER_MESSAGE':
            userIDFinal = senderID;
            userAvatar = get(profile, 'login.UF_CRM_1639655792');
            messageText = val.message.text;
            break;
          case 'AGENT_MESSAGE':
            userIDFinal = userAtlantM.id;
            userAvatar = userAtlantM.imageUrl;
            messageText = val.message.text;
            break;
          case 'AGENT_STOP_CHAT':
            userIDFinal = userAtlantM.id;
            userAvatar = userAtlantM.imageUrl;
            messageType = 'custom';
            messageText = val.message.text;
            break;
        }
        let textMessage = {
          author: {
            id: userIDFinal,
            firstName: val.user.name,
            email: val.user.email,
            imageUrl: userAvatar,
          },
          createdAt: val.date*1000,
          id: val.message.id,
          text: messageText,
          type: messageType,
          typeCustom: val.message.type,
        };
        if (textMessage.typeCustom !== 'AGENT_STOP_CHAT') { // todo: Убрать когда включим служебные оповещения
          messagesTmp.push(textMessage);
        }
        updateMessages(messagesTmp);
      });
      setLoadingHistory(false);
    });
    return () => {
      isSubscribedInitChatData = false;
      PushNotifications.removeTag('ChatID');
      if (chatSocket && chatSocket.readyState !== WebSocket.CLOSED) {
        chatSocket.close();
      }
    }
  }, [user]);

  useEffect(() => {
    PushNotifications.deviceState().then(res => {
        const senderID = getUserID(res.userId);
        setUser({id: senderID});
        actionChatIDSave(senderID);
        if (chatSocket && (chatSocket.readyState !== WebSocket.OPEN && chatSocket.readyState !== WebSocket.CONNECTING)) {
          chatSocket = connectSocket();
        }
        updateChat(senderID);
    });
    return () => {
      if (chatSocket && chatSocket.readyState !== WebSocket.CLOSED) {
        chatSocket.close();
      }
    };
  }, []);

  const updateMessages = (messages) => { // обновление истории чата из API
    const filteredData = removeDuplicates(messages, 'id');
    setMessages(filteredData);
  }

  const addMessageToList = (message) => { // добавление сообщение в переписку
    const messagesToAdd = [message, ...messages];
    const filteredData = removeDuplicates(messagesToAdd, 'id');
    setMessages(filteredData);
  }

  const addUserMessage = (message) => {
    let messageToSend = {
        "action" : "onMessage" , 
        "body": {
            "user": userTmp, 
            "message": {
                "text": message.text
            }
        }
    };

    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify(messageToSend));
    } else {
        // console.warn('chatSocket.readyState', chatSocket.readyState);
    }
    addMessageToList(message);
  };

  const handleSendPress = (message) => {
    const userData = {
      id: user.id,
      firstName: userTmp.name,
    }
    const textMessage = {
      author: userData,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    };
    addUserMessage(textMessage);
  };

  if (loadingSocket || loadingHistory || !user) {
    return (
      <View style={{marginTop: '30%'}}>
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
          size={'large'}
        />
        <View style={{alignItems: 'center', marginTop: 20,}}>
          <Text style={{fontFamily: styleConst.font.light, color: styleConst.color.greyText3}}>подключаемся к чату</Text>
        </View>
      </View>
    );
  }

  return (
    // todo: Убрать когда включим служебные оповещения
    <View style={{marginTop: 50, flex: 1}}>
    <Chat
      messages={messages}
      onSendPress={handleSendPress}
      user={user}
      showUserAvatars={true}
      showUserNames={true}
      enableAnimation={true}
      // renderBubble={renderBubble}
      renderTextMessage={renderTextMessage}
      renderCustomMessage={renderCustomMessage}
      locale='ru'
      theme={{
        ...defaultTheme,
        colors: {
          ...defaultTheme.colors,
          inputBackground: styleConst.color.darkBg,
          primary: styleConst.color.blue,
        },
      }}
    />
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);