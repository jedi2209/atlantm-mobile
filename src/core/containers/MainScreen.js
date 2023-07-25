import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {HStack, ScrollView, Text, VStack, View, Button} from 'native-base';
import DeviceInfo from 'react-native-device-info';
import {RefreshControl} from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';

import {MainScreenButton} from '../components/MainScreenButtons';
import FlagButton from '../components/FlagButton';
import RefreshSpinner from '../components/RefreshSpinner';
import DealerItemList from '../components/DealerItemList';
import Offer from '../components/Offer';

import {INFO_LIST__FAIL} from '../../info/actionTypes';
import {fetchInfoList, actionListReset} from '../../info/actions';
import {
  actionMenuOpenedCount,
  actionAppRated,
  actionFetchMainScreenSettings,
} from '../actions';

import {
  STORE_LINK,
  APP_REGION,
  DEALERS_SETTINGS,
  ERROR_NETWORK,
} from '../const';
import styleConst from '../style-const';
import {strings} from '../lang/const';

import {get} from 'lodash';
import Analytics from '../../utils/amplitude-analytics';

const {width, height} = Dimensions.get('screen');
const isApple = Platform.OS === 'ios';
const firstRowMarginTop = 3;
const infoListHeight = 250;
const cardWidth = width - 50;

const mapStateToProps = ({dealer, profile, contacts, nav, info, core}) => {
  return {
    infoList: info.list,
    isFetchInfoList: info.meta.isFetchInfoList,
    nav,
    profile,
    dealerSelected: dealer.selected,
    region: dealer.region,

    isAppRated: core.isAppRated,
    menuOpenedCount: core.menuOpenedCount,
    mainScreenSettings: core.mainScreenSettings,
  };
};

const mapDispatchToProps = {
  fetchInfoList,
  actionListReset,
  actionAppRated,
  actionMenuOpenedCount,
  actionFetchMainScreenSettings,
};

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    marginTop: infoListHeight / 2,
    height: infoListHeight,
    backgroundColor: styleConst.color.bg,
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
      return ['WebviewScreen', {uri: link.path}];
  }
};

