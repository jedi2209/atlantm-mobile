import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import {connect} from 'react-redux';
import {HStack, ScrollView, Text, VStack, View} from 'native-base';
import {RefreshControl} from 'react-native-gesture-handler';
import Carousel from '../components/Carousel';

import Tooltip from 'react-native-walkthrough-tooltip';

import {MainScreenButton} from '../components/MainScreenButtons';
import RefreshSpinner from '../components/RefreshSpinner';
import Offer from '../components/Offer';

import {INFO_LIST__FAIL} from '../../info/actionTypes';
import {fetchInfoList} from '../../info/actions';
import {fetchDealers, fetchBrands} from '../../dealer/actions';
import {
  actionMenuOpenedCount,
  actionAppLoaded,
  actionFetchMainScreenSettings,
  actionWalktroughVisible,
} from '../actions';

import {ERROR_NETWORK} from '../const';
import styleConst from '../style-const';
import {strings} from '../lang/const';

import {get} from 'lodash';
import Analytics from '../../utils/amplitude-analytics';
import {usePrevious} from '../../utils/hooks';
import LogoLoader from '../components/LogoLoader';

const {width} = Dimensions.get('screen');
const isApple = Platform.OS === 'ios';
const firstRowMarginTop = 1;
const infoListHeight = width / 1.12;

const mapStateToProps = ({dealer, profile, contacts, nav, info, core}) => {
  return {
    infoList: info.list,
    isFetchInfoList: info.meta.isFetchInfoList,
    nav,
    profile,
    region: dealer.region,
    listDealers: dealer.listDealers,

    isAppLoaded: core.isAppLoaded,
    isWalkthroughShownAlready: core.isWalkthroughShown,
    menuOpenedCount: core.menuOpenedCount,
    mainScreenSettings: core.mainScreenSettings,
  };
};

const mapDispatchToProps = {
  fetchInfoList,
  actionMenuOpenedCount,
  actionFetchMainScreenSettings,
  actionAppLoaded,
  fetchDealers,
  fetchBrands,
  actionWalktroughVisible,
};

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    marginTop: infoListHeight / 2,
    height: infoListHeight,
    backgroundColor: styleConst.color.bg,
  },
  VersionContainer: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  TextVersionInfo: {
    fontSize: 12,
    fontFamily: styleConst.font.light,
    color: styleConst.color.lightBlue,
  },
  langHeading: {
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
    fontSize: 24,
  },
  pushHeading: {
    fontSize: 16,
    color: styleConst.color.white,
    fontFamily: styleConst.font.medium,
  },
  pushText: {
    fontSize: 14,
    color: styleConst.color.white,
    fontFamily: styleConst.font.light,
  },
  pushButton: {
    borderColor: styleConst.color.white,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 0,
  },
  userAgreementText: {
    fontSize: 12,
    fontFamily: styleConst.font.light,
    color: styleConst.color.lightBlue,
  },
});

const _linkProcess = (link, props) => {
  switch (link.type) {
    case 'screen':
      if (link.path === 'WebviewScreen') {
        if (link?.params?.getValue) {
          const linkValue = link.params.getValue.split('.');
          const linkObject = linkValue.shift();
          if (linkObject === 'props') {
            const htmlData = get(props, linkValue.join('.'));
            if (htmlData) {
              return ['WebviewScreen', {html: htmlData}];
            }
          }
        }
        return ['WebviewScreen', {html: link.path}];
      }
      if (link?.params) {
        return [link.path, link.params];
      }
      return [link.path];
    case 'webview':
      return ['WebviewScreen', {uri: link.path, linkParams: link.params}];
  }
};

