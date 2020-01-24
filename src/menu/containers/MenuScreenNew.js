/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {Text, View, Image, StyleSheet, ScrollView} from 'react-native';
import {Icon, List, ListItem, Left, Right, Button, Body} from 'native-base';

import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  buttonPrimary: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderColor: '#2E3A59',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  buttonPrimaryText: {color: '#2E3A59', fontSize: 16, fontWeight: 'bold'},
});

const MenuItem = props => {
  const {id, selected, type, name, navigateUrl} = props.data;
  const {navigation} = props;

  return (
    <ListItem
      key={`menu-list-item-${id}`}
      style={{
        marginLeft: 0,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        paddingTop: 5,
        paddingBottom: 5,
      }}
      selected={selected}
      onPress={() => navigation.navigate(navigateUrl)}>
      <Left style={{marginLeft: 0, paddingLeft: 0, maxWidth: 75}}>
        <Button
          underlayColor={styles.buttonPrimaryText.color}
          style={[
            {
              paddingLeft: 17,
              paddingRight: 30,
              height: 55,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 80,
              borderBottomRightRadius: 80,
            },
            selected && typeof selected !== 'undefined'
              ? styleConst.new.menu.active
              : styleConst.new.menu.default,
          ]}>
          {type === 'home' && <Image source={require('../assets/Home.svg')} />}
          {type === 'sales' && (
            <Image source={require('../assets/NewsFeeds.svg')} />
          )}
          {type === 'new' && (
            <Image source={require('../assets/Car-new.svg')} />
          )}
          {type === 'not_new' && (
            <Image source={require('../assets/Car-used.svg')} />
          )}
          {type === 'service' && (
            <Image source={require('../assets/Service.svg')} />
          )}
          {type === 'reviews' && (
            <Image source={require('../assets/Eko.svg')} />
          )}
          {type === 'indicators' && (
            <Image source={require('../assets/Indicators.svg')} />
          )}
        </Button>
      </Left>
      <Body style={{paddingLeft: 17}}>
        <Text
          style={{
            fontSize: 16,
            color: selected ? '#0061ED' : '#858997',
          }}>
          {name}
        </Text>
      </Body>
      <Right>
        <Icon
          name="arrow-forward"
          style={{
            marginTop: 3,
          }}
        />
      </Right>
    </ListItem>
  );
};

import {connect} from 'react-redux';

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    dealerSelected: dealer.selected,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    car: profile.car,
    carNumber: profile.carNumber,

    isFetchProfileData: profile.meta.isFetchProfileData,

    auth: profile.auth,
    cars: profile.cars,
    login: profile.login,
    password: profile.password,
    isLoginRequest: profile.meta.isLoginRequest,

    bonus: profile.bonus.data,
    discounts: profile.discounts,

    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const MoreScreen = props => {
  const menu = [
    {
      id: 1,
      name: 'Автоцентр',
      navigateUrl: 'Home',
      type: 'home',
      selected: false,
    },
    {
      id: 2,
      name: 'Акции',
      navigateUrl: 'InfoList',
      type: 'sales',
      selected: false,
    },
    {
      id: 3,
      name: 'Новые авто',
      navigateUrl: 'NewCarListScreen',
      type: 'new',
      selected: false,
    },
    {
      id: 4,
      name: 'Поддержанные авто',
      navigateUrl: 'UsedCarListScreen',
      type: 'not_new',
      selected: false,
    },
    {
      id: 5,
      name: 'Сервис',
      navigateUrl: 'ServiceScreen',
      type: 'service',
      selected: false,
    },
    {
      id: 8,
      name: 'Табло выдачи авто',
      navigateUrl: 'TvaScreen',
      type: 'new',
      selected: false,
    },
    {
      id: 6,
      name: 'Отзывы',
      navigateUrl: 'ReviewsScreen',
      type: 'reviews',
      selected: false,
    },
    {
      id: 7,
      name: 'Индикаторы',
      navigateUrl: 'IndicatorsScreen',
      type: 'indicators',
      selected: false,
    },
  ];

  return (
    <>
      <ScrollView>
        <List style={{marginTop: 10}}>
          {menu.map(item => (
            <MenuItem
              key={`menu-item-${item.id}`}
              data={item}
              navigation={props.navigation}
            />
          ))}
        </List>
        <View>
          <Button
            full
            onPress={() => {
              props.navigation.navigate('ProfileScreenInfo');
            }}
            style={styles.buttonPrimary}>
            <Text style={styles.buttonPrimaryText}>ЛИЧНЫЙ КАБИНЕТ</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

class LogoTitle extends React.Component {
  render() {
    return (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingVertical: 10,
          marginTop: 10,
        }}>
        <Image
          resizeMode="contain"
          style={{height: 70}}
          source={require('../assets/logo-horizontal.svg')}
        />
      </View>
    );
  }
}

MoreScreen.navigationOptions = () => ({
  headerTitle: () => <LogoTitle />,
  headerStyle: {
    height: 100,
  },
  tabBarLabel: 'Меню',
  tabBarIcon: ({focused}) => (
    <Icon
      name="bars"
      type="FontAwesome5"
      style={[
        {
          fontSize: 24,
          color: focused ? styleConst.new.blueHeader : styleConst.new.passive,
        },
        focused ? styleConst.new.shadowActive : null,
      ]}
    />
  ),
});

export default connect(mapStateToProps)(MoreScreen);
