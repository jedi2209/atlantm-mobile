/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {Text, View, Image, StyleSheet, Dimensions} from 'react-native';
import {Icon, List, ListItem, Left, Button, Body} from 'native-base';

import styleConst from '../../core/style-const';

import {connect} from 'react-redux';

import strings from '../../core/lang/const';
import LogoTitle from '../../core/components/LogoTitle';

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
  button: {
    height: styleConst.ui.footerHeightIphone,
    // flex: 1,
    // flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.border,
    marginVertical: 0,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: styleConst.font.medium,
    fontSize: 15,
    letterSpacing: styleConst.ui.letterSpacing,
    color: styleConst.color.lightBlue,
    paddingRight: styleConst.ui.horizontalGapInList,
  },
  buttonIcon: {
    fontSize: 30,
    marginRight: 10,
    color: styleConst.color.lightBlue,
    paddingLeft: styleConst.ui.horizontalGapInList,
  },
  buttonPrimaryText: {color: '#2E3A59', fontSize: 16, fontWeight: 'bold'},
});

const heightScreen = Dimensions.get('window').height;

const MenuItem = (props) => {
  const {id, selected, type, name, icon, navigateUrl} = props.data;
  const {navigation, rowHeight} = props;

  return (
    <ListItem
      key={`menu-list-item-${id}`}
      style={{
        marginLeft: 0,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        paddingTop: 2,
        paddingBottom: 2,
      }}
      selected={selected}
      onPress={() =>
        navigation.navigate(navigateUrl, {returnScreen: 'MoreScreen'})
      }>
      <Left style={{marginLeft: 0, paddingLeft: 0, maxWidth: 75}}>
        <Button
          underlayColor={styles.buttonPrimaryText.color}
          style={[
            {
              paddingLeft: 17,
              paddingRight: 30,
              height: rowHeight,
              paddingTop: 0,
              paddingBottom: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 80,
              borderBottomRightRadius: 80,
            },
            selected && typeof selected !== 'undefined'
              ? styleConst.new.menu.active
              : styleConst.new.menu.default,
          ]}>
          {icon}
        </Button>
      </Left>
      <Body style={{paddingLeft: 17}}>
        <Text
          selectable={false}
          style={{
            fontSize: 16,
            color: selected ? '#0061ED' : '#858997',
          }}>
          {name}
        </Text>
      </Body>
      {/* <Right>
        <Icon
          name="arrow-forward"
          style={{
            marginTop: 3,
          }}
        />
      </Right> */}
    </ListItem>
  );
};

const mapStateToProps = ({dealer, profile, nav}) => {
  return {
    nav,
    listRussia: dealer.listRussia,
    listUkraine: dealer.listUkraine,
    listBelarussia: dealer.listBelarussia,
    dealerSelected: dealer.selected,

    isFetchProfileData: profile.meta.isFetchProfileData,

    login: profile.login,
    password: profile.password,
    isLoginRequest: profile.meta.isLoginRequest,

    bonus: profile.bonus.data,
    discounts: profile.discounts,
  };
};

const MoreScreen = (props) => {
  const menu = [
    {
      id: 1,
      name: strings.Menu.main.autocenter,
      navigateUrl: 'Home',
      type: 'home',
      icon: <Image source={require('../assets/Home.svg')} />,
      selected: false,
    },
    {
      id: 2,
      name: strings.Menu.main.actions,
      navigateUrl: 'InfoList',
      type: 'sales',
      icon: <Image source={require('../assets/NewsFeeds.svg')} />,
      selected: false,
    },
    {
      id: 3,
      name: strings.Menu.main.newcars,
      navigateUrl: 'NewCarListScreen',
      type: 'new',
      icon: <Image source={require('../assets/Car-new.svg')} />,
      selected: false,
    },
    {
      id: 4,
      name: strings.Menu.main.usedcars,
      navigateUrl: 'UsedCarListScreen',
      type: 'not_new',
      icon: <Image source={require('../assets/Car-used.svg')} />,
      selected: false,
    },
    {
      id: 7,
      name: strings.Menu.main.reviews,
      navigateUrl: 'ReviewsScreen',
      type: 'reviews',
      icon: <Image source={require('../assets/Eko.svg')} />,
      selected: false,
    },
    {
      id: 8,
      name: strings.Menu.main.indicators,
      navigateUrl: 'IndicatorsScreen',
      type: 'indicators',
      icon: <Image source={require('../assets/Indicators.svg')} />,
      selected: false,
    },
    {
      id: 9,
      name: strings.Menu.main.settings,
      navigateUrl: 'SettingsScreen',
      type: 'settings',
      icon: <Image source={require('../assets/Settings.svg')} />,
      selected: false,
    },
  ];

  if (props.dealerSelected.divisionTypes) {
    // if (props.dealerSelected.divisionTypes.includes('ZM')) {
    //   // новые авто
    //   menu.push({
    //     id: 6,
    //     name: 'Отзывы',
    //     navigateUrl: 'ReviewsScreen',
    //     type: 'reviews',
    //     selected: false,
    //   });
    // }
    if (props.dealerSelected.divisionTypes.includes('ST')) {
      // сервис
      menu.push(
        {
          id: 5,
          name: strings.Menu.main.service,
          navigateUrl: 'ServiceScreen',
          type: 'service',
          icon: <Image source={require('../assets/Service.svg')} />,
          selected: false,
        },
        {
          id: 6,
          name: strings.Menu.main.tva,
          navigateUrl: 'TvaScreen',
          type: 'new',
          icon: <Image source={require('../assets/Car-lifter.svg')} />,
          selected: false,
        },
      );
    }
  }

  menu.sort((a, b) => {
    return a.id - b.id;
  });

  const rowHeight = (heightScreen - 80 - 82 - 4 - 80) / (menu.length + 1);

  return (
    <View>
      <List style={{marginTop: 0}}>
        {menu.map((item) => (
          <MenuItem
            key={`menu-item-${item.id}`}
            data={item}
            navigation={props.navigation}
            rowHeight={rowHeight}
          />
        ))}
      </List>
      <Button
        onPress={() => {
          props.navigation.navigate('BonusScreenInfo', {
            refererScreen: 'MoreScreen',
            returnScreen: 'MoreScreen',
          });
        }}
        full
        iconLeft
        style={[
          styleConst.shadow.default,
          styles.button,
          {
            borderBottomWidth: 0,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
          },
        ]}>
        <Icon name="price-ribbon" type="Entypo" style={styles.buttonIcon} />
        <Text numberOfLines={1} style={styles.buttonText}>
          {strings.Menu.main.bonus}
        </Text>
      </Button>
      {/* <View>
          <Button
            full
            onPress={() => {
              if (props.login.id) {
                props.navigation.navigate('ProfileScreenInfo');
              } else {
                props.navigation.navigate('ProfileScreen');
              }
            }}
            style={styles.buttonPrimary}>
            <Text style={styles.buttonPrimaryText}>ЛИЧНЫЙ КАБИНЕТ</Text>
          </Button>
        </View> */}
    </View>
  );
};

MoreScreen.navigationOptions = () => ({
  headerTitle: () => <LogoTitle />,
  headerStyle: {
    height: 80,
  },
  tabBarLabel: strings.Menu.bottom.menu,
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

export default connect(mapStateToProps, null)(MoreScreen);
