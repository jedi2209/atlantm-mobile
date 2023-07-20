import React, {useState, useEffect, useRef} from 'react';
import {Dimensions, Linking} from 'react-native';
import {
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
  View,
  Pressable,
} from 'native-base';
import {connect} from 'react-redux';

import {fetchInfoList, actionListReset} from '../../info/actions';
import {actionMenuOpenedCount, actionAppRated} from '../../core/actions';

import styleConst from '../../core/style-const';
import {MainScreenButton} from '../components/MainScreenButtons';
import FlagButton from '../../core/components/FlagButton';

const {width, height} = Dimensions.get('screen');

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
};

const _linkProcess = (link, props) => {
  switch (link.type) {
    case 'screen':
      if (link.path === 'WebviewScreen') {
        return ['WebviewScreen', {html: link.path}];
      }
      if (link?.params) {
        return [link.path, link.params];
      }
      return [link.path];
    case 'webview':
      return ['WebviewScreen', {html: link.path}];
  }
};

const BlockConstruct = ({json, rowNum, dealerSelected, navigation}) => {
  let i = 0;
  let onPressBlockButton = () => {};
  return json.map(item => {
    i++;
    if (item?.link?.type === 'url') {
      onPressBlockButton = () => Linking.openURL(item?.link?.path);
    } else {
      const [link, linkParams] = _linkProcess(item.link);
      onPressBlockButton = () => navigation.navigate(link, linkParams);
    }
    return (
      <View p={2} key={'container' + rowNum + i}>
        <MainScreenButton
          title={item.title?.text}
          type={item.title?.position}
          size={item.type}
          onPress={onPressBlockButton}
          background={require('../../../assets/mainScreen/service.png')}
        />
      </View>
    );
  });
};

const MainScreen = props => {
  const {navigation, dealerSelected, region, mainScreenSettings} = props;

  if (!mainScreenSettings) {
    return null;
  }

  const firstRow = mainScreenSettings.shift();
  let onPressBlockButton = () => {};

  let i = 0;

  //   <MainScreenButton
  //   title={'Табло выдачи автомобиля'}
  //   onPress={() => navigation.navigate('TvaScreenBase')}
  //   background={require('../../../assets/mainScreen/tva.png')}
  // />
  // <MainScreenButton
  //   title={'Отзывы об автоцентрах'}
  //   onPress={() => navigation.navigate('ReviewsScreen')}
  //   background={require('../../../assets/mainScreen/eko.png')}
  // />

  return (
    <ScrollView style={styleConst.safearea.default} testID="MainScreen.Wrapper">
      <VStack style={{paddingBottom: 100}}>
        <ScrollView
          mt={3}
          p={2}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          horizontal={true}>
          <HStack justifyContent={'space-around'} space={3}>
            {/* {firstRow.map(item => {
              if (item?.link?.type === 'url') {
                onPressBlockButton = () => Linking.openURL(item?.link?.path);
              } else {
                const [link, linkParams] = _linkProcess(item.link, ...props);
                onPressBlockButton = () =>
                  navigation.navigate(link, linkParams);
              }
              if (
                dealerSelected.emergencyManagerInfo &&
                item.link.params.eval ===
                  'props.dealerSelected.emergencyManagerInfo'
              ) {
                onPressBlockButton = () => {
                  navigation.navigate('WebviewScreen', {
                    html: dealerSelected.emergencyManagerInfo,
                  });
                };
                return (
                  <MainScreenButton
                    title={item.title?.text}
                    type={item.title?.position}
                    size={item.type}
                    onPress={onPressBlockButton}
                    background={require('../../../assets/emergency_manager.jpg')}
                  />
                );
              }
            })} */}
          </HStack>
        </ScrollView>
        {mainScreenSettings.map(el => {
          i++;
          return (
            <BlockConstruct key={'row' + i} rowNum={i} json={el} {...props} />
          );
        })}
        <View p={2}>
          <MainScreenButton
            title={'Записаться на сервис'}
            type={'bottom'}
            size={'full'}
            onPress={() => navigation.navigate('ServiceScreen')}
            background={require('../../../assets/mainScreen/service.png')}
          />
        </View>
        <View p={2}>
          <HStack justifyContent={'space-between'} space={1}>
            <MainScreenButton
              title={'Новые\r\nавтомобили'}
              subTitle={'362 авто в наличии'}
              titleStyle={{
                color: '#232323',
                paddingTop: 18,
                paddingHorizontal: 20,
                textAlign: 'left',
                fontSize: 16,
              }}
              subTitleStyle={{
                color: '#000000',
                opacity: 0.7,
                textAlign: 'left',
                fontSize: 10,
                paddingHorizontal: 20,
                top: 50,
              }}
              width={width / 2.1}
              height={width / 2.1}
              size={'half'}
              onPress={() =>
                navigation.navigate('CarsStock', {
                  screen: 'MainFilterScreen',
                  params: {
                    stockTypeDefault: 'New',
                  },
                })
              }
              background={require('../../../assets/mainScreen/newCars.png')}
            />
            <MainScreenButton
              title={'Автомобили с\r\nпробегом'}
              subTitle={'233 авто в наличии'}
              titleStyle={{
                color: '#DFDFDF',
                paddingTop: 18,
                paddingHorizontal: 20,
                textAlign: 'left',
                fontSize: 16,
              }}
              subTitleStyle={{
                color: '#FFFFFF',
                opacity: 0.7,
                textAlign: 'left',
                fontSize: 10,
                paddingHorizontal: 20,
                top: 50,
              }}
              width={width / 2.1}
              height={width / 2.1}
              size={'half'}
              onPress={() =>
                navigation.navigate('CarsStock', {
                  screen: 'MainFilterScreen',
                  params: {
                    stockTypeDefault: 'Used',
                  },
                })
              }
              background={require('../../../assets/mainScreen/usedCars.png')}
            />
          </HStack>
        </View>
        <View p={2}>
          <MainScreenButton
            title={'Оцените моё авто'}
            type={'bottom'}
            size={'full'}
            onPress={() => navigation.navigate('CarCostScreen')}
            background={require('../../../assets/mainScreen/rate_my_car.png')}
            backgroundProps={onLoadError => {}}
          />
        </View>
        <View p={2}>
          <FlagButton
            style={{padding: 10}}
            styleText={{textAlign: 'center'}}
            onPress={() => navigation.navigate('IntroScreenNew')}
            country={region}
            type={'button'}
            variant={'unstyle'}
          />
        </View>
      </VStack>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
