/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';

import {
  Text,
  Icon,
  useDisclose,
  HStack,
  View,
  Pressable,
  useToast,
  VStack,
  Image,
} from 'native-base';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Plate from '../../core/components/Plate';
import RateThisApp from '../../core/components/RateThisApp';
import Imager from '../../core/components/Imager';
import RNBounceable from '@freakycoder/react-native-bounceable';

import ToastAlert from '../../core/components/ToastAlert';

import ActionSheetMenu from '../../core/components/ActionSheetMenu';

// redux
import {connect} from 'react-redux';
import {callMe} from '../../contacts/actions';

import {INFO_LIST__FAIL} from '../../info/actionTypes';
import {fetchInfoList} from '../../info/actions';
import {actionMenuOpenedCount, actionAppRated} from '../../core/actions';
import Offer from '../../core/components/Offer';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import orderFunctions from '../../utils/orders';
import getStatusWorktime from '../../utils/worktime-status';
import chatStatus from '../../utils/chatStatus';

import {get} from 'lodash';
import styleConst from '../../core/style-const';
import {DEALERS_SETTINGS, ERROR_NETWORK, BELARUSSIA} from '../../core/const';
import Carousel from 'react-native-snap-carousel';
import {strings} from '../../core/lang/const';

const HEADER_MAX_HEIGHT = 416;
const infoListHeight = 300;

const styles = StyleSheet.create({
  imgHero: {
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
    zIndex: 10,
  },
  blackBack: {
    height: 80,
    backgroundColor: '#000',
    width: '100%',
  },
  address: {
    marginBottom: 0,
    paddingVertical: 3,
    display: 'flex',
    flexDirection: 'row',
    zIndex: 3,
  },
  addressText: {
    color: styleConst.color.white,
    fontSize: 14,
    lineHeight: 23,
  },
  addressTextSmall: {
    fontSize: 12,
    lineHeight: 18,
    color: styleConst.color.accordeonGrey2,
  },
  scrollView: {paddingLeft: 14, marginTop: 8, zIndex: 3},
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
    infoList: info.listDealer,
    isFetchInfoList: info.meta.isFetchInfoList,
    nav,
    profile,
    brands: dealer.listBrands,
    dealerSelected: dealer.selected,
    isСallMeRequest: contacts.isСallMeRequest,
    phones: dealer.selected.phones || [],
    phonesMobile: dealer.selected.phonesMobile || [],
    addresses: dealer.selected.addresses || [],
    socialNetworks: dealer.selected.socialNetworks || [],
    sites: dealer.selected.sites || [],

    isAppRated: core.isAppRated,
    menuOpenedCount: core.menuOpenedCount,
  };
};

const mapDispatchToProps = {
  callMe,
  fetchInfoList,
  actionAppRated,
  actionMenuOpenedCount,
};

