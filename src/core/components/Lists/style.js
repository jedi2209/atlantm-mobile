import { StyleSheet } from 'react-native';

// helpers
import styleConst from '../../style-const';
import { verticalScale } from '../../../utils/scale';

const iconLeftSize = 28;

export default StyleSheet.create({
  list: {
    marginTop: verticalScale(28),
  },
  label: {
    color: '#000',
    fontSize: 18,
    fontFamily: styleConst.font.regular,
  },
  bodyWithLeftGap: {
    marginLeft: 10,
  },
  inputItem: {
    borderBottomWidth: 0,
    minHeight: styleConst.ui.listHeight,
    justifyContent: 'flex-start',
  },
  listItemContainer: {
    backgroundColor: '#fff',
  },
  listItemContainerFirst: {
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.border,
  },
  listItem: {
    minHeight: styleConst.ui.listHeight,
  },
  listItemReset: {
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  listItemPressable: {
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: styleConst.ui.listHeight,
  },
  listItemValue: {
    fontSize: 17,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  listItemValueContainer: {
    flex: 2.5,
  },
  iconArrow: {
    color: styleConst.color.systemGray,
    marginLeft: styleConst.ui.horizontalGap,
  },
  iconArrowWithText: {
    marginLeft: 0,
  },
  iconLeft: {
    width: iconLeftSize,
    height: iconLeftSize,
  },
  badgeText: {
    color: styleConst.color.greyText3,
    fontSize: 17,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    marginLeft: 10,
  },
});
