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
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import {Text, StyleProvider, Icon, Button, ActionSheet} from 'native-base';
import BrandLogo from '../../core/components/BrandLogo';

// redux
import {connect} from 'react-redux';
import {callMe} from '../actions';

import {INFO_LIST__FAIL} from '../../info/actionTypes';
import {fetchInfoList, actionListReset} from '../../info/actions';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import getOrders from '../../utils/orders';
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import {ERROR_NETWORK, ORDERS} from '../../core/const';
import Carousel from 'react-native-snap-carousel';

const HEADER_MAX_HEIGHT = 406;

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  imgHero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT + 10,
    resizeMode: 'cover',
  },
  blackBack: {
    height: 65,
    backgroundColor: '#000',
    opacity: 0.5,
  },
  address: {
    marginTop: -50,
    paddingHorizontal: 20,
    marginBottom: 5,
    paddingVertical: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  point: {
    fontSize: 22,
    marginTop: 3,
    marginRight: 10,
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
  brand: {
    marginRight: 10,
    marginTop: 3,
    height: 25,
  },
});

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 50;

const getColoCardByKind = (kind) => {
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
            selectable={false}
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: '600',
              marginBottom: 4,
            }}>
            {title}
          </Text>
          <Text
            style={{color: '#fff', fontSize: 12}}
            ellipsizeMode="tail"
            numberOfLines={3}
            selectable={false}>
            {subtitle}
          </Text>
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
    brands: dealer.listBrands,
    dealerSelected: dealer.selected,
    isСallMeRequest: contacts.isСallMeRequest,
  };
};

const mapDispatchToProps = {
  callMe,
  fetchInfoList,
  actionListReset,
};

const getOrdersFunc = async () => {
  const orders = await getOrders();
  if (orders) {
    const ORDERS = orders;
    return ORDERS;
  }
};

class ContactsScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.sitesSubtitle = {
      sites: [],
      buttons: [],
    };
    get(this.props.dealerSelected, 'site').map((val, idx) => {
      if (val) {
        const siteName = val
          .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
          .split('/')[0];
        this.sitesSubtitle.sites.push(siteName);
        this.sitesSubtitle.buttons.push({
          id: 'site' + idx,
          text: siteName,
          site: val,
        });
      }
    });
    if (this.sitesSubtitle.sites.length > 1) {
      this.sitesSubtitle.buttons.push({
        id: 'cancel',
        text: 'Отмена',
      });
    }
  }

  componentDidMount() {
    Amplitude.logEvent('screen', 'contacts');

    const {fetchInfoList, actionListReset} = this.props;
    const {region, id: dealer} = this.props.dealerSelected;

    console.log('== Contacts ==');

    actionListReset();
    fetchInfoList(region, dealer).then((action) => {
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
    this.props.navigation.navigate('CallMeBackScreen');
  };

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'BottomTabNavigation';

    const isListSucsess = Boolean(
      this.props.list.length !== nextProps.list.length,
    );
    return isActiveScreen || isListSucsess;
  }

  onPressRateApp = () => {
    const APP_STORE_LINK =
      'itms-apps://itunes.apple.com/app/idXXXX?action=write-review';
    const PLAY_STORE_LINK = 'market://details?id=com.atlantm';

    if (Platform.OS === 'ios') {
      Linking.openURL(APP_STORE_LINK).catch((err) =>
        console.error('APP_STORE_LINK failed', err),
      );
    } else {
      Linking.openURL(PLAY_STORE_LINK).catch((err) =>
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

  onPressMap = () => {
    const {navigation, dealerSelected} = this.props;
    navigation.navigate('MapScreen', {
      returnScreen: 'Home',
      name: get(dealerSelected, 'name'),
      city: get(dealerSelected, 'city.name'),
      address: get(dealerSelected, 'address'),
      coords: get(dealerSelected, 'coords'),
    });
  };

  render() {
    const {dealerSelected, navigation, list, brands} = this.props;

    const PHONES = [];
    const phones = get(dealerSelected, 'phone', PHONES);

    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.safearea}>
          <StatusBar hidden />
          <ScrollView contentContainerStyle={{paddingBottom: 24}}>
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
              {dealerSelected.brands &&
                dealerSelected.brands.length &&
                dealerSelected.brands.map((brand) => {
                  if (brands[brand.id].logo) {
                    return (
                      <BrandLogo
                        brand={brand.id}
                        height={25}
                        style={styles.brand}
                        key={'ChooseDealerBrand' + brand.id}
                      />
                    );
                  }
                })}
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
              <TouchableOpacity
                style={styles.address}
                onPress={() => {
                  this.onPressMap();
                }}>
                <Icon
                  style={styles.point}
                  type="MaterialIcons"
                  name="navigation"
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.addressText}>
                  {`${dealerSelected.city.name}, ${dealerSelected.address}`}
                </Text>
              </TouchableOpacity>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{paddingRight: 30}}
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
                    subtitle=""
                    kind="default"
                    onPress={this.onPressCallMe}
                  />
                  {/* <Card
                    title="Чат"
                    subtitle="Мы на связи с 9 до 20"
                    kind="primary"
                  /> */}
                  <Card
                    title="Заявка"
                    subtitle="Отправить заявку"
                    kind="danger"
                    onPress={() => {
                      getOrdersFunc().then((ORDERS) => {
                        ActionSheet.show(
                          {
                            options: ORDERS.BUTTONS,
                            cancelButtonIndex: ORDERS.CANCEL_INDEX,
                            title: ORDERS.TITLE,
                            destructiveButtonIndex:
                              ORDERS.DESTRUCTIVE_INDEX || null,
                          },
                          (buttonIndex) => {
                            switch (ORDERS.BUTTONS[buttonIndex].id) {
                              case 'callMeBack':
                                navigation.navigate('CallMeBackScreen');
                                break;
                              case 'orderService':
                                navigation.navigate('ServiceScreen');
                                break;
                              case 'orderParts':
                                navigation.navigate('OrderPartsScreen');
                                break;
                              case 'carCost':
                                navigation.navigate('CarCostScreen');
                                break;
                            }
                          },
                        );
                      });
                    }}
                  />
                  <Card
                    title={
                      'Сайт' +
                      (this.sitesSubtitle && this.sitesSubtitle.sites.length > 1
                        ? 'ы'
                        : '')
                    }
                    subtitle={
                      this.sitesSubtitle && this.sitesSubtitle.sites.length > 1
                        ? this.sitesSubtitle.sites.join('\r\n')
                        : this.sitesSubtitle.sites[0]
                    }
                    kind="success"
                    onPress={() => {
                      if (
                        this.sitesSubtitle &&
                        this.sitesSubtitle.sites.length > 1
                      ) {
                        ActionSheet.show(
                          {
                            options: this.sitesSubtitle.buttons,
                            cancelButtonIndex:
                              this.sitesSubtitle.buttons.length - 1,
                            title: 'Сайты автоцентра',
                          },
                          (buttonIndex) => {
                            switch (
                              this.sitesSubtitle.buttons[buttonIndex].id
                            ) {
                              case 'cancel':
                                break;
                              default:
                                Linking.openURL(
                                  this.sitesSubtitle.buttons[buttonIndex].site,
                                  console.log(
                                    'this.sitesSubtitle.buttons[buttonIndex].site failed',
                                    this.sitesSubtitle.buttons[buttonIndex]
                                      .site,
                                  ),
                                );
                                break;
                            }
                          },
                        );
                      } else {
                        Linking.openURL(get(dealerSelected, 'site[0]')).catch(
                          console.log(
                            'get(dealerSelected, "site[0]") failed',
                            get(dealerSelected, 'site[0]'),
                          ),
                        );
                      }
                    }}
                  />
                </View>
              </ScrollView>
              {list.length ? (
                <View
                  style={{
                    marginTop: 16,
                    paddingVertical: 0,
                  }}>
                  <View
                    style={{
                      paddingHorizontal: 20,
                      marginBottom: 20,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 14, fontWeight: '500'}}>
                      Текущие акции автоцентра
                    </Text>
                    <Text
                      onPress={() => {
                        navigation.navigate('InfoList');
                      }}
                      style={{
                        color: styleConst.new.blueHeader,
                        fontSize: 14,
                        paddingLeft: 24,
                      }}>
                      Все
                    </Text>
                  </View>
                  <Carousel
                    data={list}
                    renderItem={(item) => {
                      return (
                        <Offer
                          navigation={this.props.navigation.navigate}
                          key={`carousel-article-${item.id}`}
                          data={item}
                          width={cardWidth}
                          height={190}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
