import {StyleSheet, Platform} from 'react-native';

// helpers
import styleConst from '@core/style-const';
import {verticalScale} from '@utils/scale';

const isAndroid = Platform.OS === 'android';

export default StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
    paddingBottom: isAndroid
      ? styleConst.ui.footerHeightAndroid
      : styleConst.ui.footerHeightIphone
    // paddingEnd: styleConst.footerHeight
  },
  gallery: {
    position: 'relative',
  },
  titleContainer: {
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: styleConst.color.header,
  },
  title: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingLeft: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    fontSize: 20,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  section: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    paddingBottom: styleConst.ui.horizontalGap,
    marginLeft: styleConst.ui.horizontalGap,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
  },
  tabContent: {
    marginBottom: styleConst.ui.footerHeight,
  },
  descrContainer: {
    padding: styleConst.ui.horizontalGap,
  },
  descr: {
    lineHeight: 18,
  },
  sectionTitle: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 18,
    fontFamily: styleConst.font.regular,
    marginBottom: 10,
  },
  sectionRow: {
    marginBottom: 8,
  },
  sectionProp: {
    paddingRight: 5,
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 15,
    color: styleConst.color.greyText5,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 15,
    color: styleConst.color.greyText6,
  },
  sectionTitleValue: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.light,
    fontSize: 16,
    color: styleConst.color.greyText4,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    height: styleConst.ui.footerHeight,
    flex: 1,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  orderPriceText: {
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  orderPriceDefaultText: {
    fontSize: 19,
  },
  orderPriceSmallText: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    flex: 1,
    flexDirection: 'row',
  },
  orderPriceSpecialText: {
    color: styleConst.color.red,
    fontSize: 19,
    marginTop: 2,
  },
  segment: {
    marginTop: isAndroid ? 0 : styleConst.ui.horizontalGap,
    marginHorizontal: styleConst.ui.horizontalGap,
  },
  tabText: {
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.greyBlueText,
  },
  tabTextActive: {
    color: '#fff',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  tabButton: {
    borderColor: styleConst.color.greyBlue,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
  tabButtonActive: {
    backgroundColor: styleConst.color.greyBlue,
    borderColor: styleConst.color.greyBlue,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 0,
    paddingRight: 0,
  },
  spinnerContainer: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  iconArrow: {
    fontSize: 20,
    color: styleConst.color.greyBlueText,
    marginTop: 3,
    marginLeft: 3,
  },
  dealerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  mapCard: {},
  mapCardContainer: {
    marginBottom: 14,
    marginHorizontal: 15,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: styleConst.color.border,
  },
  mapCardTitle: {
    color: '#a8abbe',
    fontSize: 12,
    fontWeight: '600',
  },
  mapCardDealer: {
    color: '#2a2a43',
    fontSize: 14,
    fontWeight: '600',
  },
  mapCardIcon: {
    fontSize: 40,
    marginRight: 5,
    color: styleConst.color.blue,
  },
  mapCardTextContainer: {
    justifyContent: 'space-around',
  },
});
