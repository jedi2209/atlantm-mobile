import {StyleSheet} from 'react-native';

// helpers
import styleConst from '../../style-const';
import {verticalScale} from '../../../utils/scale';

const iconLeftSize = 28;

export default StyleSheet.create({
  input: {
    lineHeight: null, // после обновления 0.54, фикс выравнивания
  },
  list: {
    marginTop: verticalScale(28),
  },
  label: {
    color: '#000',
    fontSize: 18,
    marginTop: 10,
    fontFamily: styleConst.font.regular,
  },
  bodyWithLeftGap: {
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  inputItem: {
    borderBottomWidth: 0,
    minHeight: styleConst.ui.listHeight,
    justifyContent: 'space-between',
  },
  listItemContainer: {
    backgroundColor: styleConst.color.white,
  },
  listItemContainerFirst: {
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.systemGray,
  },
  listItem: {
    borderWidth: 0,
    borderBottomWidth: 0,
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
    marginLeft: 10,
  },
});
