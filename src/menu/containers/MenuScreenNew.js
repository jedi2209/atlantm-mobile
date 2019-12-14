/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {Text, View, Image, StyleSheet} from 'react-native';
import {Icon, List, ListItem, Left, Right, Button, Body} from 'native-base';

import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  buttonPrimary: {
    marginTop: 60,
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
  const {selected, type, name, navigateUrl} = props.data;
  const {navigation} = props;

  return (
    <ListItem
      style={{marginLeft: 0, borderColor: 'transparent', height: 60}}
      selected={selected}
      onPress={() => navigation.navigate(navigateUrl)}>
      <Left style={{marginLeft: 0, paddingLeft: 0, maxWidth: 75}}>
        <Button
          style={{
            backgroundColor: selected ? '#0061ED' : 'transparent',
            paddingLeft: 17,
            paddingRight: 30,
            height: 65,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 80,
            borderBottomRightRadius: 80,
          }}>
          {type === 'home' && <Image source={require('./HomeCopy.png')} />}
          {type === 'sales' && <Image source={require('./paperwork.png')} />}
          {type === 'new' && <Image source={require('./car.png')} />}
          {type === 'not_new' && (
            <Image source={require('./good-car-diagnostic.png')} />
          )}
          {type === 'service' && <Image source={require('./wrenching.png')} />}
          {type === 'reviews' && (
            <Image source={require('./desktop-messaging.png')} />
          )}
          {type === 'indicators' && (
            <Image source={require('./07-Battery.png')} />
          )}
        </Button>
      </Left>
      <Body style={{paddingLeft: 17}}>
        <Text style={{fontSize: 16, color: selected ? '#0061ED' : '#858997'}}>
          {name}
        </Text>
      </Body>
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    </ListItem>
  );
};

const MoreScreen = props => {
  const menu = [
    {
      name: 'Автоцентр',
      navigateUrl: 'Home',
      type: 'home',
      selected: true,
    },
    {name: 'Акции', navigateUrl: 'InfoList', type: 'sales'},
    {name: 'Новые авто', navigateUrl: 'NewCarListScreen', type: 'new'},
    {
      name: 'Поддержанные авто',
      navigateUrl: 'NewCarListScreen',
      type: 'not_new',
    },
    {name: 'Сервис', navigateUrl: '', type: 'service'},
    {name: 'Отзывы', navigateUrl: 'ReviewsScreen', type: 'reviews'},
    {name: 'Индикаторы', navigateUrl: 'IndicatorsScreen', type: 'indicators'},
  ];
  return (
    <>
      <View>
        <List style={{marginTop: 20}}>
          {menu.map(item => (
            <MenuItem data={item} navigation={props.navigation} />
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
        <Image source={require('./Blue.png')} />
      </View>
    );
  }
}

MoreScreen.navigationOptions = () => ({
  headerTitle: () => <LogoTitle />,
  headerStyle: {
    height: 100,
  },
  tabBarLabel: 'Ещё',
  tabBarIcon: ({focused}) => (
    <Icon
      name="bars"
      type="FontAwesome5"
      style={{
        fontSize: 24,
        color: focused ? styleConst.new.blueHeader : styleConst.new.passive,
      }}
    />
  ),
});

export default MoreScreen;
