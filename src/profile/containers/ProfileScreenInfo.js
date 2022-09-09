/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';

import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import UserCars from '../components/UserCars';
import {Button, HStack, Icon, View} from 'native-base';

import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import PushNotifications from '../../core/components/PushNotifications';
import DealerItemList from '../../core/components/DealerItemList';

// redux
import {connect} from 'react-redux';
import {
  getProfileSapData,
  actionLogout,
  connectSocialMedia,
  actionToggleCar,
} from '../actions';
import {
  actionSetPushActionSubscribe,
  actionSetPushGranted,
} from '../../core/actions';

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
    borderRadius: 5,
    backgroundColor: styleConst.color.lightBlue,
  },
  buttonPrimaryText: {
    color: styleConst.color.white,
    fontSize: 16,
    fontWeight: 'normal',
  },
  BonusInfoButton: {
    height: 25,
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
    borderRadius: 5,
    padding: 14,
    display: 'flex',
    flexDirection: 'row',
  },
  additionalPurchaseView: {
    backgroundColor: styleConst.color.green2,
    borderRadius: 5,
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
import {yearMonthDay, dayMonthYear} from '../../utils/date';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    dealerSelected: dealer.selected,
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
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  getProfileSapData,
  connectSocialMedia,
  actionToggleCar,
};

class ProfileScreenInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      cars: 'default',
    };
  }

  componentDidMount() {
    if (this.props.login.ID) {
      this.getUserData();
    }

    Analytics.logEvent('screen', 'profile/main');
  }

  componentDidUpdate(nextProps) {
    if (this.props.login.ID && this.props.login.ID !== nextProps.login.ID) {
      this.getUserData();
    }

    if (
      this.props.login.SAP &&
      this.props.login.SAP.ID !==
        (nextProps.login.SAP ? nextProps.login.SAP.ID : null)
    ) {
      this.getUserData();
    }
  }

  getUserData() {
    this.setState({loading: true});
    const {ID, SAP} = this.props.login;
    const userRegion = get(this.props, 'dealerSelected.region', null);

    let curr = null;

    switch (userRegion.toLowerCase()) {
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

    this.props
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
        this.setState({loading: false});
      })
      .catch(err => {
        console.error('getUserData ERROR', err);
        this.props.actionLogout();
      });
  }

  renderCars = () => {
    if (this.props.cars && this.props.cars.length > 0) {
      return this.renderCarsData();
    } else {
      return this.renderCarsNoData();
    }
  };

  renderCarsData = () => (
    <UserCars activePanel={this.props.navigation.params?.activePanel} />
  );
  renderCarsNoData = () => {
    return (
      <>
        <View
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
              borderRadius: 5,
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
          <Button
            onPress={() => {
              this.props.navigation.navigate('ReestablishScreen');
            }}
            _text={[
              styles.buttonPrimaryText,
              {
                color: styleConst.color.white,
                fontSize: 14,
                fontStyle: 'italic',
                textDecorationStyle: 'dotted',
                textDecorationColor: styleConst.color.white,
                textDecorationLine: 'underline',
                shadowOpacity: 0,
                elevation: 0,
              },
            ]}
            style={[
              {
                position: 'absolute',
                backgroundColor: 'none',
                elevation: 0,
                bottom: 0,
                right: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
              },
            ]}>
            {strings.ProfileScreenInfo.empty.whereMyCars}
          </Button>
        </View>
      </>
    );
  };

  renderCashBack = () => {
    if (
      this.props.login &&
      this.props.login.CASHBACK &&
      (this.props.login.CASHBACK.STATUS.ID ||
        this.props.login.CASHBACK.STATUS.NAME)
    ) {
      return (
        <TouchableOpacity style={styles.bonusButtonWrapper}>
          <View
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
                  {this.props.login?.CASHBACK?.STATUS?.NAME}
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
                  {dayMonthYear(this.props.login?.CASHBACK?.DATE?.TO)}
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
                  color: '#0061ed',
                  fontSize: 20,
                  fontWeight: '600',
                }}>
                {this.props.login?.CASHBACK?.PERCENT
                  ? parseFloat(this.props.login?.CASHBACK?.PERCENT, 'ru-RU') +
                    ' %'
                  : 0}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return <></>;
  };

  renderAdditionalPurchase = () => {
    if (
      (this.props.insurance && this.props.insurance.length) ||
      (this.props.additionalPurchase && this.props.additionalPurchase.length)
    ) {
      return (
        <TouchableOpacity
          style={styles.bonusButtonWrapper}
          onPress={() =>
            this.props.navigation.navigate('AdditionalPurchaseScreen')
          }>
          <View
            style={[styleConst.shadow.default, styles.additionalPurchaseView]}
            onPress={() =>
              this.props.navigation.navigate('AdditionalPurchaseScreen')
            }>
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
        </TouchableOpacity>
      );
    }
    return <></>;
  };

  renderBonusSaldo = region => {
    let saldoValue = get(this.props.bonus, 'data.saldo.convert.value', null);
    if (!saldoValue) {
      saldoValue = get(this.props.bonus, 'data.saldo.value', 0);
    }

    let saldoCurr = get(
      this.props.bonus,
      'data.saldo.convert.curr',
      strings.ProfileScreenInfo.bonus.current.bonuses,
    );

    switch (region) {
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

  renderBonus = () => {
    const bonus = this.renderBonusSaldo(this.props.dealerSelected.region);
    if (this.props.bonus) {
      if (this.props.bonus.data && this.props.bonus.data.saldo) {
        return (
          <>
            <TouchableOpacity
              style={styles.bonusButtonWrapper}
              onPress={() => this.props.navigation.navigate('BonusScreen')}>
              <View
                style={[styleConst.shadow.default, styles.bonusButtonView]}
                onPress={() => this.props.navigation.navigate('BonusScreen')}>
                <View style={styles.bonusButtonTextView}>
                  <Text
                    style={{
                      color: styleConst.color.blue,
                      fontSize: 20,
                      fontWeight: '600',
                    }}>
                    {bonus.saldoValue
                      ? parseFloat(bonus.saldoValue, 'ru-RU')
                      : 0}
                  </Text>
                  <Text
                    style={{
                      color: styleConst.color.greyText,
                      fontSize: 11,
                      fontWeight: '600',
                    }}>
                    {bonus.saldoText}
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
                        onPress={() =>
                          this.props.navigation.navigate('BonusScreen')
                        }>
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
            </TouchableOpacity>
            <Button
              onPress={() => {
                this.props.navigation.navigate('BonusScreenInfo', {
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
              this.props.navigation.navigate('BonusScreenInfo', {
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
                style={{
                  backgroundColor: '#0061ed',
                  borderRadius: 5,
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
                  {this.props.bonus.data && this.props.bonus.data.saldo ? (
                    <Text
                      style={{
                        color: '#0061ed',
                        fontSize: 20,
                        fontWeight: '600',
                      }}>
                      {this.props.bonus.data.saldo.value}
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

  render() {
    return (
      <ScrollView style={{flex: 1}} testID="ProfileScreen.Wrapper">
        <Text
          style={{
            fontSize: 35,
            fontWeight: '600',
            marginHorizontal: 20,
            marginTop: 50,
            color: styleConst.color.greyText6,
          }}>
          {`${this.props.login.NAME || ''} ${this.props.login.LAST_NAME || ''}`}
        </Text>
        {this.state.loading ? (
          <ActivityIndicator
            color="#0061ED"
            style={{
              alignSelf: 'center',
              marginTop: verticalScale(60),
              marginBottom: verticalScale(60),
            }}
          />
        ) : (
          <>
            <DealerItemList
              key={'dealerSelect'}
              dealer={this.props.dealerSelected}
              style={[
                {
                  paddingHorizontal: 5,
                  paddingTop: 10,
                },
              ]}
              returnScreen={this.props.navigation.state?.routeName}
            />
            {this.renderCars()}
            {this.renderCashBack()}
            {this.renderBonus()}
            {this.renderAdditionalPurchase()}
            <Button
              onPress={() => {
                this.props.navigation.navigate('ProfileSettingsScreen');
              }}
              _text={styles.buttonPrimaryText}
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
                  this.props.actionLogout();
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
          </>
        )}
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreenInfo);
