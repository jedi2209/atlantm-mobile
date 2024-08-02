import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'native-base';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import Apple from '../auth/Apple';
import Google from '../auth/Google';
import VK from '../auth/VK';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import styleConst from '../../core/style-const';

export const SocialAuthButton = (
  {type = '', onPress = () => {}, style},
  props,
) => {
  let propsData = props;
  delete propsData?.style;

  switch (type.toLowerCase()) {
    case 'apple':
      if (!appleAuth.isSupported) {
        return;
      }
      return (
        <IconButton
          onPress={() => Apple.signIn(onPress)}
          _icon={{
            as: FontAwesome5,
            name: 'apple',
            size: 12,
            color: styleConst.color.white,
            style: {marginLeft: 9, marginBottom: 3},
          }}
          {...propsData}
          style={[styles.SocialLoginBt, styles.colorApple, style]}
        />
      );
    case 'google':
      return (
        <IconButton
          _icon={{
            as: FontAwesome5,
            name: 'google',
            size: 10,
            color: styleConst.color.white,
            style: {marginLeft: 3},
          }}
          {...propsData}
          style={[styles.SocialLoginBt, styles.colorGoogle, style]}
          onPress={() => Google.signIn(onPress)}
        />
      );
    case 'vk':
      return (
        <IconButton
          _icon={{
            as: FontAwesome5,
            name: 'vk',
            size: 12,
            color: styleConst.color.white,
          }}
          {...propsData}
          style={[styles.SocialLoginBt, styles.colorVK, style]}
          onPress={() => VK.signIn(onPress)}
        />
      );

    default:
      return <></>;
  }
};

const styles = StyleSheet.create({
  SocialLoginBt: {
    marginVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 5,
  },
  colorGoogle: {
    backgroundColor: '#4286F5',
  },
  colorApple: {
    backgroundColor: '#000000',
  },
  colorVK: {
    backgroundColor: '#4680C2',
  },
  buttonApple: {
    justifyContent: 'space-between',
    height: 45,
  },
});
