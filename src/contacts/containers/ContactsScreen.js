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
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import {
  Text,
  StyleProvider,
  Icon,
  Button,
  ActionSheet,
  Toast,
} from 'native-base';
import BrandLogo from '../../core/components/BrandLogo';
import Plate from '../../core/components/Plate';

// redux
import {connect} from 'react-redux';
import {callMe} from '../actions';
// import {fetchBrands} from '../../dealer/actions';

import {INFO_LIST__FAIL} from '../../info/actionTypes';
import {fetchInfoList, actionListReset} from '../../info/actions';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import getOrders from '../../utils/orders';
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import {ERROR_NETWORK} from '../../core/const';
import Carousel from 'react-native-snap-carousel';
import strings from '../../core/lang/const';

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
  addressText: {color: '#fff', fontSize: 16, lineHeight: 28, marginRight: '1%'},
  scrollView: {paddingLeft: 20},
  scrollViewInner: {display: 'flex', flexDirection: 'row'},
  iconRow: {
    position: 'absolute',
    right: 0,
    color: styleConst.color.greyText4,
    fontSize: 18,
    marginRight: 0,
    marginTop: 0,
  },
  buttonPrimary: {
    marginTop: 60,
    marginHorizontal: '2%',
    backgroundColor: styleConst.color.bg,
    borderColor: '#afafaf',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  buttonPrimaryText: {
    color: styleConst.color.greyText4,
    fontSize: 16,
    fontWeight: 'normal',
  },
  brand: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 3,
    height: 25,
  },
});

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 50;

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
  // fetchBrands,
};

class ContactsScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    // if (props.brands && props.brands.length === 0) {
    //   props.fetchBrands();
    // }
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
        text: strings.ModalView.cancel,
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
      console.log('action', action);
      if (action.type === INFO_LIST__FAIL) {
        let message = get(
          action,
          'payload.message',
          strings.Notifications.error.text,
        );

        if (message === 'Network request failed') {
          message = ERROR_NETWORK;
        }

        setTimeout(
          () =>
            Toast.show({
              text: message,
              type: 'warning',
              position: 'bottom',
              duration: 1000,
            }),
          100,
        );
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'BottomTabNavigation';

    const isListSucsess = Boolean(
      this.props.list.length !== nextProps.list.length,
    );
    return isActiveScreen || isListSucsess;
  }

  onPressCallMe = async () => {
    this.props.navigation.navigate('CallMeBackScreen');
  };

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

  getStatusWorktime = (divisions, checkType) => {
    if (!divisions || !checkType) {
      return false;
    }
    const locales = {
      by: 'Europe/Minsk',
      ru: 'Europe/Moscow',
      ua: 'Europe/Kiev',
    };
    let currentDealerLocale = 'by';
    if (
      this.props.dealerSelected.region &&
      locales[this.props.dealerSelected.region]
    ) {
      currentDealerLocale = locales[this.props.dealerSelected.region];
    }
    const res = divisions
      .map((division) => {
        const currDate = new Date();
        const today = currDate.getDay() - 1;
        if (
          division.worktime &&
          division.worktime[today] &&
          division.type &&
          division.type[checkType]
        ) {
          const currTime = currDate.getTime();
          const worktime = division.worktime[today];
          const timeOpen = new Date();
          const timeClose = new Date();
          timeOpen.setHours(worktime.start.hour, worktime.start.min, 0);
          timeClose.setHours(worktime.finish.hour, worktime.finish.min, 0);

          if (currTime > timeOpen.getTime() && currTime < timeClose.getTime()) {
            return true;
          } else {
            return false;
          }
        }
      })
      .filter(function (element) {
        return element !== undefined;
      });
    if (res && res.length && res[0]) {
      return res[0];
    } else {
      const currDate = new Date();
      const currTimezone = currDate.getTimezoneOffset();
      const currTime = currDate.getTime();
      const timeOpen = new Date();
      const timeClose = new Date();
      timeOpen.setHours(9, 0, 0);
      timeClose.setHours(20, 0, 0);

      if (currTime > timeOpen.getTime() && currTime < timeClose.getTime()) {
        return true;
      } else {
        return false;
      }
    }
  };

  render() {
    const {dealerSelected, navigation, list} = this.props;

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
              style={[styles.buttonPrimary, styleConst.shadow.default]}>
              {dealerSelected.brands &&
                dealerSelected.brands.length &&
                dealerSelected.brands.map((brand) => {
                  return (
                    <BrandLogo
                      brand={brand.id}
                      height={25}
                      style={styles.brand}
                      key={'ChooseDealerBrand' + brand.id}
                    />
                  );
                })}
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={styles.buttonPrimaryText}>
                  {dealerSelected.name}
                </Text>
                <Icon
                  type="FontAwesome5"
                  name="angle-right"
                  style={styles.iconRow}
                />
              </View>
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
                  <Plate
                    title={strings.ContactsScreen.call}
                    status={
                      this.getStatusWorktime(
                        get(dealerSelected, 'divisions', null),
                        'RC',
                      )
                        ? 'enabled'
                        : 'disabled'
                    }
                    subtitle={phones[0]}
                    onPress={() => {
                      const isOpened = this.getStatusWorktime(
                        get(dealerSelected, 'divisions', null),
                        'RC',
                      );
                      console.log('isOpened', isOpened);
                      if (!isOpened) {
                        Alert.alert(
                          strings.ContactsScreen.closedDealer.title,
                          strings.ContactsScreen.closedDealer.text,
                          [
                            {
                              text: strings.ContactsScreen.closedDealer.no,
                              style: 'cancel',
                            },
                            {
                              text: strings.ContactsScreen.closedDealer.yes,
                              onPress: () => {
                                navigation.navigate('CallMeBackScreen');
                              },
                            },
                          ],
                          {cancelable: false},
                        );
                      } else {
                        Linking.openURL(
                          'tel:' + phones[0].replace(/[^+\d]+/g, ''),
                        );
                      }
                    }}
                  />
                  <Plate
                    title={strings.ContactsScreen.callOrder}
                    subtitle=""
                    onPress={this.onPressCallMe}
                  />
                  {/* <Plate
                    title="Чат"
                    subtitle="Мы на связи с 9 до 20"
                    kind="primary"
                  /> */}
                  <Plate
                    title={strings.ContactsScreen.order}
                    subtitle={strings.ContactsScreen.sendOrder}
                    type="primary"
                    onPress={() => {
                      getOrders().then((ordersData) => {
                        ActionSheet.show(
                          {
                            options: ordersData.BUTTONS,
                            cancelButtonIndex: ordersData.CANCEL_INDEX,
                            title: ordersData.TITLE,
                            destructiveButtonIndex:
                              ordersData.DESTRUCTIVE_INDEX || null,
                          },
                          (buttonIndex) => {
                            switch (ordersData.BUTTONS[buttonIndex].id) {
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
                  <Plate
                    title={
                      this.sitesSubtitle && this.sitesSubtitle.sites.length > 1
                        ? strings.ContactsScreen.sites
                        : strings.ContactsScreen.site
                    }
                    subtitle={
                      this.sitesSubtitle && this.sitesSubtitle.sites.length > 1
                        ? this.sitesSubtitle.sites.join('\r\n')
                        : this.sitesSubtitle.sites[0]
                    }
                    type="red"
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
                            title: strings.ContactsScreen.dealerSites,
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
                      {strings.ContactsScreen.currentActions}
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
