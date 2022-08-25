/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
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
  Icon,
  ActionSheet,
  Toast,
  Box,
  HStack,
  View,
  Pressable,
} from 'native-base';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import BrandLogo from '../../core/components/BrandLogo';
import Plate from '../../core/components/Plate';
import RateThisApp from '../../core/components/RateThisApp';
import Imager from '../../core/components/Imager';

// redux
import {connect} from 'react-redux';
import {callMe} from '../actions';

import {INFO_LIST__FAIL} from '../../info/actionTypes';
import {fetchInfoList, actionListReset} from '../../info/actions';
import {actionMenuOpenedCount, actionAppRated} from '../../core/actions';
import {Offer} from '../../core/components/Offer';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import orderFunctions from '../../utils/orders';
import getStatusWorktime from '../../utils/worktime-status';
import chatStatus from '../../utils/chatStatus';

import {get} from 'lodash';
import styleConst from '../../core/style-const';
import {ERROR_NETWORK} from '../../core/const';
import Carousel from 'react-native-snap-carousel';
import {strings} from '../../core/lang/const';

const HEADER_MAX_HEIGHT = 416;
const infoListHeight = 190;

const styles = StyleSheet.create({
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
    marginTop: 3,
    marginRight: 10,
  },
  addressText: {
    color: styleConst.color.white,
    fontSize: 16,
    lineHeight: 28,
    marginRight: '1%',
  },
  scrollView: {paddingLeft: 20, zIndex: 3},
  iconRow: {
    position: 'absolute',
    right: 0,
  },
  buttonPrimary: {
    marginTop: 60,
    marginHorizontal: '2%',
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
    marginRight: 15,
    marginTop: 3,
    height: 25,
    width: 30,
  },
  spinnerContainer: {
    flex: 1,
    marginTop: infoListHeight / 2,
    height: infoListHeight,
    backgroundColor: styleConst.color.bg,
  },
});

const deviceWidth = Number(Dimensions.get('window').width) || 350;
const cardWidth = deviceWidth - 50;

