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
  blueHeader: {
    ...commonStyles,
    backgroundColor: styleConst.new.blueHeader,
    borderBottomWidth: 0,
    color: 'red',
  },
  blueHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: '#fff',
  },});
