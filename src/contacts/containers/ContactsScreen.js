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
  Heading,
} from 'native-base';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DealerItemList from '../../core/components/DealerItemList';
import Plate from '../../core/components/Plate';
import RateThisApp from '../../core/components/RateThisApp';
import Imager from '../../core/components/Imager';
import RNBounceable from '@freakycoder/react-native-bounceable';

import ToastAlert from '../../core/components/ToastAlert';

import ActionSheetMenu from '../../core/components/ActionSheetMenu';

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
    height: 80,
    backgroundColor: '#000',
    opacity: 0.7,
    zIndex: 2,
  },
  address: {
    marginTop: -80,
    marginLeft: '2%',
    marginBottom: 7,
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
  scrollView: {paddingLeft: 20, zIndex: 3},
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
  actionListReset,
  actionAppRated,
  actionMenuOpenedCount,
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

const _renderEmergencyManager = ({emergencyManagerInfo, navigation}) => {
  if (!emergencyManagerInfo) {
    return null;
  }
  return (
    <RNBounceable
      onPress={() => {
        navigation.navigate('WebviewScreen', {html: emergencyManagerInfo});
      }}>
      <View
        w={'90%'}
        h={'24'}
        backgroundColor={styleConst.color.blue}
        shadow={6}
        zIndex={1000}
        rounded={'lg'}
        marginX={'5%'}
        marginTop={'5%'}>
        <Heading
          alignSelf={'center'}
          size={'lg'}
          style={{
            position: 'absolute',
            color: styleConst.color.white,
            textTransform: 'uppercase',
            bottom: 1,
            zIndex: 10,
            fontFamily: styleConst.font.regular,
          }}>
          Аварийный менеджер
        </Heading>
        <View
          rounded={'lg'}
          style={{
            backgroundColor: '#000',
            width: '100%',
            height: '35%',
            bottom: 0,
            position: 'absolute',
            zIndex: 1,
            opacity: 0.6,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />
        <Image
          key={'Imager-emergencyManager'}
          source={require('../../../assets/accidental_manager.jpg')}
          resizeMode="cover"
          size={'100%'}
          rounded={'lg'}
        />
      </View>
    </RNBounceable>
  );
};

const intervalSecondsMini = 60;
const intervalMiliSeconds = intervalSecondsMini * 1000;

const ContactsScreen = ({
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
  // const interval = useRef();
  const isOpened = getStatusWorktime(dealerSelected, 'RC');
  const [isSubscribedInterval, setSubscribedInterval] = useState(true);

  const {isOpen, onOpen, onClose} = useDisclose();
  const [actionSheetData, setActionSheetData] = useState({});

  const toast = useToast();

  const _renderAddress = addresses => {
    if (!addresses) {
      return <View h="8" />;
    }

    if (addresses.length > 1) {
      return (
        <>
          <View style={[styles.blackBack, {height: 66}]} />
          <View
            style={[styles.address, {marginTop: -66, marginBottom: 0}]}
            testID="ContactsScreen.PressMap">
            <HStack justifyContent={'space-between'} w={'98%'}>
              <Pressable
                onPress={() => {
                  setActionSheetData({
                    options: addresses.concat([
                      {
                        priority: addresses.length + 1,
                        id: 'cancel',
                        text: strings.Base.cancel.toLowerCase(),
                        icon: {
                          name: 'ios-close',
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
                <Text style={{color: 'white', fontSize: 10, lineHeight: 12}}>
                  {strings.ContactsScreen.timework}
                </Text>
                {/* <VStack alignItems={'center'}>
                    <Text style={{color: 'white', fontSize: 12}}>вторник</Text>
                    <Text style={{color: 'white', fontSize: 13}}>
                      с 9 до 17
                    </Text>
                  </VStack> */}
                {/* </HStack> */}
              </Pressable>
            </HStack>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.blackBack} />
          <View style={styles.address} testID="ContactsScreen.PressMap">
            <HStack justifyContent={'space-between'} w={'98%'}>
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
                <Text style={{color: 'white', fontSize: 10, lineHeight: 12}}>
                  {strings.ContactsScreen.timework}
                </Text>
                {/* <VStack alignItems={'center'}>
                    <Text style={{color: 'white', fontSize: 12}}>вторник</Text>
                    <Text style={{color: 'white', fontSize: 13}}>
                      с 9 до 17
                    </Text>
                  </VStack> */}
                {/* </HStack> */}
              </Pressable>
            </HStack>
          </View>
        </>
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
                        navigation.navigate('CallMeBackScreen');
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
                          name: 'ios-close',
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
                    console.error('phonesMobile[0].link failed', phonesMobile),
                  );
                }
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
                        name: 'ios-close',
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
                          name: 'ios-close',
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
                      text: strings.Base.cancel.toLowerCase(),
                      icon: {
                        name: 'ios-close',
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
    orderFunctions.getOrders().then(data => {
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
    navigation.navigate('CallMeBackScreen');
  };

  const onPressChat = () => {
    navigation.navigate('ChatScreen');
  };

  const onPressMap = addressData => {
    navigation.navigate('MapScreen', {
      returnScreen: 'Home',
      name: get(addressData, 'text'),
      city: get(addressData, 'city.name'),
      address: get(addressData, 'address'),
      coords: get(addressData, 'coords'),
    });
  };

  const onPressTime = () => {
    navigation.navigate('WorkTimeScreen', {
      returnScreen: 'Home',
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
    <>
      <View style={styleConst.safearea.default} testID="ContactsScreen.Wrapper">
        <Pressable
          onPress={() => navigation.navigate('ChooseDealerScreen')}
          style={[styles.buttonPrimary]}>
          <DealerItemList
            key={'dealerSelect'}
            dealer={dealerSelected}
            style={[
              {
                // marginHorizontal: 15,
                marginTop: 10,
                paddingLeft: 10,
                backgroundColor: styleConst.color.white,
              },
            ]}
            returnScreen={navigation.state?.routeName}
          />
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
            {_renderEmergencyManager({
              emergencyManagerInfo: dealerSelected.emergencyManagerInfo,
              navigation,
            })}
            {_renderInfoList({isFetchInfoList, infoList, navigation})}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
