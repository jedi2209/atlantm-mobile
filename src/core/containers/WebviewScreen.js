import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {Button, View, ScrollView} from 'native-base';

import WebViewAutoHeight from '../../core/components/WebViewAutoHeight';
import * as NavigationService from '../../navigation/NavigationService';

import moment from 'moment';
import styleConst from '../style-const';
import {strings} from '../lang/const';
import {get} from 'lodash';

const Wrapper = ({scrollEnabled = false, ...otherProps}) => {
  if (scrollEnabled) {
    return <ScrollView {...otherProps} />;
  }
  return <View {...otherProps} />;
};

const WebviewScreen = ({
  route,
  routeParams = route?.params,
  SubmitButton = {
    text: strings.ModalView.close,
  },
}) => {
  const [data, setData] = useState(null);
  const scrollEnabled = get(routeParams, 'linkParams.scrollEnabled', false);

  useEffect(() => {
    console.info('== WebviewScreen ==');
    let tmp = {};
    if (get(routeParams, 'html')) {
      tmp = {
        html: get(routeParams, 'html'),
      };
    }
    if (get(routeParams, 'uri')) {
      tmp = {
        uri: get(routeParams, 'uri'),
      };
    }
    setData(tmp);
  }, [routeParams]);

  if (data) {
    return (
      <View flex={1} backgroundColor={styleConst.color.white}>
        <Wrapper
          style={[!scrollEnabled ? {marginBottom: 85} : {}, styles.mainView, get(routeParams, 'mainScrollViewStyle', {})]}>
          <WebViewAutoHeight
            style={[styles.webView, get(routeParams, 'webViewStyle')]}
            key={moment().unix()}
            source={data}
            {...get(routeParams, 'linkParams')}
          />
        </Wrapper>
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
    bottom: 30,
    position: 'absolute',
    width: '86%',
    left: '7%',
  },
  mainView: {
    flex: 1,
    backgroundColor: styleConst.color.white,
  },
  webView: {
    backgroundColor: styleConst.color.white,
    paddingBottom: 15,
    marginBottom: 85,
  },
});

export default WebviewScreen;
