import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
  } from 'react-native';



import {actionChatSend} from '../actions';

import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui';
import {connect} from 'react-redux';
import PushNotifications from '../../core/components/PushNotifications';
import API from '../../utils/api';

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
  authorText: {
    color: 'black',
    fontSize: 16,
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
  customMessageView: {
    padding: 0,
  },
  customMessageViewStopChat: {
    paddingBottom: 8,
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
  actionChatSend
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

const intervalSecondsMini = 20;
const intervalMiliSeconds = intervalSecondsMini * 100;

const ChatScreen = ({dealer, profile, actionChatSend, session}) => {
  const [messages, setMessages] = useState([]);
  const [chatStart, setChatStart] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const interval = useRef();
  const userAtlantM = {
    id: '06c33e8b-e835-4736-80f4-63f44b66666c',
    firstName: 'Атлант-М',
    name: 'Атлант-М',
    avatarUrl: 'https://cdn.atlantm.com/logo/Blue-square-256.png',
  };

  const userTmp = {
    "name": [get(profile, 'login.NAME', get(profile, 'name')), get(profile, 'login.LAST_NAME', null)].join(' '),
    "avatarUrl": get(profile, 'login.UF_CRM_1639655792'),
    // "URL": "https://www.yandex.ru/",
    "phone": get(profile, 'login.PHONE[0].VALUE', get(profile, 'phone')),
    "email": get(profile, 'login.EMAIL[0].VALUE', get(profile, 'email')),
  };

  const renderTextMessage = ({author, createdAt, id, text, type}) => {
    if (author?.firstName) { // ответ Атлант-М
      return (
        <View style={styles.textMessageView}>
          <Text style={styles.authorName}>{author?.firstName}</Text>
          <Text style={styles.authorText}>{text}</Text>
        </View>
      );
    }
    return (
      <View style={styles.textMessageView}>
        <Text style={styles.messageText}>{text}</Text>
      </View>
    );
  };

  const renderCustomMessage = ({author, createdAt, id, text, type, typeCustom}) => {
    switch (typeCustom) {
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

  const initChatData = (session, userID, isSubscribed = true) => {
    if (!session) {
      setLoading(false);
      return false;
    }
    PushNotifications.addTag('ChatID', session);
    API.chatData(session).then(res => {
      if (!isSubscribed) {
        return false;
      }
      let messagesTmp = messages;
      // if (get(res, 'data', []).length > messagesTmp.length) {
      //   PushNotifications.showLocalMessage({title: 'Новое сообщение в чате', message: 'Наш оператор ответил вам'});
      // }
      get(res, 'data', []).map(val => {
        let userIDFinal, userAvatar, messageText = null;
        let messageType = 'text';
        switch (val.message.type) {
          case 'USER_MESSAGE':
            userIDFinal = get(user, 'id', userID);
            userAvatar = get(profile, 'login.UF_CRM_1639655792');
            messageText = val.message.text;
            break;
          case 'AGENT_MESSAGE':
            userIDFinal = userAtlantM.id;
            userAvatar = userAtlantM.avatarUrl;
            messageText = val.message.text;
            break;
          case 'AGENT_STOP_CHAT':
            userIDFinal = userAtlantM.id;
            userAvatar = userAtlantM.avatarUrl;
            messageType = 'custom';
            messageText = val.message.text;
            break;
        }
        const textMessage = {
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
      });
      updateMessages(messagesTmp);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
  };

  useEffect(() => {
    PushNotifications.deviceState().then(res => {
      setUser({id: res.userId});
      updateChat(res.userId);
    });
    return () => {
    }
  }, []);

  const updateChat = useCallback((userID) => {
    let isSubscribedInitChatData = true;
    initChatData(session, userID, isSubscribedInitChatData);
    return () => {
      isSubscribedInitChatData = false;
      PushNotifications.removeTag('ChatID');
    }
  }, [user]);

  useEffect(() => {
    let isSubscribedInterval = true;
    if (chatStart) {
      interval.current = setInterval(() => {
        initChatData(session, isSubscribedInterval);
      }, intervalMiliSeconds);
    }
    return () => {
      isSubscribedInterval = false;
      PushNotifications.removeTag('ChatID');
      if (interval && interval.current) {
        clearInterval(interval.current);
      }
    }
  }, [chatStart]);

  const updateMessages = (messages) => {
    const filteredData = removeDuplicates(messages, 'id');
    filteredData.reverse();
    setMessages(filteredData);
  }

  const addMessage = (message) => {
    actionChatSend({user: userTmp, message, session});
    const messagesToAdd = [message, ...messages];
    messagesToAdd.reverse();
    setChatStart(true);
    updateMessages(messagesToAdd);
  };

  const handleSendPress = (message) => {
    const textMessage = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    };
    addMessage(textMessage);
  };

  if (loading || !user) {
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
      // renderTextMessage={renderTextMessage}
      // renderCustomMessage={renderCustomMessage}
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