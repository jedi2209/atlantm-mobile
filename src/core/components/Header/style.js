import {StyleSheet} from 'react-native';

import styleConst from '../../style-const';

const commonStyles = {
  borderBottomWidth: 0.5,
  borderBottomColor: styleConst.color.border,
  shadowRadius: null,
  shadowOpacity: null,
  shadowOffset: null,
  shadowColor: null,
  left: 0,
  right: 0,
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
    backgroundColor: styleConst.color.header,
  },
  resetBorder: {
    borderBottomWidth: 0,
  },
  headerStyle: {
    // height: 20,
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
  blueHeader: {
    ...commonStyles,
    backgroundColor: styleConst.new.blueHeader,
    borderBottomWidth: 0,
  },
  transparentHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.new.blueHeader,
  },
  blueHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: '#fff',
  },
  whiteHeader: {
    ...commonStyles,
    backgroundColor: '#fff',
    color: styleConst.new.blueHeader,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
    borderBottomWidth: 0,
    shadowColor: 'transparent',
  },
  whiteHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.new.blueHeader,
  },
});
