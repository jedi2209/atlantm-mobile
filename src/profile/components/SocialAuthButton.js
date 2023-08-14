import React from 'react';
import {StyleSheet} from 'react-native';
import {IconButton} from 'native-base';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import Apple from '../auth/Apple';
import Facebook from '../auth/Facebook';
import Google from '../auth/Google';
import VK from '../auth/VK';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import styleConst from '../../core/style-const';

export const SocialAuthButton = props => {
  const extStyle = props.style;
  let propsData = props;
  delete propsData?.style;

  switch (props.type.toLowerCase()) {
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
          style={[styles.SocialLoginBt, styles.buttonApple, extStyle]}
          onPress={() => Apple.signIn(props.onPress)}
        />
      );
    case 'facebook':
      return (
        <IconButton
          _icon={{
            as: FontAwesome5,
            name: 'facebook',
            size: 10,
            color: styleConst.color.white,
          }}
          shadow={3}
          {...propsData}
          style={[styles.SocialLoginBt, styles.colorFacebook, extStyle]}
          onPress={() => Facebook.signIn(props.onPress)}
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
          style={[styles.SocialLoginBt, styles.colorGoogle, extStyle]}
          onPress={() => Google.signIn(props.onPress)}
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
          style={[styles.SocialLoginBt, styles.colorVK, extStyle]}
          onPress={() => VK.signIn(props.onPress)}
        />
      );

    default:
      return <></>;
  }
};

SocialAuthButton.defaultProps = {
  type: '',
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
  colorFacebook: {
    backgroundColor: '#4167B2',
  },
  colorVK: {
    backgroundColor: '#4680C2',
  },
  buttonApple: {
    justifyContent: 'space-between',
    height: 45,
  },
});