const _renderInfoList = params => {
  const {isFetchInfoList, infoList, navigation, dealerID} = params;
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
            onPress={() => navigation.navigate('InfoList', {dealerID})}
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
                imagePressable={false}
                dealerCustom={dealerID}
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

const DealerInfoScreen = ({
  navigation,
  dealerSelected,
  sites,
  phones,
  phonesMobile,
  addresses,
  socialNetworks,
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
  const interval = useRef();
  const isOpened = getStatusWorktime(dealerSelected, 'RC');
  const [isSubscribedInterval, setSubscribedInterval] = useState(true);

  const {isOpen, onOpen, onClose} = useDisclose();
  const [actionSheetData, setActionSheetData] = useState({});

  const toast = useToast();

  const fabEnable = dealerSelected.region === BELARUSSIA ? true : false;

  const _renderAddress = addresses => {
    if (!addresses) {
      return <View h="8" />;
    }

    if (addresses.length > 1) {
      return (
        <>
          <HStack mx={2} my={2} justifyContent={'space-between'} zIndex={10}>
            <Pressable
              onPress={() => {
                setActionSheetData({
                  options: addresses.concat([
                    {
                      priority: addresses.length + 1,
                      id: 'cancel',
                      text: strings.Base.cancel.toLowerCase(),
                      icon: {
                        name: 'close',
                        color: '#f70707',
                      },
                    },
                  ]),
                  cancelButtonIndex: addresses.length - 1,
                  title: strings.ContactsScreen.navigate,
                  destructiveButtonIndex: addresses.length || null,
                });
                onOpen();
              }}
              w={'4/5'}>
              <HStack alignItems={'center'}>
                <Icon
                  size={10}
                  as={MaterialIcons}
                  name="navigation"
                  color="warmGray.50"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  mr={0.5}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.addressText}>
                  {strings.ContactsScreen.navigate}
                </Text>
              </HStack>
            </Pressable>
            <Pressable
              ml={1}
              w={'1/5'}
              onPress={() => onPressTime()}
              alignItems={'center'}>
              {/* <HStack alignItems={'center'}> */}
              <Icon
                size={8}
                as={MaterialCommunityIcons}
                name="timetable"
                color="warmGray.50"
                _dark={{
                  color: 'warmGray.50',
                }}
              />
              <Text
                style={{
                  color: styleConst.color.white,
                  fontSize: 10,
                  lineHeight: 12,
                }}>
                {strings.ContactsScreen.timework}
              </Text>
            </Pressable>
          </HStack>
          <View
            style={styles.blackBack}
            opacity={0.7}
            position={'absolute'}
            left={0}
            zIndex={1}
          />
        </>
      );
    } else {
      return (
        <View style={styles.address} testID="ContactsScreen.PressMap">
          <HStack mx={2} justifyContent={'space-between'} zIndex={10}>
            <Pressable onPress={() => onPressMap(addresses[0])} w={'4/5'}>
              <HStack alignItems={'center'}>
                <Icon
                  size={10}
                  as={MaterialIcons}
                  name="navigation"
                  color="warmGray.50"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  mr={0.5}
                />
                <VStack w={'90%'}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.addressText}>
                    {addresses.length === 1 ? addresses[0]?.text : ''}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.addressText, styles.addressTextSmall]}>
                    {strings.ContactsScreen.navigate}
                  </Text>
                </VStack>
              </HStack>
            </Pressable>
            <Pressable
              ml={1}
              w={'1/5'}
              onPress={() => onPressTime()}
              alignItems={'center'}>
              {/* <HStack alignItems={'center'}> */}
              <Icon
                size={8}
                as={MaterialCommunityIcons}
                name="timetable"
                color="warmGray.50"
                _dark={{
                  color: 'warmGray.50',
                }}
              />
              <Text
                style={{
                  color: styleConst.color.white,
                  fontSize: 10,
                  lineHeight: 12,
                }}>
                {strings.ContactsScreen.timework}
              </Text>
            </Pressable>
          </HStack>
          <View
            style={styles.blackBack}
            opacity={0.7}
            position={'absolute'}
            left={0}
            zIndex={1}
          />
        </View>
      );
    }
  };

  const _renderPlates = params => {
    const {
      callAvailable,
      isOpened,
      navigation,
      chatAvailable,
      onPressCallMe,
      onPressChat,
      onPressOrders,
      onPressTime,
    } = params;

    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{paddingRight: 30}}
        style={styles.scrollView}>
        <HStack>
          {true ? (
            <Plate
              title={strings.ContactsScreen.call}
              status={callAvailable ? 'enabled' : 'disabled'}
              subtitle={get(
                dealerSelected,
                'phonesMobile[0].subtitle',
                get(dealerSelected, 'phones[0].subtitle', null),
              )}
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
                          navigation.navigate('CallMeBackScreen', {
                            dealerCustom: dealerSelected,
                          });
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                } else {
                  if (phonesMobile.length > 1) {
                    setActionSheetData({
                      options: phonesMobile.concat([
                        {
                          priority: phonesMobile.length + 1,
                          id: 'cancel',
                          text: strings.Base.cancel.toLowerCase(),
                          icon: {
                            name: 'close',
                            color: '#f70707',
                          },
                        },
                      ]),
                      cancelButtonIndex: phonesMobile.length - 1,
                      title: strings.ContactsScreen.call,
                      destructiveButtonIndex: phonesMobile.length || null,
                    });
                    onOpen();
                  } else {
                    Linking.openURL(phonesMobile[0].link).catch(
                      console.error(
                        'phonesMobile[0].link failed',
                        phonesMobile,
                      ),
                    );
                  }
                }
              }}
            />
          ) : null}
          {true ? (
            <Plate
              testID="ContactsScreen.ButtonCallMe"
              title={strings.ContactsScreen.callOrder}
              subtitle=""
              onPress={onPressCallMe}
            />
          ) : null}
          {fabEnable ? (
            <Plate
              title={strings.ContactsScreen.chat.title}
              subtitle={strings.ContactsScreen.chat.subTitle}
              type="orange"
              status={chatAvailable ? 'enabled' : 'disabled'}
              onPress={onPressChat}
            />
          ) : null}
          <Plate
            title={strings.ContactsScreen.order}
            subtitle={strings.ContactsScreen.sendOrder}
            type="primary"
            testID="ContactsScreen.ButtonOrders"
            onPress={onPressOrders}
          />
          <Plate
            testID="ContactsScreen.ButtonTimework"
            title={strings.ContactsScreen.timework2}
            subtitle=""
            type="orange"
            status={callAvailable ? 'enabled' : 'disabled'}
            onPress={onPressTime}
          />
          <Plate
            testID="ContactsScreen.ButtonTimework"
            title={strings.ContactsScreen.address}
            subtitle={addresses.length === 1 ? addresses[0]?.text : ''}
            type="default"
            status={callAvailable ? 'enabled' : 'disabled'}
            onPress={() => {
              if (addresses.length > 1) {
                setActionSheetData({
                  options: addresses.concat([
                    {
                      priority: addresses.length + 1,
                      id: 'cancel',
                      text: strings.Base.cancel.toLowerCase(),
                      icon: {
                        name: 'close',
                        color: '#f70707',
                      },
                    },
                  ]),
                  cancelButtonIndex: addresses.length - 1,
                  title: strings.ContactsScreen.navigate,
                  destructiveButtonIndex: addresses.length || null,
                });
                return onOpen();
              } else {
                return onPressMap(addresses[0]);
              }
            }}
          />
          {sites.length ? (
            <Plate
              title={
                sites && sites.length > 1
                  ? strings.ContactsScreen.sites
                  : strings.ContactsScreen.site
              }
              subtitle={
                sites && sites?.length < 3
                  ? sites.length > 1
                    ? _sites()
                    : sites[0].subtitle
                  : null
              }
              testID="ContactsScreen.ButtonSites"
              type="red"
              onPress={() => {
                if (sites.length > 1) {
                  setActionSheetData({
                    options: sites.concat([
                      {
                        priority: sites.length + 1,
                        id: 'cancel',
                        text: strings.Base.cancel.toLowerCase(),
                        icon: {
                          name: 'close',
                          color: '#f70707',
                        },
                      },
                    ]),
                    cancelButtonIndex: sites.length - 1,
                    title: strings.ContactsScreen.dealerSites,
                    destructiveButtonIndex: sites.length || null,
                  });
                  onOpen();
                } else {
                  Linking.openURL(sites[0].link).catch(
                    console.error('sites[0].link failed', sites),
                  );
                }
              }}
            />
          ) : null}
          {socialNetworks && socialNetworks?.length ? (
            <Plate
              title={strings.ContactsScreen.socialNetworks.title}
              subtitle={strings.ContactsScreen.socialNetworks.subtitle}
              type="orange"
              status={'enabled'}
              onPress={() => {
                setActionSheetData({
                  options: socialNetworks.concat([
                    {
                      priority: socialNetworks.length + 1,
                      id: 'cancel',
                      text: strings.Base.cancel,
                      icon: {
                        name: 'close',
                        color: '#f70707',
                      },
                    },
                  ]),
                  cancelButtonIndex: socialNetworks.length - 1,
                  // title:
                  //   strings.ContactsScreen.socialNetworks.subtitle
                  //     .charAt(0)
                  //     .toUpperCase() +
                  //   strings.ContactsScreen.socialNetworks.subtitle.slice(1),
                  destructiveButtonIndex: socialNetworks.length || null,
                });
                onOpen();
              }}
            />
          ) : null}
        </HStack>
      </ScrollView>
    );
  };

  const _showOrdersMenu = () => {
    orderFunctions.getOrders('default', dealerSelected).then(data => {
      setActionSheetData({
        options: data.BUTTONS,
        cancelButtonIndex: data.CANCEL_INDEX,
        title: strings.ContactsScreen.sendOrder,
        destructiveButtonIndex: data.DESTRUCTIVE_INDEX || null,
      });
      onOpen();
    });
  };

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

        setTimeout(
          () =>
            toast.show({
              render: ({id}) => {
                return (
                  <ToastAlert
                    id={id}
                    description={message}
                    title={strings.Notifications.error.title2}
                  />
                );
              },
            }),
          100,
        );
      }
    });
  };

  const _sites = () => {
    let sitesText = [];
    if (sites) {
      sites.map(site => {
        if (site.subtitle) {
          sitesText.push(site.subtitle);
        }
      });
    }
    return sitesText;
  };

  const onPressCallMe = async () => {
    navigation.navigate('CallMeBackScreen', {
      dealerCustom: dealerSelected,
      dealerHide: true,
    });
  };

  const onPressChat = () => {
    navigation.navigate('ChatScreen', {prevScreen: 'Экран автоцентра'});
  };

  const onPressMap = addressData => {
    navigation.navigate('MapScreen', {
      returnScreen: 'DealerInfoScreen',
      name: get(addressData, 'text'),
      city: get(addressData, 'city.name'),
      address: get(addressData, 'address'),
      coords: get(addressData, 'coords'),
    });
  };

  const onPressTime = () => {
    navigation.navigate('WorkTimeScreen', {
      returnScreen: 'DealerInfoScreen',
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
    chatStatus(isSubscribedInterval).then(res => {
      setChatAvailable(res);
    });
    setCallAvailable(getStatusWorktime(dealerSelected, 'RC'));

    interval.current = setInterval(() => {
      setCallAvailable(getStatusWorktime(dealerSelected, 'RC'));
      chatStatus(isSubscribedInterval).then(res => {
        setChatAvailable(res);
      });
    }, intervalMiliSeconds);
    return () => {
      setSubscribedInterval(false);
      if (interval) {
        clearInterval(interval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <View style={styleConst.safearea.default} testID="ContactsScreen.Wrapper">
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
          <View mt={-20}>
            {_renderAddress(addresses)}
            {_renderPlates({
              callAvailable,
              isOpened,
              navigation,
              chatAvailable,
              onPressCallMe,
              onPressTime,
              onPressChat,
              onPressOrders: _showOrdersMenu,
            })}
            {_renderInfoList({
              isFetchInfoList,
              infoList,
              navigation,
              dealerID: dealerSelected.id,
            })}
          </View>
        </ScrollView>
      </View>
      <ActionSheetMenu
        actionSheetData={actionSheetData}
        onOpen={onOpen}
        onClose={onClose}
        isOpen={isOpen}
        hideDragIndicator={false}
      />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DealerInfoScreen);
