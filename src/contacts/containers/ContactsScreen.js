/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  View,
  Alert,
  StyleSheet,
  Platform,
  Linking,
  ScrollView,
  TouchableWithoutFeedback,

  // Linking,
} from 'react-native';
import {Text, StyleProvider, Icon, Button} from 'native-base';

// redux
import {connect} from 'react-redux';
import {callMe} from '../actions';
import {CALL_ME__SUCCESS, CALL_ME__FAIL} from '../actionTypes';

import {INFO_LIST__FAIL} from '../../info/actionTypes';
import {fetchInfoList, actionListReset} from '../../info/actions';

// components
import DeviceInfo from 'react-native-device-info';
import Communications from 'react-native-communications';

// helpers
import Amplitude from '@utils/amplitude-analytics';
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '@core/style-const';
import isInternet from '@utils/internet';
import {ERROR_NETWORK} from '@core/const';
import Carousel from 'react-native-snap-carousel';

const HEADER_MAX_HEIGHT = 406;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  imgHero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT + 70,
    resizeMode: 'cover',
  },
  blackBack: {
    height: 125,
    backgroundColor: '#000',
    opacity: 0.5,
  },
  address: {
    marginTop: -100,
    paddingHorizontal: 20,
    marginBottom: 15,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'row',
  },
  point: {
    // width: 28,
    // height: 28,
    fontSize: 22,
    marginTop: 3,
    marginRight: 10,
    // resizeMode: 'contain',
    color: '#fff',
  },
  addressText: {color: '#fff', fontSize: 16, lineHeight: 28, paddingRight: 20},
  scrollView: {paddingLeft: 20},
  scrollViewInner: {display: 'flex', flexDirection: 'row'},
  iconRow: {color: '#2E3A59', fontSize: 18, marginTop: 0},
  buttonPrimary: {
    marginTop: 60,
    marginHorizontal: 20,
    backgroundColor: '#EFEFEF',
    borderColor: '#2E3A59',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonPrimaryText: {
    color: '#2E3A59',
    fontSize: 16,
    fontWeight: 'normal',
  },
});

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 50;

const getColoCardByKind = kind => {
  switch (kind) {
    case 'default':
      return ['#07A9B0', '#7ED321'];
    case 'danger':
      return ['#990A0A', '#151526'];
    case 'primary':
      return ['#0950A1', '#7ED321'];
    case 'success':
      return ['#0C705D', '#151526'];
  }
};

/**
 * @param {object} props
 * @param {('default' | 'danger' | 'primary' | 'success')} props.kind Тип карточки.
 * @param {string} props.title Заголовок.
 * @param {string} props.subtitle Подзаголовок.
 * @param {function} props.onPress Обработчик по нажатию.
 */
const Card = ({kind, title, subtitle, onPress}) => {
  const [bgColor, dotBgColor] = getColoCardByKind(kind);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          backgroundColor: bgColor,
          marginRight: 10,
          padding: 10,
          width: 150,
          height: 98,
          borderRadius: 5,
        }}>
        <View
          style={{
            borderRadius: 7.5,
            backgroundColor: dotBgColor,
            width: 15,
            height: 15,
          }}
        />
        <View style={{marginTop: 8}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: '600',
              marginBottom: 4,
            }}>
            {title}
          </Text>
          <Text style={{color: '#fff', fontSize: 12}}>{subtitle}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

import {Offer} from '../../core/components/Offer';

const mapStateToProps = ({dealer, profile, contacts, nav, info}) => {
  return {
    list: info.list,
    nav,
    profile,
    dealerSelected: dealer.selected,
    isСallMeRequest: contacts.isСallMeRequest,
  };
};

const mapDispatchToProps = {
  callMe,
  fetchInfoList,
  actionListReset,
};

class ContactsScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  componentDidMount() {
    Amplitude.logEvent('screen', 'contacts');

    const {fetchInfoList, actionListReset} = this.props;
    const {region, id: dealer} = this.props.dealerSelected;

