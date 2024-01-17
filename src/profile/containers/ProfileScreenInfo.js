/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import UserCars from '../components/UserCars';
import {Button, HStack, Icon, View, Fab, Text, ScrollView} from 'native-base';

import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import PushNotifications from '../../core/components/PushNotifications';
// import RefreshSpinner from '../../core/components/RefreshSpinner';

// redux
import {connect} from 'react-redux';
import {
  getProfileSapData,
  actionLogout,
  connectSocialMedia,
  actionToggleCar,
} from '../actions';
import {actionSetPushActionSubscribe} from '../../core/actions';

import Analytics from '../../utils/amplitude-analytics';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.lightBlue,
    paddingRight: styleConst.ui.horizontalGapInList,
    flex: 1,
    flexDirection: 'row',
  },
  buttonIcon: {
    fontSize: 30,
    marginRight: 10,
    color: styleConst.color.lightBlue,
    paddingLeft: styleConst.ui.horizontalGapInList,
  },
  buttonPrimary: {
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: styleConst.color.lightBlue,
  },
  buttonPrimaryText: {
    color: styleConst.color.white,
    fontSize: 16,
    fontWeight: 'normal',
  },
  BonusInfoButton: {
    height: 45,
    marginVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginHorizontal: 20,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  BonusInfoButtonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 15,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.lightBlue,
    paddingRight: styleConst.ui.horizontalGapInList,
  },
  BonusInfoButtonIcon: {
    marginRight: 2,
  },
  bonusButtonWrapper: {
    marginHorizontal: 20,
    marginBottom: 8,
  },
  bonusButtonView: {
    backgroundColor: styleConst.color.blue,
    padding: 14,
    display: 'flex',
    flexDirection: 'row',
  },
  additionalPurchaseView: {
    backgroundColor: styleConst.color.green2,
    marginTop: 10,
    padding: 14,
    display: 'flex',
    flexDirection: 'row',
  },
  bonusButtonTextView: {
    backgroundColor: styleConst.color.white,
    width: 98,
    height: 98,
    borderRadius: 49,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  additionalPurchaseButtonTextView: {
    backgroundColor: styleConst.color.white,
    width: 78,
    height: 78,
    borderRadius: 49,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 34,
    marginLeft: 10,
  },
});

import {verticalScale} from '../../utils/scale';
import {get} from 'lodash';
import {dayMonthYear} from '../../utils/date';
import LogoLoader from '../../core/components/LogoLoader';
import RNBounceable from '@freakycoder/react-native-bounceable';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    region: dealer.region,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,

    isFetchProfileData: profile.meta.isFetchProfileData,

    cars: profile.cars,
    login: profile.login,
    password: profile.password,
    isLoginRequest: profile.meta.isLoginRequest,

    bonus: profile.bonus,
    discounts: profile.discounts,
    insurance: profile.insurance,
    additionalPurchase: profile.additionalPurchase,
    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const mapDispatchToProps = {
  actionLogout,
  actionSetPushActionSubscribe,
  getProfileSapData,
  connectSocialMedia,
  actionToggleCar,
};

