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
// import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import WebView from 'react-native-webview';

import * as NavigationService from '../../navigation/NavigationService';

import {actionChatIDSave} from '../actions';

import moment from 'moment';
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
};

let template = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
        <title>Чат</title>
        <script>
          window.jivo_chat_page = true;
        </script>
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
}) => {
  const [data, setData] = useState(null);
  const mainRef = useRef(null);
  const [userCustomData, setUserCustomData] = useState('');
  const [userData, setUserData] = useState('');
  const [pageInfo, setPageInfo] = useState('');
  const [userToken, setUserToken] = useState('');
  const [senderID, setSenderID] = useState(null);

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
        .then(token => setUserToken(`jivo_api.setUserToken('${token}');`))
        .catch(message => console.error('JWT chat token sign error', message)); // possible errors
    }

    if (route?.params?.prevScreen) {
      setPageInfo(`jivo_api.sendPageTitle('${route?.params?.prevScreen}');`);
    }
  }, []);

  useEffect(() => {
    console.info('useEffect route?.params?.uri');
    setData({uri: route.params.uri});
  }, [route?.params?.uri]);

  useEffect(() => {
    console.info('useEffect profile?.login');

    let carLink = '';
    if (route.params?.car) {
      carLink = `, "link": "${route.params?.car?.link}"`;
    }

    if (profile?.login) {
      setUserData(`
        jivo_api.setContactInfo({
          name: "${userTmp.name}",
          email: "${userTmp.email}",
          phone: "${userTmp.phone}",
          description: ""
        });`);

      setUserCustomData(`jivo_api.setCustomData([
          {
            "key": "ЕБДК ID",
            "content": "${profile?.login?.SAP.ID}"
          },
          {
            "key": "Экран",
            "content": "${route?.params?.prevScreen}"${carLink}
          },
          {
            "title": "Действия",
            "content": "Посмотреть контакт в CRM",
            "link": "https://bitrix.atlantm.com/crm/contact/details/${profile?.login.ID}/"
          }
        ]);`);
    } else {
      setUserCustomData(`jivo_api.setCustomData([
          {
            "key": "Экран",
            "content": "${route?.params?.prevScreen}"${carLink}
          }
        ]);`);
    }
  }, [profile?.login]);

  useEffect(() => {
    console.info('useEffect userData, userCustomData, pageInfo, userToken');
    const jsOnloadCallback = `
      function jivo_onLoadCallback() {
        ${userData}
        ${userCustomData}
        ${pageInfo}
        ${userToken}
      }`;
    const html = template.replace('##JScontent##', jsOnloadCallback);
    console.info('html', html);
    setData({html});
  }, [userData, userCustomData, pageInfo, userToken]);

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
            sharedCookiesEnabled={true}
            allowsLinkPreview={true}
            startInLoadingState={true}
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
