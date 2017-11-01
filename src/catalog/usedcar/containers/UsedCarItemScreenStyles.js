import React from 'react';
import { StyleSheet } from 'react-native';
import styleConst from '../../../core/style-const';
import { verticalScale } from '../../../utils/scale';

const FOOTER_HEIGHT = 50;
export default StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
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
    color: styleConst.color.greyText,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 15,
  },
  sectionTitleValue: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.light,
    fontSize: 18,
    color: styleConst.color.greyText4,
  },
  button: {
    backgroundColor: styleConst.color.lightBlue,
    height: FOOTER_HEIGHT,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  orderPriceContainer: {
    height: FOOTER_HEIGHT,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: styleConst.ui.header,
  },
  orderPriceText: {
    fontFamily: styleConst.font.regular,
    fontSize: 19,
    letterSpacing: styleConst.ui.letterSpacing,
    color: '#000',
  },
  footer: {
    height: FOOTER_HEIGHT,
    backgroundColor: '#fff',
  },
  segment: {
    marginHorizontal: styleConst.ui.horizontalGap,
  },
  tabText: {
    color: styleConst.color.greyBlueText,
  },
  tabTextActive: {
    color: '#fff',
  },
  tabButton: {
    borderColor: styleConst.color.greyBlue,
    flex: 1,
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: styleConst.color.greyBlue,
    borderColor: styleConst.color.greyBlue,
    flex: 1,
    justifyContent: 'center',
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
    justifyContent: 'space-between',
  },
});
