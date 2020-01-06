import {StyleSheet} from 'react-native';

import styleConst from '../../style-const';
import isIPhoneX from '@utils/is_iphone_x';

export default StyleSheet.create({
  footer: {
    height: isIPhoneX()
      ? styleConst.ui.footerHeightIphone
      : styleConst.ui.footerHeightAndroid,
    // flexDirection: 'row',
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
    // position: 'absolute',
    // bottom: 0,
    // marginBottom: 0,
    backgroundColor: styleConst.color.bg,
    borderTopWidth: 0,
  },
  footerFilters: {
    //paddingBottom: isIPhoneX() ? 10 : 0,
  },
  button: {
    height: styleConst.ui.footerHeightAndroid,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: styleConst.color.lightBlue,
    // bottom: isIPhoneX() ? styleConst.ui.footerHeight : 0,
  },
  orderPriceContainer: {
    height: styleConst.ui.footerHeightAndroid,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
    backgroundColor: styleConst.color.header,
    // bottom: isIPhoneX() ? styleConst.ui.footerHeight : 0,
  },
  orderPriceContainerNotSale: {
    flexDirection: 'row',
  },
  content: {
    marginBottom: 20,
  },
});