const ProfileScreenInfo = props => {
  const {region, login, navigation, insurance, additionalPurchase, bonus} =
    props;
  const [loading, setLoading] = useState(false);

  // const fabEnable = region === 'by' ? true : false;
  const fabEnable = false;

  useEffect(() => {
    Analytics.logEvent('screen', 'profile/main');
  }, []);

  useEffect(() => {
    if (login?.ID) {
      _getUserData();
    }
  }, [login?.ID]);

  const _getUserData = () => {
    setLoading(true);
    const {ID, SAP} = login;

    let curr = null;

    switch (region.toLowerCase()) {
      case 'by':
        curr = 'BYN';
        break;
      case 'ru':
        curr = 'RUB';
        break;
      case 'ua':
        curr = 'UAH';
        break;
    }

    props
      .getProfileSapData({
        id: ID,
        sap: SAP,
        curr: curr,
      })
      .then(() => {
        if (SAP && SAP.ID && SAP.ID.length > 0) {
          PushNotifications.addTag('sapID', SAP.ID);
          PushNotifications.setExternalUserId(SAP.ID);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('getUserData ERROR', err);
        props.actionLogout();
      });
  };

  const _renderCars = () => {
    if (props.cars && props.cars.length > 0) {
      return _renderCarsData();
    } else {
      return _renderCarsNoData();
    }
  };

  const _renderCarsData = () => <UserCars />;

  const _renderCarsNoData = () => {
    return (
      <>
        <View
          rounded={'lg'}
          style={[
            styleConst.shadow.default,
            styles.scrollViewInner,
            {
              display: 'flex',
              backgroundColor: '#979797',
              marginTop: 10,
              marginBottom: 10,
              marginLeft: 20,
              marginRight: 20,
              justifyContent: 'center',
              alignItems: 'center',
              height: 125,
            },
          ]}>
          <Text
            style={{
              textAlign: 'center',
              color: styleConst.color.white,
              fontSize: 18,
              paddingHorizontal: 20,
            }}>
            {strings.ProfileScreenInfo.empty.cars}
          </Text>
        </View>
      </>
    );
  };

  const _renderCashBack = () => {
    if (
      login &&
      login.CASHBACK &&
      (login.CASHBACK.STATUS.ID || login.CASHBACK.STATUS.NAME)
    ) {
      return (
        <RNBounceable style={styles.bonusButtonWrapper}>
          <View
            rounded={'lg'}
            style={[
              styleConst.shadow.default,
              styles.bonusButtonView,
              {
                backgroundColor: styleConst.color.greyBlue,
              },
            ]}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: styleConst.color.white,
                  fontSize: 18,
                  marginBottom: 8,
                  fontWeight: '600',
                }}>
                {strings.ProfileScreenInfo.cashback.title}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    color: styleConst.color.white,
                    fontSize: 12,
                    lineHeight: 24,
                    fontWeight: '600',
                  }}>
                  {strings.ProfileScreenInfo.cashback.statusText}
                </Text>
                <Text
                  style={{
                    color: styleConst.color.white,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {login?.CASHBACK?.STATUS?.NAME}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    color: styleConst.color.white,
                    fontSize: 12,
                    lineHeight: 24,
                    fontWeight: '600',
                  }}>
                  {strings.ProfileScreenInfo.cashback.deadline}
                </Text>
                <Text
                  style={{
                    color: styleConst.color.white,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {dayMonthYear(login?.CASHBACK?.DATE?.TO)}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.bonusButtonTextView,
                {width: 82, height: 82, marginLeft: 24, marginRight: 0},
              ]}>
              <Text
                style={{
                  color: styleConst.color.blue,
                  fontSize: 20,
                  fontWeight: '600',
                }}>
                {login?.CASHBACK?.PERCENT
                  ? parseFloat(login?.CASHBACK?.PERCENT, 'ru-RU') + ' %'
                  : 0}
              </Text>
            </View>
          </View>
        </RNBounceable>
      );
    }
    return <></>;
  };

  const _renderAdditionalPurchase = () => {
    if (
      (insurance && insurance.length) ||
      (additionalPurchase && additionalPurchase.length)
    ) {
      return (
        <RNBounceable
          style={styles.bonusButtonWrapper}
          onPress={() => navigation.navigate('AdditionalPurchaseScreen')}>
          <View
            rounded={'lg'}
            style={[styleConst.shadow.default, styles.additionalPurchaseView]}
            onPress={() => navigation.navigate('AdditionalPurchaseScreen')}>
            <View style={styles.additionalPurchaseButtonTextView}>
              <Icon as={Fontisto} name="shopping-bag-1" size={10} />
            </View>
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: styleConst.color.white,
                  fontSize: 18,
                  marginBottom: 8,
                  fontWeight: '600',
                }}>
                {strings.ProfileScreenInfo.additionalPurchase.title}
              </Text>
              <Text
                style={{
                  color: styleConst.color.white,
                  fontSize: 12,
                  marginBottom: 16,
                  fontWeight: '600',
                }}>
                {strings.ProfileScreenInfo.additionalPurchase.text}
              </Text>
            </View>
          </View>
        </RNBounceable>
      );
    }
    return <></>;
  };

  const _renderBonusSaldo = region => {
    let saldoValue = get(bonus, 'data.saldo.convert.value', null);
    if (!saldoValue) {
      saldoValue = get(bonus, 'data.saldo.value', 0);
    }

    let saldoCurr = get(
      bonus,
      'data.saldo.convert.curr',
      strings.ProfileScreenInfo.bonus.current.bonuses,
    );

    switch (region.toLowerCase()) {
      case 'by':
        return {
          saldoValue: saldoValue,
          saldoCurr: saldoCurr,
          saldoText: `1 ${strings.ProfileScreenInfo.bonus.current.bonus} = 1 BYN`,
        };
      case 'ru':
        return {
          saldoValue: saldoValue,
          saldoCurr: saldoCurr,
          saldoText: `1 ${strings.ProfileScreenInfo.bonus.current.bonus} = 1 RUR`,
        };
      case 'ua':
        return {
          saldoValue: saldoValue,
          saldoCurr: saldoCurr,
          saldoText: `1 ${strings.ProfileScreenInfo.bonus.current.bonus} = 1 UAH`,
        };
    }
  };

  const _renderBonus = () => {
    const bonusData = _renderBonusSaldo(region);
    if (bonus) {
      if (bonus.data && bonus.data.saldo) {
        return (
          <>
            <RNBounceable
              style={styles.bonusButtonWrapper}
              onPress={() => navigation.navigate('BonusScreen')}>
              <View
                rounded={'lg'}
                style={[styleConst.shadow.default, styles.bonusButtonView]}
                onPress={() => navigation.navigate('BonusScreen')}>
                <View style={styles.bonusButtonTextView}>
                  <Text
                    style={{
                      color: styleConst.color.blue,
                      fontSize: 20,
                      fontWeight: '600',
                    }}>
                    {bonusData.saldoValue
                      ? parseFloat(bonusData.saldoValue, 'ru-RU')
                      : 0}
                  </Text>
                  <Text
                    style={{
                      color: styleConst.color.greyText,
                      fontSize: 11,
                      fontWeight: '600',
                    }}>
                    {bonusData.saldoText}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: styleConst.color.white,
                      fontSize: 18,
                      marginBottom: 8,
                      fontWeight: '600',
                    }}>
                    {strings.ProfileScreenInfo.bonus.title}
                  </Text>
                  <Text
                    style={{
                      color: styleConst.color.white,
                      fontSize: 12,
                      marginBottom: 16,
                      fontWeight: '600',
                    }}>
                    {strings.ProfileScreenInfo.bonus.text}
                  </Text>
                  <HStack>
                    <View>
                      <Text
                        style={{
                          color: styleConst.color.white,
                          fontSize: 16,
                          fontWeight: '600',
                        }}
                        onPress={() => navigation.navigate('BonusScreen')}>
                        {strings.ProfileScreenInfo.bonus.show}
                      </Text>
                    </View>
                    <Icon
                      as={FontAwesome5}
                      size={3}
                      color={styleConst.color.white}
                      name="angle-right"
                      style={{
                        marginLeft: 8,
                      }}
                    />
                  </HStack>
                </View>
              </View>
            </RNBounceable>
            <Button
              onPress={() => {
                navigation.navigate('BonusScreenInfo', {
                  refererScreen: 'LoginScreen',
                  returnScreen: 'LoginScreen',
                });
              }}
              variant="link"
              _text={{numberOfLines: 1, style: styles.BonusInfoButtonText}}
              leftIcon={
                <Icon
                  name="info"
                  as={SimpleLineIcons}
                  size={5}
                  color={styleConst.color.lightBlue}
                  style={styles.BonusInfoButtonIcon}
                />
              }
              style={styles.BonusInfoButton}>
              {strings.Menu.main.bonus}
            </Button>
          </>
        );
      } else {
        return (
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate('BonusScreenInfo', {
                refererScreen: 'LoginScreen',
                returnScreen: 'LoginScreen',
              })
            }>
            <View
              style={[
                styleConst.shadow.default,
                {
                  marginHorizontal: 20,
                },
              ]}>
              <View
                rounded={'lg'}
                style={{
                  backgroundColor: styleConst.color.blue,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    backgroundColor: styleConst.color.white,
                    width: 98,
                    height: 98,
                    borderRadius: 49,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 24,
                  }}>
                  {bonus.data && bonus.data.saldo ? (
                    <Text
                      style={{
                        color: styleConst.color.blue,
                        fontSize: 20,
                        fontWeight: '600',
                      }}>
                      {bonus.data.saldo.value}
                    </Text>
                  ) : (
                    <Icon
                      name="frowno"
                      as={AntDesign}
                      size={20}
                      style={[{marginTop: 1}]}
                    />
                  )}
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: styleConst.color.white,
                      fontSize: 18,
                      marginBottom: 8,
                      fontWeight: '600',
                    }}>
                    {strings.ProfileScreenInfo.bonus.title}
                  </Text>
                  <Text
                    style={{
                      color: styleConst.color.white,
                      fontSize: 12,
                      marginBottom: 16,
                      fontWeight: '600',
                    }}>
                    {strings.ProfileScreenInfo.bonus.current.text}{' '}
                    <Text style={{fontWeight: 'bold', fontSize: 22}}>0</Text>{' '}
                    {strings.ProfileScreenInfo.bonus.current.text2}.{'\r\n'}
                    {strings.ProfileScreenInfo.bonus.current.text3}
                  </Text>
                  <HStack>
                    <View>
                      <Text
                        style={{
                          color: styleConst.color.white,
                          fontSize: 16,
                          fontWeight: '600',
                        }}>
                        {strings.ProfileScreenInfo.bonus.current.giveMeMore}
                      </Text>
                    </View>
                    <Icon
                      as={FontAwesome5}
                      color={styleConst.color.white}
                      size={6}
                      name="angle-right"
                      style={{
                        marginLeft: 8,
                      }}
                    />
                  </HStack>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      }
    }
    return <></>;
  };

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <View flex={1}>
      <ScrollView
        testID="ProfileScreen.Wrapper"
        contentContainerStyle={{paddingBottom: styleConst.menu.paddingBottom}}>
        <Text fontSize={32} mx={5} mt={70} color={styleConst.color.greyText6}>
          {[login.NAME, login.LAST_NAME].join(' ')}
        </Text>
        {_renderCars()}
        {_renderCashBack()}
        {_renderBonus()}
        {_renderAdditionalPurchase()}
        <Button
          onPress={() => {
            navigation.navigate('ProfileSettingsScreen');
          }}
          _text={styles.buttonPrimaryText}
          rounded={'lg'}
          style={[
            styleConst.shadow.default,
            styles.buttonPrimary,
            {backgroundColor: styleConst.color.green, marginTop: 20},
          ]}>
          {strings.ProfileScreenInfo.editData}
        </Button>
        <View style={{textAlign: 'center', alignItems: 'center'}}>
          <Button
            variant="link"
            mx={20}
            my={5}
            onPress={() => {
              props.actionLogout();
            }}
            _text={[
              styles.buttonPrimaryText,
              {
                color: styleConst.color.lightBlue,
              },
            ]}>
            {strings.ProfileScreenInfo.exit}
          </Button>
        </View>
      </ScrollView>
      {fabEnable ? (
        <Fab
          renderInPortal={false}
          size="sm"
          style={{backgroundColor: styleConst.new.blueHeader}}
          onPress={() =>
            navigation.navigate('ChatScreen', {
              prevScreen: 'ЛКК -- главный',
            })
          }
          icon={
            <Icon
              size={7}
              as={Ionicons}
              name="chatbox-outline"
              color="warmGray.50"
              _dark={{
                color: 'warmGray.50',
              }}
            />
          }
        />
      ) : null}
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreenInfo);
