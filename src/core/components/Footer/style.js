import {StyleSheet} from 'react-native';

import styleConst from '../../style-const';

export default StyleSheet.create({
  footer: {
    height: 50,
    backgroundColor: styleConst.color.bg,
    borderTopWidth: 0,
  },
  footerFilters: {},
  button: {
    height: styleConst.ui.footerHeightAndroid,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: styleConst.color.lightBlue,
  },
  orderPriceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
    backgroundColor: styleConst.color.bg,
  },
  orderPriceContainerNotSale: {
    flexDirection: 'row',
  },
  content: {
    marginBottom: 20,
  },
});
