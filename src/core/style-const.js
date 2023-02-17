import {PixelRatio, Dimensions} from 'react-native';
import {verticalScale} from '../utils/scale';

export default {
  color: {
    blue: '#0061ED',
    lightBlue: '#027aff',
    green: '#34BD78',
    green2: '#4cd864',
    orange: '#FFA51D',
    bg: '#F8F8F8',
    white: '#ffffff',
    accordeonGrey1: '#ededed',
    accordeonGrey2: '#dedfe0',
    greyText: 'rgba(97,110,122,1)',
    greyText2: 'rgba(128,128,128,1)',
    greyText3: 'rgba(102,102,102,1)',
    greyText4: 'rgba(51,51,51,1)',
    greyText5: '#a8abbe',
    greyText6: '#757575',
    greyText7: '#808080',
    greyBlue: '#616e7a',
    greyBlueText: '#a8b0b7',
    select: '#fafafa',
    systemBlue: '#007aff',
    systemGray: '#c7c7c7',
    red: '#CC2936',
    purple: '#31081F',
    darkBg: '#4f5b66',
  },
  screen: Dimensions.get('window'),
  spinner: {
    alignSelf: 'center',
  },
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
  form: {
    scrollView: {
      flex: 1,
      backgroundColor: '#eee',
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
  new: {
    // TODO: reeemmaee to bluee
    blueHeader: '#027aff',
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
  text: {
    bigHead: {
      color: '#222B45',
      fontSize: 48,
      lineHeight: 50,
      fontWeight: 'bold',
      fontFamily: 'HelveticaNeue-Medium',
      marginHorizontal: 10,
      marginBottom: 5,
    },
  },
  button: {
    footer: {
      wrapper: {
        height: 85,
        borderTopWidth: 0,
        marginHorizontal: '5%',
        width: '90%',
        backgroundColor: 'rgba(0,0,0,0)',
        marginBottom: 20,
        position: 'absolute',
        bottom: 0,
        flex: 1,
        flexDirection: 'column',
        zIndex: 10,
      },
      footerButtons: {
        flex: 1,
        flexDirection: 'row',
      },
      button: {
        width: '50%',
        height: 40,
        borderWidth: 1,
      },
      buttonLeft: {
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
      },
      buttonRight: {
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
      },
    },
  },
  animation: {
    zoomIn: {
      1: {
        opacity: 1,
        scale: 1,
      },
      0.5: {
        opacity: 0.5,
        scale: 0.4,
      },
      0: {
        opacity: 0,
        scale: 0,
      },
    },
    opacityIn: {
      1: {
        opacity: 1,
      },
      0.5: {
        opacity: 0.5,
      },
      0: {
        opacity: 0,
      },
    },
  },
  safearea: {
    default: {
      flex: 1,
      position: 'relative',
      backgroundColor: '#F8F8F8',
    },
  },
};

// fonts: https://github.com/react-native-training/react-native-fonts
