import {StyleSheet, Platform} from 'react-native';

import styleConst from '../../style-const';

const isAndroid = Platform.OS === 'android';

const commonStyles = {
  borderBottomWidth: 0.5,
  borderBottomColor: styleConst.color.systemGray,
  shadowRadius: null,
  shadowOpacity: null,
  shadowOffset: null,
  shadowColor: null,
};

const commonTitle = {
  fontSize: 17,
  fontWeight: '600',
  alignSelf: 'center',
  alignItems: 'center',
  fontFamily: styleConst.font.regular,
  letterSpacing: styleConst.ui.letterSpacing,
};

export default StyleSheet.create({
  title: commonTitle,
  common: {
    ...commonStyles,
    backgroundColor: styleConst.color.bg,
  },
  resetBorder: {
    borderBottomWidth: 0,
    shadowOpacity: 0,
    shadowColor: 'transparent',
  },
  headerStyle: {
    // height: 70,
  },
  headerTitleStyle: {
    marginTop: 0,
  },
  headerLeftStyle: {
    marginTop: 0,
  },
  headerRightStyle: {
    marginTop: 0,
  },
  headerRightButton: {
    marginRight: 20,
  },
  blueHeader: {
    ...commonStyles,
    backgroundColor: styleConst.color.lightBlue,
    borderBottomWidth: 0,
  },
  transparentHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    zIndex: 10000,
  },
  blueHeaderTitle: {
    fontSize: 16,
    fontWeight: '300',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.white,
  },
  whiteHeader: {
    ...commonStyles,
    // backgroundColor: styleConst.color.white,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    borderBottomWidth: 0,
    shadowColor: 'transparent',
  },
  whiteHeaderTitle: {
    // fontSize: 16,
    // fontWeight: '300',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    // color: styleConst.color.lightBlue,
  },
  headerBackButtonContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    marginLeft: 5,
    marginTop: 10,
    zIndex: 10000,
  },
  headerBackButtonIcon: {
    zIndex: 10000,
  },
});
