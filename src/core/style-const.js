import {PixelRatio, Platform, Dimensions} from 'react-native';
const isAndroid = Platform.OS === 'android';

export default {
  color: {
    blue: '#0061ED',
    lightBlue: '#027aff',
    green: '#34BD78',
    orange: '#FFA51D',
    bg: '#F6F6F6',
    accordeonGrey1: '#ededed',
    accordeonGrey2: '#dedfe0',
    greyText: 'rgba(97,110,122,1)',
    greyText2: 'rgba(128,128,128,1)',
    greyText3: 'rgba(102,102,102,1)',
    greyText4: 'rgba(51,51,51,1)',
    greyText5: '#a8abbe',
    greyText6: '#757575',
    greyBlue: '#616e7a',
    greyBlueText: '#a8b0b7',
    header: '#f7f7f8',
    select: '#fafafa',
    border: '#c7c7c7',
    systemBlue: '#007aff',
    systemGray: '#c7c7c7',
    // green: '#4cd864',
    red: '#ff3c30',
    darkBg: '#4f5b66',
  },
  screen: Dimensions.get('window'),
  shadow: {
    default: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,
      elevation: 9,
    },
    light: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  font: {
    regular: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
    light: 'HelveticaNeue-Light',
  },
  ui: {
    // хак чтобы в новой версии native-base футер прижимался к низу
    footerHeight: 15,
    footerHeightIphone: 50,
    footerHeightAndroid: 50,
    borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    horizontalGap: 10,
    horizontalGapInList: 14,
    verticalGap: 22,
    letterSpacing: -0.3,
    listHeight: 44,
    smallTextSize: 15,
  },
  headerBackButton: {
    ContainerStyle: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      paddingHorizontal: isAndroid ? 5 : 0,
      paddingVertical: isAndroid ? 10 : 0,
      borderRadius: 20,
      marginLeft: 5,
      marginTop: isAndroid ? 5 : 0,
      zIndex: 1000,
    },
    IconStyle: {
      marginLeft: isAndroid ? 5 : 0,
      zIndex: 1000,
    },
  },
  new: {
    // TODO: reeemmaee to bluee
    blueHeader: '#0F66B2',
    passive: '#757575',
    shadowActive: {
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
    menu: {
      active: {
        backgroundColor: '#0061ED',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 10,
      },
      default: {
        backgroundColor: 'transparent',
        elevation: 0,
      },
    },
  },
};

// fonts: https://github.com/react-native-training/react-native-fonts
