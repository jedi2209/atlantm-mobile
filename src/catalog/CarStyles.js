import {StyleSheet, Platform} from 'react-native';

// helpers
import styleConst from '../core/style-const';
import {verticalScale} from '../utils/scale';

const isAndroid = Platform.OS === 'android';

export default StyleSheet.create({
  gallery: {
    marginTop: 0,
  },
  titleContainer: {
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: styleConst.color.bg,
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
    borderBottomColor: styleConst.color.systemGray,
  },
  sectionOptions: {
    paddingBottom: styleConst.ui.horizontalGap,
  },
  tabContent: {
    marginBottom: styleConst.ui.footerHeight,
  },
  descrContainer: {
    padding: styleConst.ui.horizontalGap,
    marginBottom: 10,
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
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
    fontSize: 14,
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
    color: styleConst.color.white,
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
    marginBottom: 10,
    flexDirection: 'row',
    backgroundColor: styleConst.color.white,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: styleConst.color.systemGray,
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
  additionalServiceIcon: {
    fontSize: 24,
    marginLeft: 0,
    marginRight: 5,
    color: styleConst.color.blue,
  },
  additionalServiceText: {
    color: styleConst.color.greyText4,
    fontFamily: styleConst.font.regular,
    lineHeight: 22,
  },
  bodyButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
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
    width: '40%',
    marginBottom: 10,
  },
  bodyButtonLeft: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderEndColor: styleConst.color.red,
    borderTopColor: styleConst.color.red,
    borderBottomColor: styleConst.color.red,
    borderLeftWidth: 0,
  },
  bodyButtonRight: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    borderStartColor: styleConst.color.blue,
    borderTopColor: styleConst.color.blue,
    borderBottomColor: styleConst.color.blue,
    borderRightWidth: 0,
  },
  bodyButtonIcon: {
    fontSize: 28,
    width: '15%',
  },
  bodyButtonIconLeft: {
    color: styleConst.color.red,
    fontSize: 26,
  },
  bodyButtonIconRight: {
    color: styleConst.color.blue,
  },
  bodyButtonText: {
    fontSize: 15,
    fontFamily: styleConst.font.light,
    textAlign: 'center',
    width: '85%',
  },
  bodyButtonTextLeft: {
    color: styleConst.color.red,
    paddingLeft: '5%',
  },
  bodyButtonTextRight: {
    color: styleConst.color.blue,
    paddingRight: '5%',
  },
  colorboxWrapper: {
    position: 'absolute',
    width: '100%',
    zIndex: 20,
  },
  colorboxContainer: {
    position: 'absolute',
    right: 10,
    top: 190,
    zIndex: 1000,
    padding: 20,
  },
  badgesView: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 5,
    top: 220,
    zIndex: 1000,
  },
  accordion: {
    borderBottomColor: '#d5d5e0',
    borderBottomWidth: 1,
  },
  accordionHeader: {
    height: 64,
    paddingHorizontal: '2%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: styleConst.color.white,
    borderTopWidth: 0.75,
    borderColor: '#d5d5e0',
  },
  accordionHeaderTitle: {
    fontSize: 18,
    color: styleConst.color.greyText,
  },
  accordionContent: {
    backgroundColor: styleConst.color.white,
    paddingHorizontal: '3%',
  },
  carTopWrapper: {
    position: 'relative',
    backgroundColor: styleConst.color.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 14,
    zIndex: 30,
    marginHorizontal: 10,
  },
  modelBrandView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
  },
  modelBrandText: {
    fontSize: 16,
    fontWeight: '600',
    color: styleConst.color.greyText,
  },
  complectationText: {
    fontSize: 11,
    fontWeight: '600',
    color: styleConst.color.greyText2,
  },
  platesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: '2%',
    marginBottom: 10,
  },
  plateUsed: {
    borderRadius: 10,
    backgroundColor: '#0061ED',
    paddingHorizontal: 12,
    marginRight: 8,
    height: 52,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateUsedText: {
    color: '#d8d8d8',
    fontSize: 14,
    fontWeight: '300',
    paddingBottom: 5,
  },
  plateUsedText2: {
    color: styleConst.color.white,
    fontSize: 14,
    fontWeight: '600',
  },
  itemCallButton: {
    height: 40,
    width: '48%',
    justifyContent: 'center',
  },
  iconButtonSm: {
    marginRight: 5,
    marginLeft: 0,
  },
  iconTextSm: {
    fontSize: 16,
    color: styleConst.color.white,
  },
  itemOrderCall: {
    backgroundColor: styleConst.color.greyBlue,
  },
  itemOrderCallBack: {
    backgroundColor: styleConst.color.green,
  },
  warrantyView: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '2%',
    paddingRight: '4%',
    marginBottom: 10,
    marginTop: 5,
  },
  warrantyIcon: {
    color: styleConst.color.green,
    fontSize: 32,
    marginTop: -4,
    marginRight: 5,
  },
  warrantyText: {
    paddingTop: 2,
    paddingRight: 2,
    fontSize: 15,
    color: styleConst.color.darkBg,
  }
});
