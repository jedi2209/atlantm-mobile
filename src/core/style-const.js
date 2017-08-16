import { PixelRatio } from 'react-native';

export default {
  color: {
    blue: '#0458a7',
    lightBlue: '#157efa',
    bg: '#f0f3f5',
    greyText: 'rgba(97,110,122,1)',
    greyText2: 'rgba(128,128,128,1)',
    header: '#f7f7f8',
    select: '#c8dffa',
    border: '#b2b2b2',
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
  },
};

// fonts: https://github.com/react-native-training/react-native-fonts
