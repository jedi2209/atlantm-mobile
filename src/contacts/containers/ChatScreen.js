import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, View} from 'native-base';
import {connect} from 'react-redux';
import {sign} from 'react-native-pure-jwt';

import PushNotifications from '../../core/components/PushNotifications';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {store} from '../../core/store';
// import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import WebView from 'react-native-webview';

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
    region: dealer.selected.region,
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

const ChatScreen = ({
  route,
  region,
  SubmitButton,
  minHeight,
  profile,
  session,
  saveCookies,
}) => {
  const [data, setData] = useState(null);
  const mainRef = useRef(null);
  const [userCustomData, setUserCustomData] = useState('');
  const [userData, setUserData] = useState('');
  const [pageInfo, setPageInfo] = useState('');
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
    console.info('== ChatScreen ==');
    let userID = get(userTmp, 'id');
    if (userID === null || userID === undefined) {
      PushNotifications.deviceState().then(res => {
        let senderIDNew = getUserID(res.userId);
        setSenderID(senderIDNew);
        actionChatIDSave(senderIDNew);
        userID = senderIDNew;
      });
    }
    if (userID && userID !== null && userID !== undefined) {
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
    }
    loadCookies();
  }, []);

  useEffect(() => {
    console.info('useEffect route?.params?.uri');
    setData({uri: route.params.uri});
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
        utm_source: 'mobile',
        utm_campaign: 'chat',
        pageName,
      });
    console.info('urlJivo', urlJivo);
    setData({uri: urlJivo});
  }, [profile, route, userToken]);

  // useEffect(() => {
  //   console.info('useEffect profile?.login');

  //   let carLink = '';
  //   if (route.params?.car) {
  //     carLink = `, "link": "${route.params?.car?.link}"`;
  //   }

  //   if (profile?.login) {
  //     setUserData(`
  //       jivo_api.setContactInfo({
  //         name: "${userTmp.name}",
  //         email: "${userTmp.email}",
  //         phone: "${userTmp.phone}",
  //         description: ""
  //       });`);

  //     setUserCustomData(`jivo_api.setCustomData([
  //         {
  //           "key": "ЕБДК ID",
  //           "content": "${profile?.login?.SAP.ID}"
  //         },
  //         {
  //           "key": "Экран",
  //           "content": "${route?.params?.prevScreen}"${carLink}
  //         },
  //         {
  //           "title": "Действия",
  //           "content": "Посмотреть контакт в CRM",
  //           "link": "https://bitrix.atlantm.com/crm/contact/details/${profile?.login.ID}/"
  //         }
  //       ]);`);
  //   } else {
  //     setUserCustomData(`jivo_api.setCustomData([
  //         {
  //           "key": "Экран",
  //           "content": "${route?.params?.prevScreen}"${carLink}
  //         }
  //       ]);`);
  //   }
  // }, [profile?.login]);

  // useEffect(() => {
  //   console.info('useEffect userData, userCustomData, pageInfo, userToken');
  //   const jsOnloadCallback = `
  //     function jivo_onLoadCallback() {
  //       ${userData}
  //       ${userCustomData}
  //       ${pageInfo}
  //       ${userToken}
  //       jivo_api.open({start: 'chat'});
  //     }`;
  //   const html = template.replace('##JScontent##', jsOnloadCallback);
  //   setData({html});
  // }, [userData, userCustomData, pageInfo, userToken]);

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
          saveCookies(cookiesToSave);
          setCookies(cookiesToSave);
        }
        break;
      case 'action':
        if (data.data === 'close') {
          NavigationService.goBack();
        }
        break;
    }
    return;
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
          // behavior={isAndroid ? 'padding' : 'position'}
          // behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          behavior={'padding'}
          style={[styles.mainView, route.params?.mainScrollViewStyle]}>
          <WebView
            style={[styles.webView, route.params?.webViewStyle]}
            key={'session_' + session}
            source={data}
            thirdPartyCookiesEnabled={true}
            allowsLinkPreview={true}
            startInLoadingState={true}
            onMessage={handleCookies}
            injectedJavaScript="window.ReactNativeWebView.postMessage(JSON.stringify({type: 'cookieData', data: document.cookie}))"
            sharedCookiesEnabled={true}
            javaScriptEnabled={true}
            renderLoading={() => (
              <View flex={1} alignContent={'center'} justifyContent={'center'}>
                <ActivityIndicator
                  color={styleConst.color.blue}
                  style={styleConst.spinner}
                />
              </View>
            )}
            minHeight={
              route.params?.minHeight
                ? route.params?.minHeight
                : isAndroid
                ? deviceHeight - 80
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
    return (
      <View flex={1} alignContent={'center'} justifyContent={'center'}>
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      </View>
    );
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
