import React, {useState, useEffect, useRef} from 'react';
import {HStack, Image, ScrollView, Text, VStack, View} from 'native-base';
import {connect} from 'react-redux';

import {fetchInfoList, actionListReset} from '../../info/actions';
import {actionMenuOpenedCount, actionAppRated} from '../../core/actions';

import styleConst from '../../core/style-const';
import {MainScreenButton} from '../components/MainScreenButtons';
import nav from '../../navigation/reducers';

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
  fetchInfoList,
  actionListReset,
  actionAppRated,
  actionMenuOpenedCount,
};

const MainScreen = props => {
  const {navigation, dealerSelected} = props;

  return (
    <View style={[styleConst.safearea.default]} testID="MainScreen.Wrapper">
      <VStack>
        <ScrollView
          mt={3}
          p={2}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          horizontal={true}>
          <HStack justifyContent={'space-around'} space={3}>
            {dealerSelected.emergencyManagerInfo ? (
              <MainScreenButton
                title={'Аварийный менеджер'}
                onPress={() =>
                  navigation.navigate('WebviewScreen', {
                    html: dealerSelected.emergencyManagerInfo,
                  })
                }
                background={require('../../../assets/emergency_manager.jpg')}
                type={'bottom'}
              />
            ) : null}
            <MainScreenButton
              title={'Табло выдачи автомобиля'}
              onPress={() => navigation.navigate('TvaScreenBase')}
              background={require('../../../assets/mainScreen/tva.png')}
            />
            <MainScreenButton
              title={'Отзывы об автоцентрах'}
              onPress={() => navigation.navigate('ReviewsScreen')}
              background={require('../../../assets/mainScreen/eko.png')}
            />
          </HStack>
        </ScrollView>
        <View p={2}>
          <MainScreenButton
            title={'Записаться на сервис'}
            type={'bottom'}
            size={'full'}
            onPress={() => navigation.navigate('ServiceScreen')}
            background={require('../../../assets/mainScreen/service.png')}
          />
        </View>
        <View>
          <HStack justifyContent={'space-between'}>
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
                fontSize: 8,
                paddingHorizontal: 20,
                top: 50,
              }}
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
                fontSize: 8,
                paddingHorizontal: 20,
                top: 50,
              }}
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
          />
        </View>
      </VStack>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
