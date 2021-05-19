/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  View,
  Alert,
  StyleSheet,
  ActivityIndicator,
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
import RateThisApp from '../../core/components/RateThisApp';

// redux
import {connect} from 'react-redux';
import {callMe} from '../actions';
// import {fetchBrands} from '../../dealer/actions';

import {INFO_LIST__FAIL} from '../../info/actionTypes';
import {fetchInfoList, actionListReset} from '../../info/actions';
import {actionAppRated, actionMenuOpenedCount} from '../../core/actions';
import {Offer} from '../../core/components/Offer';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import orderFunctions from '../../utils/orders';
import {verticalScale} from '../../utils/scale';
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import {ERROR_NETWORK} from '../../core/const';
import Carousel from 'react-native-snap-carousel';
import {strings} from '../../core/lang/const';

const HEADER_MAX_HEIGHT = 416;

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
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
    zIndex: 0,
  },
  blackBack: {
    height: 65,
    backgroundColor: '#000',
    opacity: 0.5,
    zIndex: 2,
  },
  address: {
    marginTop: -55,
    paddingHorizontal: 20,
    marginBottom: 5,
    paddingVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    zIndex: 3,
  },
  point: {
    fontSize: 22,
    marginTop: 3,
    marginRight: 10,
    color: styleConst.color.white,
  },
  addressText: {
    color: styleConst.color.white,
    fontSize: 16,
    lineHeight: 28,
    marginRight: '1%',
  },
  scrollView: {paddingLeft: 20, zIndex: 3},
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
    position: 'absolute',
    zIndex: 100,
    width: '96%',
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
  spinnerContainer: {
    flex: 1,
    marginTop: 16,
    paddingVertical: 0,
    backgroundColor: styleConst.color.bg,
  },
});

const deviceWidth = Number(Dimensions.get('window').width) || 350;
const cardWidth = deviceWidth - 50;

const mapStateToProps = ({dealer, profile, contacts, nav, info, core}) => {
  return {
    list: info.list,
    isFetchInfoList: info.meta.isFetchInfoList,
    nav,
    profile,
    brands: dealer.listBrands,
    dealerSelected: dealer.selected,
    isСallMeRequest: contacts.isСallMeRequest,

    isAppRated: core.isAppRated,
    menuOpenedCount: core.menuOpenedCount,
  };
};

const mapDispatchToProps = {
  callMe,
  fetchInfoList,
  actionListReset,
  actionMenuOpenedCount,
  actionAppRated,
};

class ContactsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRatePopup: false,
    };
    this.sitesSubtitle = {
      sites: [],
      buttons: [],
    };
    this.mainScrollView = React.createRef();
    get(this.props.dealerSelected, 'site', []).map((val, idx) => {
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
        text: strings.Base.cancel.toLowerCase(),
      });
    }
  }

  componentDidMount() {
    Analytics.logEvent('screen', 'contacts');

    const {fetchInfoList, isAppRated, menuOpenedCount} = this.props;
    const {region, id: dealerID} = this.props.dealerSelected;

    if (!isAppRated) {
      if (menuOpenedCount >= 10) {
        setTimeout(() => {
          Analytics.logEvent('screen', 'ratePopup', 'contacts');
          this.setState(
            {
              showRatePopup: true,
            },
            () => {
              this.props.actionMenuOpenedCount(0);
            },
          );
        }, 1000);
      } else {
        this.props.actionMenuOpenedCount();
      }
    }

    console.log('== Contacts ==');
    fetchInfoList(region, dealerID).then((action) => {
      if (action && action.type && action.type === INFO_LIST__FAIL) {
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
    const dealerChanged = Boolean(
      this.props.dealerSelected.id !== nextProps.dealerSelected.id,
    );
    if (this.props.navigation.isFocused()) {
      this.mainScrollView.scrollTo({x: 0, y: 1, animated: true});
    }
    return (
      isActiveScreen ||
      isListSucsess ||
      dealerChanged ||
      this.props.navigation.isFocused()
    );
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

  _onAppRateSuccess = () => {
    this.setState({
      showRatePopup: false,
    });
    !this.props.isAppRated && this.props.actionAppRated();
  };

  _onAppRateAskLater = () => {
    this.setState({
      showRatePopup: false,
    });
  };

  render() {
    const {dealerSelected, navigation, list, isFetchInfoList} = this.props;

    const PHONES = [];
    const phones = get(dealerSelected, 'phone', PHONES);

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.safearea}>
          <StatusBar hidden />
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
          <ScrollView
            contentContainerStyle={{paddingBottom: 24}}
            ref={(ref) => {
              this.mainScrollView = ref;
            }}
            showsHorizontalScrollIndicator={false}
            bounces={false}>
            <Image
              style={styles.imgHero}
              source={{uri: get(dealerSelected, 'img.10000x440')}}
            />
            <View style={{marginTop: HEADER_MAX_HEIGHT - 65}}>
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
                  {dealerSelected.city.name ? dealerSelected.city.name : null}
                  {dealerSelected.address
                    ? ', ' + dealerSelected.address
                    : null}
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
                      orderFunctions.getOrders().then((ordersData) => {
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
              {!isFetchInfoList ? (
                list && list.length ? (
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
                          color: styleConst.color.lightBlue,
                          fontSize: 14,
                          paddingLeft: 24,
                        }}>
                        {strings.Base.all}
                      </Text>
                    </View>
                    <Carousel
                      data={list}
                      renderItem={(item) => {
                        return (
                          <Offer
                            key={`carousel-article-${item.hash}`}
                            data={item}
                            width={cardWidth}
                            height={190}
                          />
                        );
                      }}
                      sliderWidth={deviceWidth}
                      itemWidth={cardWidth}
                      inactiveSlideScale={0.97}
                      activeSlideAlignment={'center'}
                    />
                  </View>
                ) : null
              ) : (
                <View style={styles.spinnerContainer}>
                  <ActivityIndicator
                    color={styleConst.color.blue}
                    style={styleConst.spinner}
                  />
                </View>
              )}
            </View>
          </ScrollView>
          {this.state.showRatePopup ? (
            <RateThisApp
              onSuccess={this._onAppRateSuccess}
              onAskLater={this._onAppRateAskLater}
            />
          ) : null}
        </View>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