    actionListReset();
    fetchInfoList(region, dealer).then(action => {
      if (action.type === INFO_LIST__FAIL) {
        let message = get(
          action,
          'payload.message',
          'Произошла ошибка, попробуйте снова',
        );

        if (message === 'Network request failed') {
          message = ERROR_NETWORK;
        }

        setTimeout(() => Alert.alert(message), 100);
      }
    });
  }

  onPressCallMe = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {
        callMe,
        profile,
        navigation,
        dealerSelected,
        isСallMeRequest,
      } = this.props;

      // предотвращаем повторную отправку формы
      if (isСallMeRequest) {
        return;
      }

      const {name, phone, email} = profile;

      if (!phone) {
        return Alert.alert(
          'Добавьте номер телефона',
          'Для обратного звонка необходимо добавить номер контактного телефона в профиле',
          [
            {text: 'Отмена', style: 'cancel'},
            {
              text: 'Заполнить',
              onPress() {
                navigation.navigate('Profile2Screen');
              },
            },
          ],
        );
      }

      const dealerID = dealerSelected.id;
      const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getSystemVersion()}`;

      callMe({
        name,
        email,
        phone,
        device,
        dealerID,
      }).then(action => {
        if (action.type === CALL_ME__SUCCESS) {
          Amplitude.logEvent('order', 'contacts/callme');

          setTimeout(() => Alert.alert('Ваша заявка успешно отправлена'), 100);
        }

        if (action.type === CALL_ME__FAIL) {
          setTimeout(
            () => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
            100,
          );
        }
      });
    }
  };

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'ContactsScreen';

    const isListSucsess = Boolean(
      this.props.list.length !== nextProps.list.length,
    );
    return isActiveScreen || isListSucsess;
  }

  onPressAbout = () => this.props.navigation.navigate('AboutScreen');

  onPressRateApp = () => {
    const APP_STORE_LINK =
      'itms-apps://itunes.apple.com/app/idXXXX?action=write-review';
    const PLAY_STORE_LINK = 'market://details?id=com.atlantm';

    if (Platform.OS === 'ios') {
      Linking.openURL(APP_STORE_LINK).catch(err =>
        console.error('APP_STORE_LINK failed', err),
      );
    } else {
      Linking.openURL(PLAY_STORE_LINK).catch(err =>
        console.error('PLAY_STORE_LINK failed', err),
      );
    }
  };

  getRateAppInfoText = () => {
    return `Если вам понравилось наше приложение, оставьте, пожайлуста, положительный отзыв в ${this.getPlatformStore()}`;
  };

  getRateAppLabel = () => `Оставить отзыв в ${this.getPlatformStore()}`;

  getPlatformStore = () =>
    Platform.OS === 'ios' ? 'App Store' : 'Google Play';

  onPressBonus = () =>
    this.props.navigation.navigate('BonusInfoScreen', {
      refererScreen: 'contacts',
    });

  render() {
    const {dealerSelected, navigation, isСallMeRequest, list} = this.props;

    const PHONES = [];
    const phones = get(dealerSelected, 'phone', PHONES);

    console.log('== Contacts ==');

    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.safearea}>
          <ScrollView>
            <Image
              style={styles.imgHero}
              source={{uri: get(dealerSelected, 'img.10000x440')}}
            />
            <Button
              full
              onPress={() => {
                navigation.navigate('ChooseDealerScreen');
              }}
              style={styles.buttonPrimary}>
              <Text style={styles.buttonPrimaryText}>
                {dealerSelected.name}
              </Text>
              <Icon
                type="FontAwesome5"
                name="angle-right"
                style={styles.iconRow}
              />
            </Button>
            <View style={{marginTop: HEADER_MAX_HEIGHT - 160}}>
              <View style={styles.blackBack} />
              <View style={styles.address}>
                <Icon
                  style={styles.point}
                  type="MaterialIcons"
                  name="navigation"
                />
                {/* <Image
                  style={styles.point}
                  source={require('../assets/pin.png')}
                /> */}
                <Text style={styles.addressText}>{`${
                  dealerSelected.city.name
                }, ${dealerSelected.address}`}</Text>
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={styles.scrollView}>
                <View style={styles.scrollViewInner}>
                  <Card
                    title="Позвонить"
                    subtitle={phones[0]}
                    kind="default"
                    onPress={() => {
                      Linking.openURL(
                        'tel:' + phones[0].replace(/[^+\d]+/g, ''),
                      );
                    }}
                  />
                  <Card
                    title="Заказать звонок"
                    subtitle="Перезвоним Вам через 6 часов"
                    kind="default"
                    onPress={this.onPressCallMe}
                  />
                  <Card
                    title="Чат"
                    subtitle="Мы на связи с 9 до 20"
                    kind="primary"
                  />
                  <Card
                    title="Заявка"
                    subtitle="Отправить заявку"
                    kind="danger"
                  />
                  <Card
                    title="Сайт"
                    subtitle={
                      get(dealerSelected, 'site[0]')
                        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
                        .split('/')[0]
                    }
                    kind="success"
                    onPress={() => {
                      Linking.openURL(get(dealerSelected, 'site[0]')).catch(
                        console.log('<YA_RU> failed'),
                      );
                    }}
                  />
                </View>
              </ScrollView>
              {list.length ? (
                <View
                  style={{
                    marginTop: 20,
                    backgroundColor: '#F6F6F6',
                    paddingVertical: 20,
                  }}>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 20,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                      Текущие акции автоцентра
                    </Text>
                    <Text
                      onPress={() => {
                        navigation.navigate('InfoList');
                      }}
                      style={{color: '#4848FF', fontSize: 12}}>
                      Все
                    </Text>
                  </View>
                  <Carousel
                    data={list}
                    renderItem={item => {
                      return (
                        <Offer
                          navigation={this.props.navigation.navigate}
                          key={`carousel-article-${item.id}`}
                          data={item}
                          width={cardWidth}
                          height={150}
                        />
                      );
                    }}
                    sliderWidth={deviceWidth}
                    inactiveSlideScale={0.97}
                    activeSlideAlignment={'center'}
                    itemWidth={cardWidth}
                  />
                </View>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactsScreen);
