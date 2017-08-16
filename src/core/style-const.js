import { PixelRatio } from 'react-native';

export default {
  color: {
    blue: '#0458a7',
    lightBlue: '#157efa',
    bg: 'rgba(240,243,245,1)',
    greyText: 'rgba(97,110,122,1)',
    greyText2: 'rgba(128,128,128,1)',
    greyText3: 'rgba(102,102,102,1)',
    greyText4: 'rgba(51,51,51,1)',
    header: '#f7f7f8',
    select: '#c8dffa',
    border: '#c7c7c7',
    systemBlue: '#007aff',
    systemGray: '#c7c7c7',
  },
  font: {
    regular: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
    light: 'HelveticaNeue-Light',
  },
  ui: {
    borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    horizontalGap: 11,
    verticalGap: 22,
    letterSpacing: -0.3,
  },
};

// fonts: https://github.com/react-native-training/react-native-fonts
