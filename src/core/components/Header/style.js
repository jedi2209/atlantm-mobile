import React from 'React';
import { StyleSheet } from 'react-native';

import styleConst from '../../style-const';

export default StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '600',
    alignSelf: 'center',
    fontFamily: styleConst.font.regular,
  },
  common: {
    backgroundColor: styleConst.color.header,
    borderBottomWidth: 0.5,
    borderBottomColor: '#b2b2b2',
    shadowRadius: null,
    shadowOpacity: null,
    shadowOffset: null,
    shadowColor: null,
  },
});
