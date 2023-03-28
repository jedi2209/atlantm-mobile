import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import {Button, View} from 'native-base';
import {connect} from 'react-redux';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import WebView from 'react-native-webview';
import * as NavigationService from '../../navigation/NavigationService';

import moment from 'moment';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const deviceHeight = Dimensions.get('window').height;

const mapStateToProps = ({dealer, profile}) => {
  return {
    region: dealer.selected.region,
  };
};

const WebviewScreen = ({route, region, SubmitButton, minHeight}) => {
  const [data, setData] = useState(null);
  const mainRef = useRef(null);

  useEffect(() => {
    console.info('== WebviewScreen ==');
    if (route.params?.uri) {
      setData({uri: route.params.uri});
    }
  }, [route?.params?.uri]);

  if (data) {
    return (
      <View style={[route.params?.mainViewStyle]} flex={1}>
        <KeyboardAwareScrollView
          ref={mainRef}
          enableOnAndroid={true}
          extraScrollHeight={30}
          behavior="position"
          style={[styles.mainView, route.params?.mainScrollViewStyle]}>
          <WebView
            style={[styles.webView, route.params?.webViewStyle]}
            key={moment().unix()}
            source={data}
            minHeight={
              route.params?.minHeight
                ? route.params?.minHeight
                : deviceHeight - 150
            }
          />
        </KeyboardAwareScrollView>
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

WebviewScreen.defaultProps = {
  SubmitButton: {
    text: strings.ModalView.close,
  },
};

const styles = StyleSheet.create({
  submitButton: {
    marginBottom: 35,
    marginHorizontal: 10,
  },
  mainView: {
    paddingHorizontal: 0,
    flex: 1,
    paddingBottom: 25,
    backgroundColor: styleConst.color.bg,
  },
  webView: {
    backgroundColor: styleConst.color.bg,
  },
});

export default connect(mapStateToProps)(WebviewScreen);
