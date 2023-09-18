import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, View} from 'native-base';
import {connect} from 'react-redux';
import {sign} from 'react-native-pure-jwt';
import Orientation from 'react-native-orientation-locker';

import PushNotifications from '../../core/components/PushNotifications';
import {store} from '../../core/store';
import WebView from 'react-native-webview';
import LogoLoader from '../../core/components/LogoLoader';

import * as NavigationService from '../../navigation/NavigationService';

import {actionChatIDSave, saveCookies} from '../actions';

import {get} from 'lodash';
import md5 from '../../utils/md5';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';
import {JIVO_CHAT} from '../../core/const';

const deviceHeight = Dimensions.get('window').height;
const isAndroid = Platform.OS === 'android';

const mapStateToProps = ({dealer, profile, contacts}) => {
  return {
    region: dealer.region,
    profile,
    session: contacts.chat.id,
  };
};

const mapDispatchToProps = {
  actionChatIDSave,
  saveCookies,
};

let template = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
        <title>Чат</title>
        <script src="https://code.jivo.ru/widget/${JIVO_CHAT.chatID}" async></script>
        <script>
          ##JScontent##
        </script>
    </head>
    <body></body>
</html>`;

const ChatScreen = ({route, SubmitButton, profile, session, saveCookies}) => {
  const [data, setData] = useState(null);
  const mainRef = useRef(null);
  const [userToken, setUserToken] = useState('');
  const [senderID, setSenderID] = useState(null);
  const [cookies, setCookies] = useState('');

  const userTmp = {
    id: session,
    name: [
      get(profile, 'login.NAME', get(profile, 'name')),
      get(profile, 'login.LAST_NAME', null),
    ].join(' '),
    avatarUrl: get(profile, 'login.UF_CRM_1639655792'),
    phone: get(profile, 'login.PHONE[0].VALUE', get(profile, 'phone')),
    email: get(profile, 'login.EMAIL[0].VALUE', get(profile, 'email')),
  };

  useEffect(() => {
    Orientation.lockToPortrait();
    console.info('== ChatScreen ==');
    let userID = get(userTmp, 'id');
    if (userID === null || userID === undefined) {
      let senderIDNew = getUserID(PushNotifications.getUserID());
      setSenderID(senderIDNew);
      actionChatIDSave(senderIDNew);
      makeUserToken(senderIDNew);
    } else {
      makeUserToken(userID);
    }
    loadCookies();
  }, []);

  useEffect(() => {
    setData({uri: route?.params?.uri});
  }, [route?.params?.uri]);

  useEffect(() => {
    const userID = get(profile, 'login.ID', '');
    const ebdk = get(profile, 'login.SAP.ID', '');
    const pageName = get(route, 'params.prevScreen', '');
    const urlJivo =
      JIVO_CHAT.chatPage +
      '?' +
      new URLSearchParams({
        userID,
        ebdk,
        userToken,
        userDevice: PushNotifications.getUserID(),
        utm_source: 'mobile',
        utm_campaign: 'chat',
        pageName,
      });
    setData({uri: urlJivo});
  }, [profile, route, userToken]);

  const loadCookies = async () => {
    const cookie = await get(store.getState(), 'contacts.chat.cookies');
    if (cookie) {
      setCookies(cookie);
    }
  };

  const handleCookies = event => {
    if (!event.nativeEvent?.data) {
      return;
    }
    const data = JSON.parse(event.nativeEvent.data);
    if (typeof data.type === 'undefined') {
      return;
    }
    switch (data.type) {
      case 'cookieData':
        const cookiesArray = data.data.split(';');
        const cookiesToSave = cookiesArray.reduce((acc, cookie) => {
          const [name, value] = cookie.split('=');
          if (!name || !value || value === 'undefined') {
            return false;
          }
          acc += `${name}=${value};`;
          return acc;
        }, '');
        if (cookiesToSave) {
          saveCookies(cookiesToSave); // save cookies to ActiveStorage
          setCookies(cookiesToSave); // set cookies to WebView
        }
        break;
      case 'action':
        if (data.data === 'close') {
          NavigationService.goBack();
        }
        break;
      case 'newMessage':
        console.info('newMessage', data);
        break;
    }
    return;
  };

  const makeUserToken = userID => {
    sign(
      {
        id: userID,
      }, // body
      JIVO_CHAT.secret, // secret
      {
        alg: 'HS256',
        typ: 'JWT',
      },
    )
      .then(token => setUserToken(token))
      .catch(message => console.error('JWT chat token sign error', message)); // possible errors
  };

  const getUserID = userID => {
    let senderID = md5(JSON.stringify(userID));
    if (userTmp.email) {
      senderID = md5(JSON.stringify(userTmp.email));
    }
    if (userTmp.phone) {
      senderID = md5(JSON.stringify(userTmp.phone));
    }
    senderID = senderID.toLowerCase();

    return senderID;
  };

  if (data) {
    return (
      <View
        style={[
          {backgroundColor: styleConst.color.white},
          route.params?.mainViewStyle,
        ]}
        flex={1}>
        <KeyboardAvoidingView
          ref={mainRef}
          behavior={'padding'}
          enabled={!isAndroid}
          style={[styles.mainView, route.params?.mainScrollViewStyle]}>
          <WebView
            style={[styles.webView, route.params?.webViewStyle]}
            key={'session_' + session}
            source={data}
            thirdPartyCookiesEnabled={true}
            allowsLinkPreview={true}
            startInLoadingState={false}
            onMessage={handleCookies}
            injectedJavaScript="window.ReactNativeWebView.postMessage(JSON.stringify({type: 'cookieData', data: document.cookie}))"
            sharedCookiesEnabled={true}
            javaScriptEnabled={true}
            minHeight={
              route.params?.minHeight
                ? route.params?.minHeight
                : isAndroid
                ? 'auto'
                : deviceHeight - 170
            }
          />
        </KeyboardAvoidingView>
        <Button
          style={styles.submitButton}
          onPress={() => NavigationService.goBack()}>
          {SubmitButton.text}
        </Button>
      </View>
    );
  } else {
    return <LogoLoader />;
  }
};

ChatScreen.defaultProps = {
  SubmitButton: {
    text: strings.ModalView.close,
  },
};

const styles = StyleSheet.create({
  submitButton: {
    marginBottom: isAndroid ? 10 : 35,
    marginHorizontal: 10,
  },
  mainView: {
    paddingHorizontal: 0,
    flex: 1,
    paddingBottom: isAndroid ? 5 : 25,
    backgroundColor: styleConst.color.white,
  },
  webView: {
    backgroundColor: styleConst.color.white,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