const RowConstruct = props => {
  const {json, rowNum, rowLength, navigation, firstRow, lastRow} = props;
  if (rowLength === 1) {
    return (
      <View
        mt={firstRow ? firstRowMarginTop : 0}
        p={2}
        key={'containerRow' + rowNum}>
        {_processRow({rowData: json, rowNum, navigation, ...props})}
      </View>
    );
  } else if (rowLength === 2) {
    return (
      <View
        mt={firstRow ? firstRowMarginTop : 0}
        p={2}
        key={'containerRow' + rowNum}>
        <HStack justifyContent={'space-between'} space={1}>
          {_processRow({rowData: json, rowNum, navigation, ...props})}
        </HStack>
      </View>
    );
  } else if (rowLength > 2) {
    return (
      <ScrollView
        p={2}
        mt={firstRow ? firstRowMarginTop : 0}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        horizontal={true}>
        <HStack justifyContent={'space-around'} space={3}>
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
  const {dealerSelected, rowData, rowNum, navigation, route} = props;
  let i = 0;
  let onPressBlockButton = () => {};

  return rowData.map(item => {
    i++;
    let widthNew = null;
    let heightNew = null;
    let style = {};
    let titleBackgroundStyle = {};

    const screenName = item.link.path;
    const screenImgAsset = screenName + '.png';
    const isDealerButton =
      screenName === 'ChooseDealerScreen' || screenName === 'DealerInfoScreen';
    if (isDealerButton) {
      item.img = dealerSelected.img.main[0];
      item.title.text = dealerSelected.name;
      item.titleStyle = {
        fontSize: 9,
        bottom: 0,
      };
      titleBackgroundStyle = {
        borderBottomRightRadius: styleConst.borderRadius,
        borderBottomLeftRadius: styleConst.borderRadius,
        bottom: 0,
      };
    }

    if (item.type === 'half') {
      widthNew = width / 2.1;
      heightNew = width / 2.1;
    }

    if (item?.link?.type === 'url') {
      onPressBlockButton = () => Linking.openURL(item?.link?.path);
    } else {
      const [link, linkParams] = _linkProcess(item.link, props);
      onPressBlockButton = () => navigation.navigate(link, linkParams);
    }

    if (i === rowData.length) {
      style = {marginRight: 18};
    }

    if (isDealerButton) {
      return (
        <DealerItemList
          key={'dealerSelect'}
          dealer={dealerSelected}
          showBrands={
            get(DEALERS_SETTINGS, 'hideBrands', []).includes(dealerSelected.id)
              ? false
              : true
          }
          goBack={true}
          returnScreen={
            item?.link?.params?.returnScreen
              ? item?.link?.params?.returnScreen
              : route.name
          }
        />
      );
    }

    return (
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
        style={style}
        titleBackgroundStyle={titleBackgroundStyle}
      />
    );
  });
};

const fetchInfoData = props => {
  const {region, fetchInfoList} = props;
  fetchInfoList(region).then(action => {
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
  } else if (infoList && infoList.length) {
    return (
      <View px={2} pt={2} testID="ContactsScreen.currentActionsHeading">
        <HStack justifyContent={'space-between'}>
          <Text py={2} fontSize={16} fontFamily={styleConst.font.regular}>
            {strings.Menu.main.actions}
          </Text>
          <Text
            py={2}
            pl={4}
            onPress={() => navigation.navigate('InfoList')}
            color={styleConst.color.lightBlue}
            fontSize={16}>
            {strings.Base.all}
          </Text>
        </HStack>
        <Carousel
          data={infoList}
          renderItem={item => {
            return (
              <Offer
                key={`carousel-article-${item.hash}`}
                data={item}
                width={cardWidth}
                height={infoListHeight}
                imageStyle={{borderRadius: styleConst.borderRadius}}
                imagePressable={true}
              />
            );
          }}
          sliderWidth={width}
          itemWidth={cardWidth}
          inactiveSlideScale={0.98}
          loop={true}
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
    isFetchInfoList,
    infoList,
    fetchInfoList,
  } = props;
  const [isLoading, setLoading] = useState(false);

  let i = 0;

  useEffect(() => {
    Analytics.logEvent('screen', 'main screen');
    fetchInfoData({region, fetchInfoList});
  }, [region]);

  const _onRefresh = () => {
    setLoading(true);
    fetchInfoData({region, fetchInfoList}).then(() => {
      props.actionFetchMainScreenSettings(APP_REGION).then(res => {
        setLoading(false);
      });
    });
  };

  if (!mainScreenSettings) {
    return null;
  }

  return (
    <ScrollView
      style={styleConst.safearea.default}
      testID="MainScreen.Wrapper"
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
              {...props}
            />
          );
        })}
        {_renderInfoList({isFetchInfoList, infoList, navigation})}
        <View px={2} pt={2}>
          <FlagButton
            style={{padding: 10}}
            styleText={{textAlign: 'center'}}
            onPress={() => navigation.navigate('IntroScreenNew')}
            country={region}
            type={'button'}
            variant={'unstyle'}
            backgroundColor={styleConst.color.bg}
            shadow={null}
          />
        </View>
        <View px={2}>
          <Button
            variant="link"
            size="md"
            borderColor={styleConst.color.accordeonGrey1}
            onPress={() => Linking.openURL(STORE_LINK[Platform.OS])}>
            <Text
              selectable={false}
              fontFamily={styleConst.font.regular}
              fontSize={12}
              color={styleConst.color.lightBlue}
              opacity={0.5}>
              {'v. ' +
                DeviceInfo.getVersion() +
                '.' +
                DeviceInfo.getBuildNumber()}
            </Text>
          </Button>
        </View>
      </VStack>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
