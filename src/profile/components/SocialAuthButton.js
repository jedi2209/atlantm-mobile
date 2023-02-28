import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, HStack, Icon, IconButton, useToast} from 'native-base';
import {
  appleAuth,
  AppleButton,
} from '@invertase/react-native-apple-authentication';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
          style={[styles.SocialLoginBt, styles.buttonApple, extStyle]}
          {...propsData}
        />
      );
    case 'facebook':
      return (
        <IconButton
          _icon={{
            as: FontAwesome5,
            name: 'facebook',
            size: 10,
            color: 'white',
          }}
          shadow={3}
          style={[styles.SocialLoginBt, styles.colorFacebook, extStyle]}
          {...propsData}
        />
      );
    case 'google':
      return (
        <IconButton
          _icon={{
            as: FontAwesome5,
            name: 'google',
            size: 7,
            color: 'white',
          }}
          shadow={3}
          style={[styles.SocialLoginBt, styles.colorGoogle, extStyle]}
          {...propsData}
        />
      );
    case 'vk':
      return (
        <IconButton
          _icon={{
            as: FontAwesome5,
            name: 'vk',
            size: 8,
            color: 'white',
          }}
          shadow={3}
          style={[styles.SocialLoginBt, styles.colorVK, extStyle]}
          {...propsData}
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
