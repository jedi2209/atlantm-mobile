import React from 'react';
import { StyleSheet } from 'react-native';

// helpers
import styleConst from '../../style-const';

export default StyleSheet.create({
  label: {
    color: '#000',
    fontSize: 18,
    fontFamily: styleConst.font.regular,
  },
  inputItem: {
    borderBottomWidth: 0,
    minHeight: 44,
  },
  listItemContainer: {
    backgroundColor: '#fff',
  },
  listItem: {
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  listItemValue: {
    fontSize: 17,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    marginRight: styleConst.ui.horizontalGap,
  },
  listItemValueContainer: {
    flex: 2.5,
  },
  iconArrow: {
    color: styleConst.color.systemGray,
    marginTop: 3,
  },
});
