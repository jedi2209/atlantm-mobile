import {StyleSheet, Platform} from 'react-native';

// helpers
import styleConst from '../core/style-const';
import {verticalScale} from '../utils/scale';

const isAndroid = Platform.OS === 'android';

export default StyleSheet.create({
  safearea: {
    flex: 1,
    position: 'relative',
    // backgroundColor: styleConst.color.bg,
    // backgroundColor: 'transparent',
  },
  gallery: {
    marginTop: 0,
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
  sectionOptions: {
    paddingBottom: styleConst.ui.horizontalGap,
  },
  tabContent: {
    marginBottom: styleConst.ui.footerHeight,
  },
  descrContainer: {
    padding: styleConst.ui.horizontalGap,
  },
  descr: {
    lineHeight: 18,
    fontFamily: styleConst.font.light,
  },
  sectionTitle: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 16,
    fontFamily: styleConst.font.regular,
    marginBottom: 10,
  },
  sectionRow: {
    marginBottom: 0,
  },
  sectionProp: {
    paddingRight: 5,
    width: '60%',
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 15,
    color: styleConst.color.greyText5,
  },
  sectionValue: {
    width: '40%',
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
    textTransform: 'uppercase',
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
    fontSize: 18,
  },
  orderPriceSmallText: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    flex: 1,
    flexDirection: 'row',
  },
  orderPriceSpecialText: {
    color: '#D0021B',
    fontSize: 19,
    marginTop: 2,
  },
  segment: {
    marginTop: isAndroid ? 0 : styleConst.ui.horizontalGap,
    marginHorizontal: '2%',
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
    marginHorizontal: '2%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: styleConst.color.border,
  },
  mapCardTitle: {
    color: '#a8abbe',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: styleConst.font.regular,
  },
  mapCardDealer: {
    color: '#2a2a43',
    fontSize: 14,
    fontWeight: '400',
    width: '95%',
    fontFamily: styleConst.font.regular,
  },
  mapCardIcon: {
    fontSize: 40,
    marginRight: 5,
    color: styleConst.color.blue,
  },
  mapCardTextContainer: {
    justifyContent: 'space-around',
    flex: 1,
  },
  ShowFullDescriptionButton: {
    paddingVertical: 7,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.regular,
    fontStyle: 'italic',
  },
  bodyButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '110%',
    // marginHorizontal: '2%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodyButton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 0,
    width: '45%',
    marginBottom: 10,
  },
  bodyButtonIcon: {
    fontSize: 28,
    width: '20%',
  },
  bodyButtonText: {
    fontSize: 15,
    fontFamily: styleConst.font.light,
    textAlign: 'center',
    width: '80%',
  },
});