const RowConstruct = props => {
  const {json, rowNum, rowLength, navigation, firstRow, lastRow} = props;
  const rowType = get(json[0], 'type', null);
  if (rowLength === 1) {
    return (
      <View
        mt={firstRow ? firstRowMarginTop : 0}
        p={rowType === 'actions' ? 0 : 1}
        key={'containerRow' + rowNum}>
        {_processRow({rowData: json, rowNum, navigation, ...props})}
      </View>
    );
  } else if (rowLength === 2) {
    return (
      <View
        mt={firstRow ? firstRowMarginTop : 0}
        p={1}
        key={'containerRow' + rowNum}>
        <HStack justifyContent={'left'} space={1}>
          {_processRow({rowData: json, rowNum, navigation, ...props})}
        </HStack>
      </View>
    );
  } else if (rowLength > 2) {
    return (
      <ScrollView
        mt={firstRow ? firstRowMarginTop : 0}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        horizontal={true}>
        <HStack justifyContent={'space-around'} space={2} p={1}>
          {_processRow({rowData: json, rowNum, navigation, ...props})}
        </HStack>
      </ScrollView>
    );
  }

  return (
    <View
      mt={firstRow ? firstRowMarginTop : 0}
      p={2}
      key={'containerRow' + rowNum}>
      {_processRow({rowData: json, rowNum, navigation, ...props})}
    </View>
  );
};

const _processRow = props => {
  const {
    rowData,
    rowNum,
    navigation,
    route,
    walkthroughData,
    setTooltipVisible,
    isFetchInfoList,
    infoList,
  } = props;
  let i = 0;
  let onPressBlockButton = () => {};
  return rowData.map(item => {
    i++;
    let widthNew = null;
    let heightNew = null;
    let styleNew = {};
    let titleBackgroundStyle = {};

    const screenName = item.link.path;
    const isDealerButton =
      screenName === 'ChooseDealerScreen' || screenName === 'DealerInfoScreen';
    if (isDealerButton) {
      if (!item.title.text) {
        item.title.text = strings.Menu.main.autocenters;
      }
      titleBackgroundStyle = {
        borderBottomRightRadius: styleConst.borderRadius,
        borderBottomLeftRadius: styleConst.borderRadius,
        bottom: 0,
      };
    }

    if (item.type === 'half') {
      widthNew = width / 2.06;
      heightNew = width / 2.1;
    }

    if (item?.link?.type === 'url') {
      onPressBlockButton = () => Linking.openURL(item?.link?.path);
    } else {
      const [link, linkParams] = _linkProcess(item.link, props);
      onPressBlockButton = () => navigation.navigate(link, linkParams);
    }

    if (i === rowData.length) {
      styleNew = {marginRight: 18};
    }

    switch (item.type) {
      case 'dealersButton':
        let backgroundImage;
        if (get(item, 'img', false)) {
          backgroundImage = {uri: item.img};
        } else {
          backgroundImage = require('../../../assets/mainScreen/dealers.png');
        }
        return (
          <Tooltip
            isVisible={item.key === get(walkthroughData, 'visible')}
            content={<Text>{get(item, 'walkthroughText', '')}</Text>}
            allowChildInteraction={false}
            key={['tooltip', item.key].join('_')}
            showChildInTooltip={true}
            placement="bottom"
            onClose={() => setTooltipVisible()}>
            <MainScreenButton
              key={['button', 'dealers', 'select'].join('_')}
              title={item.title.text}
              background={backgroundImage}
              size={'full'}
              type={'bottom'}
              onPress={() =>
                navigation.navigate('ChooseDealerScreen', {
                  returnScreen: item?.link?.params?.returnScreen
                    ? item?.link?.params?.returnScreen
                    : route.name,
                  goBack: true,
                  updateDealers: true,
                })
              }
            />
          </Tooltip>
        );
      case 'actions':
        return _renderActions({isFetchInfoList, infoList, navigation});
      default:
        return (
          <Tooltip
            isVisible={item.key === get(walkthroughData, 'visible')}
            content={
              <Text>{item.walkthroughText ? item.walkthroughText : ''}</Text>
            }
            allowChildInteraction={false}
            showChildInTooltip={true}
            childrenWrapperStyle={{
              marginLeft: item.type === 'small' ? 0 : 10,
            }}
            topAdjustment={0}
            horizontalAdjustment={!isApple ? -3 : 0}
            placement="top"
            key={['tooltip', item.key].join('_')}
            onClose={() => setTooltipVisible()}>
            <MainScreenButton
              key={['button', rowNum, i].join('_')}
              title={item.title?.text.replace('||', '\n')}
              titleStyle={item?.titleStyle}
              subTitle={item.subTitle?.replace('||', '\n')}
              subTitleStyle={item?.subTitleStyle}
              type={item?.titleStyle ? null : item.title?.position}
              size={item.type}
              link={item.link}
              width={widthNew ? widthNew : null}
              height={heightNew ? heightNew : null}
              onPress={onPressBlockButton}
              background={{uri: item?.img}}
              style={styleNew}
              titleBackgroundStyle={titleBackgroundStyle}
            />
          </Tooltip>
        );
    }
  });
};

