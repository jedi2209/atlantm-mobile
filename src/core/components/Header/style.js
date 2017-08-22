import React from 'React';
import { StyleSheet } from 'react-native';

import styleConst from '../../style-const';

export default StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '600',
    alignSelf: 'center',
    alignItems: 'center',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  common: {
    backgroundColor: styleConst.color.header,
    borderBottomWidth: 0.5,
    borderBottomColor: styleConst.color.border,
    shadowRadius: null,
    shadowOpacity: null,
    shadowOffset: null,
    shadowColor: null,
    left: 0,
    right: 0,
  },
});
