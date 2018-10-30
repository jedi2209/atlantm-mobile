import { PixelRatio } from 'react-native';

export default {
  color: {
    blue: '#0458a7',
    lightBlue: '#027aff',
    bg: '#f0f3f5',
    accordeonGrey1: '#ededed',
    accordeonGrey2: '#dedfe0',
    greyText: 'rgba(97,110,122,1)',
    greyText2: 'rgba(128,128,128,1)',
    greyText3: 'rgba(102,102,102,1)',
    greyText4: 'rgba(51,51,51,1)',
    greyBlue: '#616e7a',
    greyBlueText: '#a8b0b7',
    header: '#f7f7f8',
    select: '#c8dffa',
    border: '#c7c7c7',
    systemBlue: '#007aff',
    systemGray: '#c7c7c7',
    green: '#4cd864',
    red: '#ff3c30',
    darkBg: '#4f5b66',
  },
  font: {
    regular: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
    light: 'HelveticaNeue-Light',
  },
  ui: {
    // хак чтобы в новой версии native-base футер прижимался к низу
    footerHeightIphone: 14,
    footerHeightAndroid: 50,
    borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    horizontalGap: 11,
    horizontalGapInList: 14,
    verticalGap: 22,
    letterSpacing: -0.3,
    footerHeight: 50,
    listHeight: 44,
    smallTextSize: 15,
  },
};

// fonts: https://github.com/react-native-training/react-native-fonts
