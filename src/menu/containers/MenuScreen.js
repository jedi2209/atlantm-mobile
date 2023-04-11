/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import {VStack, HStack, Box, Button, Icon} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {actionMenuOpenedCount} from '../../core/actions';
import {connect} from 'react-redux';

import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  ListItem: {
    paddingLeft: 30,
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
    justifyContent: 'center',
  },
  bodyText: {
    fontSize: 18,
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
});

const heightScreen = Dimensions.get('window').height;
const isAndroid = Platform.OS === 'android';

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

const MenuItem = props => {
  const {id, selected, type, name, icon, navigate} = props.data;
  const {navigation, rowHeight} = props;

  const params = {
    ...navigate?.params,
  };

  return (
    <Pressable
      key={`menu-list-item-${id}`}
      style={styles.ListItem}
      selected={selected}
      onPress={() => navigation.navigate(navigate?.url, params)}>
      <HStack space={3} justifyContent="flex-start">
        <Button
          style={[
            styles.menuButton,
            {
              height: rowHeight,
            },
            selected && typeof selected !== 'undefined'
              ? styleConst.new.menu.active
              : styleConst.new.menu.default,
          ]}
          leftIcon={icon}
        />
        <Box style={styles.Body}>
          <Text
            selectable={false}
            style={[
              styles.bodyText,
              {
                color: selected ? styleConst.color.blue : '#858997',
              },
            ]}>
            {name}
          </Text>
        </Box>
      </HStack>
    </Pressable>
  );
};

const MenuScreen = props => {
  const menu = [
    {
      id: 1,
      name: strings.Menu.main.autocenter,
      navigate: {
        url: 'Home',
      },
      type: 'home',
      //icon: <Image source={require('../assets/Home.svg')} />,
      icon: (
        <Icon
          as={FontAwesome}
          size={8}
          color={styleConst.color.darkBg}
          name="building-o"
        />
      ),
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
    !isAndroid
      ? {
          id: 7,
          name: strings.Menu.main.reviews,
          navigate: {
            url: 'ReviewsScreen',
          },
          type: 'reviews',
          icon: <Image source={require('../assets/Eko.svg')} />,
          selected: false,
        }
      : {id: null},
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
            url: 'TvaScreenBase',
          },
          type: 'new',
          icon: <Image source={require('../assets/Car-lifter.svg')} />,
          selected: false,
        },
      );
    }
  }

  menu.filter(el => {
    return el.id !== null;
  });

  menu.sort((a, b) => {
    return a.id - b.id;
  });

  const rowHeight = (heightScreen - 246) / menu.length;

  return (
    <View testID="MenuScreen.Wrapper">
      <VStack style={{marginTop: 0}}>
        {menu.map(item => (
          <MenuItem
            key={`menu-item-${item.id}`}
            data={item}
            navigation={props.navigation}
            rowHeight={rowHeight}
          />
        ))}
      </VStack>
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);
