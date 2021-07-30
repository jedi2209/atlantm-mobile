/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import {Text, View, Image, StyleSheet, Dimensions} from 'react-native';
import {List, ListItem, Left, Button, Body} from 'native-base';

import {actionMenuOpenedCount} from '../../core/actions';
import {connect} from 'react-redux';

import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  buttonPrimary: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: styleConst.color.white,
    borderColor: '#2E3A59',
    borderRadius: 5,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  ListItem: {
    marginLeft: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingTop: 2,
    paddingBottom: 2,
  },
  Left: {
    marginLeft: 0,
    paddingLeft: 0,
    maxWidth: 75,
  },
  Body: {
    paddingLeft: 17,
  },
  bodyText: {
    fontSize: 16,
  },
  menuButton: {
    paddingLeft: 17,
    paddingRight: 30,
    paddingTop: 0,
    paddingBottom: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 80,
    borderBottomRightRadius: 80,
  },
  buttonPrimaryText: {
    color: '#2E3A59',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const heightScreen = Dimensions.get('window').height;

const mapStateToProps = ({dealer, profile, nav, core}) => {
  return {
    nav,
    dealerSelected: dealer.selected,

    login: profile.login,

    menuOpenedCount: core.menuOpenedCount,
  };
};

const mapDispatchToProps = {
  actionMenuOpenedCount,
};

const MenuItem = (props) => {
  const {id, selected, type, name, icon, navigate} = props.data;
  const {navigation, rowHeight} = props;

  const params = {
    ...navigate?.params,
  };

  return (
    <ListItem
      key={`menu-list-item-${id}`}
      style={styles.ListItem}
      selected={selected}
      onPress={() => navigation.navigate(navigate?.url, params)}>
      <Left style={styles.Left}>
        <Button
          underlayColor={styles.buttonPrimaryText.color}
          style={[
            styles.menuButton,
            {
              height: rowHeight,
            },
            selected && typeof selected !== 'undefined'
              ? styleConst.new.menu.active
              : styleConst.new.menu.default,
          ]}>
          {icon}
        </Button>
      </Left>
      <Body style={styles.Body}>
        <Text
          selectable={false}
          style={[
            styles.bodyText,
            {
              color: selected ? '#0061ED' : '#858997',
            },
          ]}>
          {name}
        </Text>
      </Body>
    </ListItem>
  );
};

const MenuScreen = (props) => {
  const menu = [
    {
      id: 1,
      name: strings.Menu.main.autocenter,
      navigate: {
        url: 'Home',
      },
      type: 'home',
      icon: <Image source={require('../assets/Home.svg')} />,
      selected: false,
    },
    {
      id: 2,
      name: strings.Menu.main.actions,
      navigate: {
        url: 'InfoList',
      },
      type: 'sales',
      icon: <Image source={require('../assets/NewsFeeds.svg')} />,
      selected: false,
    },
    {
      id: 3,
      name: strings.Menu.main.newcars,
      navigate: {
        url: 'CarsStock',
        params: {
          screen: 'MainFilterScreen',
          params: {
            stockTypeDefault: 'New',
          },
        },
      },
      type: 'new',
      icon: <Image source={require('../assets/Car-new.svg')} />,
      selected: false,
    },
    {
      id: 4,
      name: strings.Menu.main.usedcars,
      navigate: {
        url: 'CarsStock',
        params: {
          screen: 'MainFilterScreen',
          params: {
            stockTypeDefault: 'Used',
          },
        },
      },
      type: 'not_new',
      icon: <Image source={require('../assets/Car-used.svg')} />,
      selected: false,
    },
    {
      id: 7,
      name: strings.Menu.main.reviews,
      navigate: {
        url: 'ReviewsScreen',
      },
      type: 'reviews',
      icon: <Image source={require('../assets/Eko.svg')} />,
      selected: false,
    },
    {
      id: 8,
      name: strings.Menu.main.indicators,
      navigate: {
        url: 'IndicatorsScreen',
      },
      type: 'indicators',
      icon: <Image source={require('../assets/Indicators.svg')} />,
      selected: false,
    },
    {
      id: 9,
      name: strings.Menu.main.settings,
      navigate: {
        url: 'SettingsScreen',
      },
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
          navigate: {
            url: 'ServiceScreen',
          },
          type: 'service',
          icon: <Image source={require('../assets/Service.svg')} />,
          selected: false,
        },
        {
          id: 6,
          name: strings.Menu.main.tva,
          navigate: {
            url: 'TvaScreen',
          },
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

  const rowHeight = (heightScreen - 246) / menu.length;

  const [count] = useState(props.menuOpenedCount);

  return (
    <View testID="MenuScreen.Wrapper">
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
      {/* <View>
          <Button
            full
            onPress={() => {
              if (props.login.id) {
                props.navigation.navigate('LoginScreen');
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);