const fetchInfoData = async props => {
  return props.fetchInfoList(props.region).then(action => {
    if (action && action.type && action.type === INFO_LIST__FAIL) {
      let message = get(
        action,
        'payload.message',
        strings.Notifications.error.text,
      );

      if (message === 'Network request failed') {
        message = ERROR_NETWORK;
      }
      return false;
    }
    return true;
  });
};

const _renderActions = params => {
  const {isFetchInfoList, infoList, navigation} = params;
  let infoListChanged = infoList;
  if (isFetchInfoList) {
    return (
      <View style={styles.spinnerContainer} key={'actionsLoader'}>
        <ActivityIndicator
          color={styleConst.color.blue}
          style={styleConst.spinner}
        />
      </View>
    );
  } else if (infoList?.length) {
    if (infoList?.length > 12 && !isApple) {
      infoListChanged = infoList.slice(0, 12);
    }
    return (
      <View
        py={2}
        testID="ContactsScreen.currentActionsHeading"
        key={'actionsMainScreen'}>
        <HStack py={2} px={2} justifyContent={'space-between'}>
          <Text fontSize={16} fontFamily={styleConst.font.regular}>
            {strings.Menu.main.actions}
          </Text>
          <Text
            onPress={() => navigation.navigate('InfoList')}
            color={styleConst.color.lightBlue}
            fontSize={16}>
            {strings.Base.all}
          </Text>
        </HStack>
        <Carousel
          data={infoListChanged}
          mode={'parallax'}
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          autoPlay={true}
          renderItem={({item}) => {
            return (
              <Offer
                key={`carousel-article-${item.hash}`}
                data={item}
                height={infoListHeight}
                imageStyle={{borderRadius: styleConst.borderRadius}}
                imagePressable={false}
              />
            );
          }}
          height={440}
        />
      </View>
    );
  }
  return <></>;
};

