import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
    View,
    ActivityIndicator,
    Text,
  } from 'react-native';

import {actionChatSend} from '../actions';

import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui';
import {connect} from 'react-redux';
import PushNotifications from '../../core/components/PushNotifications';
import API from '../../utils/api';

import styleConst from '../../core/style-const';
import { get } from 'lodash';

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
  const userAtlantM = { id: '06c33e8b-e835-4736-80f4-63f44b66666c', firstName: 'Атлант-М22', name: 'Атлант-М' };

  const userTmp = {
    "name": get(profile, 'login.NAME', get(profile, 'name')),
    "avatarUrl": get(profile, 'login.UF_CRM_1639655792'),
    // "URL": "https://www.yandex.ru/",
    "phone": get(profile, 'login.PHONE[0].VALUE', get(profile, 'phone')),
    "email": get(profile, 'login.EMAIL[0].VALUE', get(profile, 'email')),
  };

  const renderTextMessage = ({message}) => {
    console.log('data', message);
    return (<View style={{height: 50, width: 100}}><Text style={{color: 'black', fontSize: 20}}>{message}</Text></View>);
  };

  const renderBubble = ({
    child,
    message,
    nextMessageInGroup
  }) => {
    return (
      <View
        style={{
          backgroundColor: user.id !== message.author.id ? '#ffffff' : '#1d1c21',
          borderBottomLeftRadius:
            !nextMessageInGroup && user.id !== message.author.id ? 20 : 0,
          borderBottomRightRadius:
            !nextMessageInGroup && user.id === message.author.id ? 20 : 0,
          borderColor: '#1d1c21',
          borderWidth: 1,
          overflow: 'hidden',
        }}
      >
        {child}
      </View>
    )
  }

  const initChatData = (session, userID, isSubscribed = true) => {
    if (!session) {
      setLoading(false);
      return false;
    }
    API.chatData(session).then(res => {
      if (!isSubscribed) {
        return false;
      }
      let messagesTmp = messages;
      get(res, 'data', []).map(val => {
        let userIDFinal = null;
        switch (val.message.type) {
          case 'USER_MESSAGE':
            userIDFinal = get(user, 'id', userID);
            break;
          case 'AGENT_MESSAGE':
            userIDFinal = userAtlantM.id;
            break;
        }
        const textMessage = {
          author: {
            id: userIDFinal,
            firstName: val.user.name,
            email: val.user.email,
          },
          createdAt: val.date*1000,
          id: val.message.id,
          text: val.message.text,
          type: 'text',
        };
        messagesTmp.push(textMessage);
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
    return () => (isSubscribedInitChatData = false)
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
    <View style={{marginTop: 50, flex: 1}}>
    <Chat
      messages={messages}
      onSendPress={handleSendPress}
      user={user}
      showUserAvatars={false}
      showUserNames={true}
      enableAnimation={true}
      // renderBubble={renderBubble}
      // renderTextMessage={renderTextMessage}
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