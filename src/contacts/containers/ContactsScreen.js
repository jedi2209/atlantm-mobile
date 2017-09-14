import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Image,
  View,
  Alert,
} from 'react-native';
import {
  Container,
  Content,
  Text,
  StyleProvider,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Icon,
} from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { callMe } from '../actions';
import { CALL_ME__SUCCESS, CALL_ME__FAIL } from '../actionTypes';

// components
import DeviceInfo from 'react-native-device-info';
import Communications from 'react-native-communications';
import Spinner from 'react-native-loading-spinner-overlay';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';

// helpers
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import { verticalScale } from '../../utils/scale';
import styleHeader from '../../core/components/Header/style';

const iconSize = 28;
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  iconArrow: {
    color: styleConst.color.systemGray,
  },
  listItem: {
    minHeight: 44,
  },
  list: {
    marginTop: verticalScale(28),
  },
  listHolding: {
    marginTop: verticalScale(35),
  },
  listItemContainer: {
    backgroundColor: '#fff',
    borderTopWidth: styleConst.ui.borderWidth,
    borderTopColor: styleConst.color.border,
  },
  icon: {
    width: iconSize,
    height: iconSize,
  },
});

const mapStateToProps = ({ dealer, profile, contacts, nav }) => {
  return {
    nav,
    profile,
    dealerSelected: dealer.selected,
    isСallMeRequest: contacts.isСallMeRequest,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    callMe,
  }, dispatch);
};

class ContactsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Контакты',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <View />, // для выравнивания заголовка по центру на обоих платформах
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  onPressCallMe = () => {
    const {
      callMe,
      profile,
      navigation,
      dealerSelected,
    } = this.props;

    const { name, phone, email } = profile;

    if (!name || !phone) {
      return Alert.alert(
        'Не хватает информации',
        'Для обратного звонка необходимо заполнить ФИО и номер контактного телефона в профиле',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Заполнить',
            onPress() { navigation.navigate('ProfileScreen'); },
          },
        ],
      );
    }

    const dealerID = dealerSelected.id;
    const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getSystemVersion()}`;

    callMe({
      name,
      email,
      phone,
      device,
      dealerID,
    })
      .then(action => {
        if (action.type === CALL_ME__SUCCESS) {
          setTimeout(() => Alert.alert('Успешно', 'Ваш запрос на обратный звонок принят'), 100);
        }

        if (action.type === CALL_ME__FAIL) {
          setTimeout(() => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'), 100);
        }
      });
  }

  shouldComponentUpdate(nextProps) {
    const isActiveScreen = nextProps.nav === 'ContactsScreen';

    return (this.props.dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (this.props.isСallMeRequest !== nextProps.isСallMeRequest && isActiveScreen);
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      dealerSelected,
      navigation,
      isСallMeRequest,
    } = this.props;

    const PHONES = [];
    const phones = get(dealerSelected, 'phone', PHONES);

    console.log('== Contacts ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <DealerItemList
              navigation={navigation}
              city={dealerSelected.city}
              name={dealerSelected.name}
              brands={dealerSelected.brands}
              returnScreen="ContactsScreen"
            />
            <Spinner visible={isСallMeRequest} color={styleConst.color.blue} />

            <List style={styles.list}>
              <View style={styles.listItemContainer}>
                <ListItem
                  icon
                  style={styles.listItem}
                  onPress={() => {
                    navigation.navigate('AboutScreen');
                  }}
                >
                  <Left>
                    <Image
                      style={styles.icon}
                      source={require('../assets/about_dealer.png')}
                    />
                  </Left>
                  <Body>
                    <Text style={styles.text}>Об автоцентре</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={styles.iconArrow}
                    />
                  </Right>
                </ListItem>

                {
                  phones.length !== 0 ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                        onPress={() => {
                          Communications.phonecall(phones[0], true);
                        }}
                      >
                        <Left>
                          <Image
                            style={styles.icon}
                            source={require('../assets/call.png')}
                          />
                        </Left>
                        <Body>
                          <Text>Позвонить нам</Text>
                        </Body>
                      </ListItem>
                    ) : null
                }

                {
                  dealerSelected.email ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                        onPress={() => {
                          Communications.email(
                            [dealerSelected.email],
                            null,
                            null,
                            `Из приложения iOS Атлант-М, мой автоцентр ${dealerSelected.name}`,
                            null,
                          );
                        }}
                      >
                        <Left>
                          <Image
                            style={styles.icon}
                            source={require('../assets/feedback.png')}
                          />
                        </Left>
                        <Body>
                          <Text>Написать нам</Text>
                        </Body>
                      </ListItem>
                    ) : null
                }

                {
                  get(dealerSelected, 'coords.lat') && get(dealerSelected, 'coords.lon') ?
                    (
                      <ListItem
                        icon
                        style={styles.listItem}
                        onPress={() => {
                          navigation.navigate('MapScreen');
                        }}
                      >
                        <Left>
                          <Image
                            style={styles.icon}
                            source={require('../assets/map.png')}
                          />
                        </Left>
                        <Body>
                          <Text>Найти нас</Text>
                        </Body>
                        <Right>
                          <Icon
                            name="arrow-forward"
                            style={styles.iconArrow}
                          />
                        </Right>
                      </ListItem>
                    ) : null
                }

                <ListItem
                  last
                  icon
                  style={styles.listItem}
                  onPress={this.onPressCallMe}
                >
                  <Left>
                    <Image
                      style={styles.icon}
                      source={require('../assets/call_me.png')}
                    />
                  </Left>
                  <Body>
                    <Text>Позвонить мне</Text>
                  </Body>
                </ListItem>

                {/* <ListItem
                  last
                  icon
                  style={styles.listItem}
                  onPress={() => {
                    navigation.navigate('ReferenceScreen');
                  }}
                >
                  <Left>
                    <Image
                      style={styles.icon}
                      source={require('../assets/reference.png')}
                    />
                  </Left>
                  <Body>
                    <Text>Справочная</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={styles.iconArrow}
                    />
                  </Right>
                </ListItem> */}
              </View>
            </List>

            <List style={[styles.list, styles.listHolding]}>
              <View style={styles.listItemContainer}>
                <ListItem
                  last
                  icon
                  style={styles.listItem}
                  onPress={() => {
                    navigation.navigate('AboutHoldingScreen');
                  }}
                >
                  <Left>
                    <Image
                      style={styles.icon}
                      source={require('../assets/about_holding.png')}
                    />
                  </Left>
                  <Body>
                    <Text>О холдинге Атлант-М</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={styles.iconArrow}
                    />
                  </Right>
                </ListItem>
              </View>
            </List>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