const MainScreen = props => {
  const {
    navigation,
    region,
    mainScreenSettings,
    fetchInfoList,
    fetchBrands,
    fetchDealers,
    listDealers,
    isAppLoaded,
  } = props;
  const [isLoading, setLoading] = useState(true);
  const [walkthroughData, setWalkthroughData] = useState({});
  const [walkthroughVisibleIndex, setWalkthroughVisibleIndex] = useState(1);
  const colorScheme = useColorScheme() || 'light';
  const prevRegion = usePrevious(region);

  const scrollRef = useRef();

  let i = 0;

  useEffect(() => {
    Analytics.logEvent('screen', 'main screen');
    if (listDealers && Object.keys(listDealers).length === 0) {
      fetchDealers();
    }
    setLoading(false);
    return () => {
      setLoading(true);
    };
  }, [region, fetchInfoList, colorScheme, listDealers, fetchDealers]);

  useEffect(() => {
    if (prevRegion !== region) {
      setLoading(true);
      fetchInfoData({region, fetchInfoList});
      fetchBrands(); // обновляем бренды при первом открытии экрана
      props.actionFetchMainScreenSettings(region).then(res => {
        props.actionMenuOpenedCount();
        props.actionAppLoaded(true);
        if (res.payload.length && !props.isWalkthroughShownAlready) {
          let walkthroughDataObj = {};
          let iCount = 1;
          res.payload.map(row => {
            row.map(item => {
              if (item.walkthroughText) {
                walkthroughDataObj[iCount] = {
                  key: item.key,
                  text: item.walkthroughText,
                };
                ++iCount;
              }
            });
          });
          if (get(walkthroughDataObj, '1', false)) {
            walkthroughDataObj.visible = walkthroughDataObj[1].key;
            setWalkthroughData(walkthroughDataObj);
          }
        }
        setLoading(false);
      });
    }
  }, [region, isAppLoaded]);

  const _onRefresh = async () => {
    setLoading(true);
    await props.actionFetchMainScreenSettings(region);
    props.actionMenuOpenedCount();
    setLoading(false);
  };

  if (isLoading || !mainScreenSettings || !mainScreenSettings.length) {
    return <LogoLoader style={{top: -60}} />;
  }

  return (
    <ScrollView
      style={styleConst.safearea.default}
      testID="MainScreen.Wrapper"
      ref={scrollRef}
      refreshControl={
        isApple ? (
          <RefreshSpinner isRequest={isLoading} onRefresh={_onRefresh} />
        ) : (
          <RefreshControl refreshing={isLoading} onRefresh={_onRefresh} />
        )
      }>
      <VStack paddingBottom={styleConst.menu.paddingBottom}>
        {mainScreenSettings.map(el => {
          i++;
          let rowFirst = false;
          let rowLast = false;

          if (i === 1) {
            rowFirst = true;
          }
          if (i === mainScreenSettings.length) {
            rowLast = true;
          }
          return (
            <RowConstruct
              key={'row' + i}
              rowNum={i}
              rowLength={el.length}
              json={el}
              firstRow={rowFirst}
              lastRow={rowLast}
              walkthroughData={walkthroughData}
              setTooltipVisible={() => {
                const newIndex = walkthroughVisibleIndex + 1;
                const walkthroughLength = Object.keys(walkthroughData).length;
                setWalkthroughVisibleIndex(newIndex);
                if (walkthroughLength - 1 === newIndex) {
                  setWalkthroughData({...walkthroughData, visible: null});
                  scrollRef.current?.scrollToEnd({
                    animated: true,
                  });
                  setTimeout(() => {
                    setWalkthroughData({
                      ...walkthroughData,
                      visible: get(walkthroughData[newIndex], 'key', null),
                    });
                  }, 700);
                } else {
                  setWalkthroughData({
                    ...walkthroughData,
                    visible: get(walkthroughData[newIndex], 'key', null),
                  });
                }
                if (!get(walkthroughData[newIndex], 'key', false)) {
                  props.actionWalktroughVisible(true);
                }
              }}
              {...props}
            />
          );
        })}
        {/* <Pressable px={2} pt={2} onPress={() => {}}>
          <HStack justifyContent={'space-between'}>
            <Text py={2} fontSize={16} fontFamily={styleConst.font.regular}>
              {strings.Menu.main.autocenters}
            </Text>
          </HStack>
          <Box
            borderWidth="1"
            borderColor="coolGray.300"
            bg={styleConst.color.green}
            borderRadius={styleConst.borderRadius}
            shadow={styleConst.shadow.default}
            style={[styles.block]}>
            <MapView
              key={'map' + colorScheme}
              provider={PROVIDER_GOOGLE}
              mapType={isApple ? 'mutedStandard' : 'none'}
              scrollEnabled={false}
              rotateEnabled={false}
              zoomControlEnabled={false}
              zoomTapEnabled={false}
              scrollDuringRotateOrZoomEnabled={false}
              pitchEnabled={false}
              toolbarEnabled={false}
              loadingEnabled={true}
              showsCompass={false}
              liteMode={true}
              showsIndoors={false}
              userInterfaceStyle={colorScheme}
              initialRegion={{
                latitude: 53.893009,
                longitude: 27.567444,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={{
                height: 300,
                borderRadius: styleConst.borderRadius,
              }}
            />
          </Box>
        </Pressable> */}
      </VStack>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
