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
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE_OUTLINE}
          buttonType={AppleButton.Type.SIGN_IN}
          cornerRadius={5}
          {...propsData}
          style={[styles.SocialLoginBt, styles.buttonApple, style]}
          onPress={() => Apple.signIn(onPress)}
        />
      );
    case 'google':
      return (
        <IconButton
          _icon={{
            as: FontAwesome5,
            name: 'google',
            size: 7,
            color: styleConst.color.white,
          }}
          shadow={3}
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
            size: 8,
            color: styleConst.color.white,
          }}
          shadow={3}
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
  colorVK: {
    backgroundColor: '#4680C2',
  },
  buttonApple: {
    justifyContent: 'space-between',
    height: 45,
  },
});
