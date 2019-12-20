/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {Text, View, Image, StyleSheet, TouchableHighlight} from 'react-native';
import {Icon, List, ListItem, Left, Right, Button, Body} from 'native-base';

import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  buttonPrimary: {
    marginTop: 20,
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
        paddingTop: 5,
        paddingBottom: 5,
      }}
      selected={selected}
      onPress={() => navigation.navigate(navigateUrl)}>
      <Left style={{marginLeft: 0, paddingLeft: 0, maxWidth: 75}}>
        <Button
          underlayColor={styles.buttonPrimaryText.color}
          style={{
            backgroundColor: selected ? '#0061ED' : 'transparent',
            paddingLeft: 17,
            paddingRight: 30,
            height: 65,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 80,
            borderBottomRightRadius: 80,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: selected ? 0.5 : 0,
            shadowRadius: selected ? 4 : 0,
          }}>
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
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: selected ? 0.2 : 0,
            shadowRadius: selected ? 2 : 0,
          }}>
          {name}
        </Text>
      </Body>
      <Right>
        <Icon
          name="arrow-forward"
          style={{
            marginTop: 3,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: selected ? 0.2 : 0,
            shadowRadius: selected ? 2 : 0,
          }}
        />
      </Right>
    </ListItem>
  );
};

const MoreScreen = props => {
  const menu = [
    {
      id: 1,
      name: 'Автоцентр',
      navigateUrl: 'Home',
      type: 'home',
      selected: true,
    },
    {
      id: 2,
      name: 'Акции',
      navigateUrl: 'InfoList',
      type: 'sales',
    },
    {
      id: 3,
      name: 'Новые авто',
      navigateUrl: 'NewCarListScreen',
      type: 'new',
    },
    {
      id: 4,
      name: 'Поддержанные авто',
      navigateUrl: 'NewCarListScreen',
      type: 'not_new',
    },
    {
      id: 5,
      name: 'Сервис',
      navigateUrl: 'ServiceScreen',
      type: 'service',
    },
    {
      id: 6,
      name: 'Отзывы',
      navigateUrl: 'ReviewsScreen',
      type: 'reviews',
    },
    {
      id: 7,
      name: 'Индикаторы',
      navigateUrl: 'IndicatorsScreen',
      type: 'indicators',
    },
  ];
  return (
    <>
      <View>
        <List style={{marginTop: 20}}>
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
              props.navigation.navigate('ChooseDealerScreen');
            }}
            style={styles.buttonPrimary}>
            <Text style={styles.buttonPrimaryText}>ЛИЧНЫЙ КАБИНЕТ</Text>
          </Button>
        </View>
      </View>
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
        }}>
        <Image
          resizeMode="contain"
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
      style={{
        fontSize: 24,
        color: focused ? styleConst.new.blueHeader : styleConst.new.passive,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      }}
    />
  ),
});

export default MoreScreen;
