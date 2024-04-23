import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {Button, View, ScrollView} from 'native-base';

import WebViewAutoHeight from '../../core/components/WebViewAutoHeight';
import * as NavigationService from '../../navigation/NavigationService';

import moment from 'moment';
import styleConst from '../style-const';
import {strings} from '../lang/const';

const WebviewScreen = ({
  route,
  SubmitButton = {
    text: strings.ModalView.close,
  },
}) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.info('== WebviewScreen ==');
    if (route.params?.html) {
      setData({html: route.params.html});
    }
    if (route.params?.uri) {
      setData({uri: route.params.uri});
    }
  }, [route?.params?.html, route?.params?.uri]);

  if (data) {
    return (
      <View flex={1} backgroundColor={styleConst.color.white}>
        <ScrollView
          style={[styles.mainView, route.params?.mainScrollViewStyle]}>
          <WebViewAutoHeight
            style={[styles.webView, route.params?.webViewStyle]}
            key={moment().unix()}
            source={data}
            {...route.params?.linkParams}
          />
        </ScrollView>
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

const styles = StyleSheet.create({
  submitButton: {
    bottom: 35,
    position: 'absolute',
    width: '90%',
    left: '5%',
  },
  mainView: {
    flex: 1,
    paddingBottom: 25,
    backgroundColor: styleConst.color.white,
  },
  webView: {
    backgroundColor: styleConst.color.white,
    paddingBottom: 25,
    marginBottom: 75,
  },
});

export default WebviewScreen;