const mapStateToProps = ({dealer, profile, contacts, nav, info, core}) => {
  return {
    infoList: info.list,
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
  actionAppRated,
  actionMenuOpenedCount,
};

const _renderPlates = params => {
  const {
    dealerSelected,
    callAvailable,
    isOpened,
    navigation,
    chatAvailable,
    onPressCallMe,
    onPressChat,
    sitesSubtitle,
  } = params;
  const phones = get(dealerSelected, 'phone', []);
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={{paddingRight: 30}}
      style={styles.scrollView}>
      <HStack>
        <Plate
          title={strings.ContactsScreen.call}
          status={callAvailable ? 'enabled' : 'disabled'}
          subtitle={phones[0]}
          onPress={() => {
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
              Linking.openURL('tel:' + phones[0].replace(/[^+\d]+/g, ''));
            }
          }}
        />
        {false ? (
          <Plate
            title="Чат"
            subtitle="Отвечаем с 9 до 20"
            type="orange"
            status={chatAvailable ? 'enabled' : 'disabled'}
            onPress={onPressChat}
          />
        ) : null}
        <Plate
          testID="ContactsScreen.ButtonCallMe"
          title={strings.ContactsScreen.callOrder}
          subtitle=""
          onPress={onPressCallMe}
        />
        <Plate
          title={strings.ContactsScreen.order}
          subtitle={strings.ContactsScreen.sendOrder}
          type="primary"
          testID="ContactsScreen.ButtonOrders"
          onPress={() => {
            orderFunctions.getOrders().then(ordersData => {
              ActionSheet.show(
                {
                  options: ordersData.BUTTONS,
                  cancelButtonIndex: ordersData.CANCEL_INDEX,
                  title: ordersData.TITLE,
                  destructiveButtonIndex: ordersData.DESTRUCTIVE_INDEX || null,
                },
                buttonIndex => {
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
            sitesSubtitle && sitesSubtitle.sites.length > 1
              ? strings.ContactsScreen.sites
              : strings.ContactsScreen.site
          }
          subtitle={
            sitesSubtitle && sitesSubtitle.sites.length > 1
              ? sitesSubtitle.sites.join('\r\n')
              : sitesSubtitle.sites[0]
          }
          testID="ContactsScreen.ButtonSites"
          type="red"
          onPress={() => {
            if (sitesSubtitle && sitesSubtitle.sites.length > 1) {
              ActionSheet.show(
                {
                  options: sitesSubtitle.buttons,
                  cancelButtonIndex: sitesSubtitle.buttons.length - 1,
                  title: strings.ContactsScreen.dealerSites,
                },
                buttonIndex => {
                  switch (sitesSubtitle.buttons[buttonIndex].id) {
                    case 'cancel':
                      break;
                    default:
                      Linking.openURL(sitesSubtitle.buttons[buttonIndex].site);
                      break;
                  }
                },
              );
            } else {
              Linking.openURL(get(dealerSelected, 'site[0]')).catch(
                console.error(
                  'get(dealerSelected, "site[0]") failed',
                  get(dealerSelected, 'site[0]'),
                ),
              );
            }
          }}
        />
      </HStack>
    </ScrollView>
  );
};

const _renderInfoList = params => {
  const {isFetchInfoList, infoList, navigation} = params;
  if (isFetchInfoList) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      </View>
    );
  }
  if (infoList && infoList.length) {
    return (
      <View
        style={{
          marginTop: 16,
          paddingVertical: 0,
        }}
        testID="ContactsScreen.currentActionsHeading">
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
            onPress={() => navigation.navigate('InfoList')}
            style={{
              color: styleConst.color.lightBlue,
              fontSize: 14,
              paddingLeft: 24,
            }}>
            {strings.Base.all}
          </Text>
        </View>
        <Carousel
          data={infoList}
          renderItem={item => {
            return (
              <Offer
                key={`carousel-article-${item.hash}`}
                data={item}
                width={cardWidth}
                height={infoListHeight}
              />
            );
          }}
          sliderWidth={deviceWidth}
          itemWidth={cardWidth}
          inactiveSlideScale={0.97}
          activeSlideAlignment={'center'}
        />
      </View>
    );
  }
  return <></>;
};

const intervalSecondsMini = 60;
const intervalMiliSeconds = intervalSecondsMini * 1000;

const ContactsScreen = ({
  navigation,
  dealerSelected,
  infoList,
  fetchInfoList,
  isFetchInfoList,
  isAppRated,
  menuOpenedCount,
  actionMenuOpenedCount,
  actionAppRated,
}) => {
  // const [showRatePopup, setShowRatePopup] = useState(false);
  const [chatAvailable, setChatAvailable] = useState(false);
  const [callAvailable, setCallAvailable] = useState(false);
  const mainScrollView = useRef();
  // const interval = useRef();
  const isOpened = getStatusWorktime(dealerSelected, 'RC');
  const [isSubscribedInterval, setSubscribedInterval] = useState(true);

  const fetchInfoData = () => {
    const {region, id: dealerID} = dealerSelected;
    fetchInfoList(region, dealerID).then(action => {
      if (action && action.type && action.type === INFO_LIST__FAIL) {
        let message = get(
          action,
          'payload.message',
          strings.Notifications.error.text,
        );

        if (message === 'Network request failed') {
          message = ERROR_NETWORK;
        }

        // setTimeout(
        //   () =>
        //     Toast.show({
        //       text: message,
        //       type: 'warning',
        //       position: 'bottom',
        //       duration: 1000,
        //     }),
        //   100,
        // );
      }
    });
  };

  const _sites = () => {
    let sitesSubtitle = {
      sites: [],
      buttons: [],
    };

    get(dealerSelected, 'site', []).map((val, idx) => {
      if (val) {
        const siteName = val
          .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
          .split('/')[0];
        sitesSubtitle.sites.push(siteName);
        sitesSubtitle.buttons.push({
          id: 'site' + idx,
          text: siteName,
          site: val,
        });
      }
    });
    if (sitesSubtitle.sites.length > 1) {
      sitesSubtitle.buttons.push({
        id: 'cancel',
        text: strings.Base.cancel.toLowerCase(),
      });
    }
    return sitesSubtitle;
  };

  const sitesSubtitle = _sites();

  const onPressCallMe = async () => {
    navigation.navigate('CallMeBackScreen');
  };

  const onPressChat = () => {
    navigation.navigate('ChatScreen');
  };

  const onPressMap = () => {
    navigation.navigate('MapScreen', {
      returnScreen: 'Home',
      name: get(dealerSelected, 'name'),
      city: get(dealerSelected, 'city.name'),
      address: get(dealerSelected, 'address'),
      coords: get(dealerSelected, 'coords'),
    });
  };

  const _onAppRateSuccess = () => {
    !isAppRated && actionAppRated();
  };

  useEffect(() => {
    Analytics.logEvent('screen', 'contacts');

    if (!isAppRated) {
      if (menuOpenedCount >= 10) {
        setTimeout(() => {
          Analytics.logEvent('screen', 'ratePopup', {source: 'contacts'});
          actionMenuOpenedCount(0);
          return RateThisApp({onSuccess: _onAppRateSuccess});
        }, 1000);
      } else {
        actionMenuOpenedCount();
      }
    }

    fetchInfoData();

    console.info('== Contacts ==');
    // chatStatus(isSubscribedInterval).then(res => {
    //   setChatAvailable(res);
    // });
    setCallAvailable(getStatusWorktime(dealerSelected, 'RC'));

    // interval.current = setInterval(() => {
    //   setCallAvailable(getStatusWorktime(dealerSelected, 'RC'));
    //   chatStatus(isSubscribedInterval).then(res => {
    //     setChatAvailable(res);
    //   });
    // }, intervalMiliSeconds);
    return () => {
      setSubscribedInterval(false);
      // if (interval) {
      //   clearInterval(interval);
      // }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styleConst.safearea.default} testID="ContactsScreen.Wrapper">
      <StatusBar hidden />
      <Pressable
        onPress={() => navigation.navigate('ChooseDealerScreen')}
        style={[styles.buttonPrimary]}>
        <Box
          borderWidth={1}
          borderColor="coolGray.300"
          shadow={5}
          bg="coolGray.100"
          p={3}
          rounded={8}
          backgroundColor={styleConst.color.bg}>
          <HStack alignItems="center" justifyContent="space-between" space={2}>
            {dealerSelected.brand && dealerSelected.brand.length ? (
              <HStack>
                {dealerSelected.brand.map(brand => {
                  return (
                    <BrandLogo
                      brand={brand.id}
                      height={25}
                      style={styles.brand}
                      key={'ChooseDealerBrand' + brand.id}
                    />
                  );
                })}
              </HStack>
            ) : null}
            <Text style={styles.buttonPrimaryText}>
              {get(dealerSelected, 'name')}
            </Text>
            <Icon
              size="sm"
              as={FontAwesome5}
              color={styleConst.color.greyText4}
              name={'angle-right'}
              style={styles.iconRow}
            />
          </HStack>
        </Box>
      </Pressable>
      <ScrollView
        contentContainerStyle={{paddingBottom: 24}}
        ref={mainScrollView}
        showsHorizontalScrollIndicator={false}
        bounces={false}>
        <Imager
          style={styles.imgHero}
          source={{
            uri:
              get(dealerSelected, 'img.thumb') +
              '1000x1000' +
              '&hash=' +
              get(dealerSelected, 'hash'),
            cache: 'web',
          }}
        />
        <View style={{marginTop: HEADER_MAX_HEIGHT - 65}}>
          {dealerSelected.address ? (
            <>
              <View style={styles.blackBack} />
              <TouchableOpacity
                style={styles.address}
                testID="ContactsScreen.PressMap"
                onPress={() => onPressMap()}>
                <Icon
                  size={22}
                  as={MaterialIcons}
                  name="navigation"
                  color="warmGray.50"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  style={styles.point}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.addressText}>
                  {dealerSelected &&
                  dealerSelected.city[0] &&
                  dealerSelected.city[0].name
                    ? dealerSelected.city[0].name
                    : null}
                  {dealerSelected.address
                    ? ', ' + dealerSelected.address
                    : null}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View h="8" />
          )}
          {_renderPlates({
            dealerSelected,
            callAvailable,
            isOpened,
            navigation,
            chatAvailable,
            onPressCallMe,
            onPressChat,
            sitesSubtitle,
          })}
          {_renderInfoList({isFetchInfoList, infoList, navigation})}
        </View>
      </ScrollView>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
