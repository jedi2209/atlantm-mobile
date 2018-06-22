import React, { Component } from 'react';
import { SafeAreaView, Image, View, Alert, StyleSheet, Platform, Linking } from 'react-native';
import {
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
import { connect } from 'react-redux';
import { callMe } from '../actions';
import { CALL_ME__SUCCESS, CALL_ME__FAIL } from '../actionTypes';

// components
import DeviceInfo from 'react-native-device-info';
import Communications from 'react-native-communications';
import Spinner from 'react-native-loading-spinner-overlay';
import DealerItemList from '@core/components/DealerItemList';
import HeaderIconMenu from '@core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '@core/components/HeaderIconBack/HeaderIconBack';
import InfoLine from '@eko/components/InfoLine';

// helpers
import Amplitude from '@utils/amplitude-analytics';
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '@core/style-const';
import stylesHeader from '@core/components/Header/style';
import stylesList from '@core/components/Lists/style';
import isInternet from '@utils/internet';
import { ERROR_NETWORK } from '@core/const';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
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

const mapDispatchToProps = {
  callMe,
};

class ContactsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Контакты',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack returnScreen="MenuScreen" navigation={navigation} />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  componentDidMount() {
    Amplitude.logEvent('screen', 'contacts');
  }

  onPressCallMe = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {
        callMe,
        profile,
        navigation,
        dealerSelected,
        isСallMeRequest,
      } = this.props;

      // предотвращаем повторную отправку формы
      if (isСallMeRequest) return;

      const { name, phone, email } = profile;

      if (!phone) {
        return Alert.alert(
          'Добавьте номер телефона',
          'Для обратного звонка необходимо добавить номер контактного телефона в профиле',
          [
            { text: 'Отмена', style: 'cancel' },
            {
              text: 'Заполнить',
              onPress() { navigation.navigate('Profile2Screen'); },
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
            Amplitude.logEvent('order', 'contacts/callme');

            setTimeout(() => Alert.alert('Ваша заявка успешно отправлена'), 100);
          }

          if (action.type === CALL_ME__FAIL) {
            setTimeout(() => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'), 100);
          }
        });
    }
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'ContactsScreen';

    return isActiveScreen;
  }

  onPressAbout = () => this.props.navigation.navigate('AboutScreen')

  onPressRateApp = () => {
    const APP_STORE_LINK = 'itms-apps://itunes.apple.com/app/idXXXX?action=write-review';
    const PLAY_STORE_LINK = 'market://details?id=com.atlantm';

    if (Platform.OS === 'ios') {
      Linking.openURL(APP_STORE_LINK).catch(err => console.error('APP_STORE_LINK failed', err));
    } else {
      Linking.openURL(PLAY_STORE_LINK).catch(err => console.error('PLAY_STORE_LINK failed', err));
    }
  }

  getRateAppInfoText = () => {
    return `Если вам понравилось наше приложение, оставьте, пожайлуста, положительный отзыв в ${this.getPlatformStore()}`;
  }

  getRateAppLabel = () => `Оставить отзыв в ${this.getPlatformStore()}`

  getPlatformStore = () => Platform.OS === 'ios' ? 'App Store' : 'Google Play'

  onPressBonus = () => this.props.navigation.navigate('BonusInfoScreen', { refererScreen: 'contacts' })

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
        <SafeAreaView style={styles.safearea}>
          <Content style={styles.content} >
            <DealerItemList
              navigation={navigation}
              city={dealerSelected.city}
              name={dealerSelected.name}
              brands={dealerSelected.brands}
              goBack={true}
            />
            <Spinner visible={isСallMeRequest} color={styleConst.color.blue} />

            <List style={stylesList.list}>
              <View style={[stylesList.listItemContainer, stylesList.listItemContainerFirst]}>
                <ListItem
                  icon
                  style={stylesList.listItem}
                  onPress={this.onPressAbout}
                >
                  <Left>
                    <Image
                      style={stylesList.iconLeft}
                      source={require('../assets/about_dealer.png')}
                    />
                  </Left>
                  <Body>
                    <Text style={styles.text}>Об автоцентре</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={stylesList.iconArrow}
                    />
                  </Right>
                </ListItem>

                {
                  phones.length !== 0 ?
                    (
                      <ListItem
                        icon
                        style={stylesList.listItem}
                        onPress={() => {
                          Communications.phonecall(phones[0], true);
                        }}
                      >
                        <Left>
                          <Image
                            style={stylesList.iconLeft}
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
                  dealerSelected.email && dealerSelected.email.length !== 0 ?
                    (
                      <ListItem
                        icon
                        style={stylesList.listItem}
                        onPress={() => {
                          Communications.email(
                            [dealerSelected.email[0]],
                            null,
                            null,
                            `Из приложения ${Platform.OS === 'android' ? 'Android' : 'iOS'} Атлант-М, мой автоцентр ${dealerSelected.name}`,
                            null,
                          );
                        }}
                      >
                        <Left>
                          <Image
                            style={stylesList.iconLeft}
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
                        style={stylesList.listItem}
                        onPress={() => {
                          navigation.navigate('MapScreen');
                        }}
                      >
                        <Left>
                          <Image
                            style={stylesList.iconLeft}
                            source={require('../assets/map.png')}
                          />
                        </Left>
                        <Body>
                          <Text>Найти нас</Text>
                        </Body>
                        <Right>
                          <Icon
                            name="arrow-forward"
                            style={stylesList.iconArrow}
                          />
                        </Right>
                      </ListItem>
                    ) : null
                }

                <ListItem
                  last
                  icon
                  style={stylesList.listItem}
                  onPress={this.onPressCallMe}
                >
                  <Left>
                    <Image
                      style={stylesList.iconLeft}
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
                  style={stylesList.listItem}
                  onPress={() => {
                    navigation.navigate('ReferenceScreen');
                  }}
                >
                  <Left>
                    <Image
                      style={stylesList.iconLeft}
                      source={require('../assets/reference.png')}
                    />
                  </Left>
                  <Body>
                    <Text>Справочная</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={stylesList.iconArrow}
                    />
                  </Right>
                </ListItem> */}
              </View>
            </List>

            <List style={stylesList.list}>
              <View style={[stylesList.listItemContainer, stylesList.listItemContainerFirst]}>
                <ListItem
                  last
                  icon
                  style={stylesList.listItem}
                  onPress={this.onPressBonus}
                >
                  <Left>
                    <Image
                      style={stylesList.iconLeft}
                      source={require('../../profile/assets/bonus.png')}
                    />
                  </Left>
                  <Body>
                    <Text>Бонусная программа</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={stylesList.iconArrow}
                    />
                  </Right>
                </ListItem>
              </View>
            </List>

            <List style={stylesList.list}>
              <View style={[stylesList.listItemContainer, stylesList.listItemContainerFirst]}>
                <ListItem
                  last
                  icon
                  style={stylesList.listItem}
                  onPress={() => {
                    navigation.navigate('AboutHoldingScreen');
                  }}
                >
                  <Left>
                    <Image
                      style={stylesList.iconLeft}
                      source={require('../assets/about_holding.png')}
                    />
                  </Left>
                  <Body>
                    <Text>О холдинге Атлант-М</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={stylesList.iconArrow}
                    />
                  </Right>
                </ListItem>
              </View>
            </List>

            <List style={stylesList.list}>
              <View style={[stylesList.listItemContainer, stylesList.listItemContainerFirst]}>
                <ListItem
                  last
                  icon
                  style={stylesList.listItem}
                  onPress={this.onPressRateApp}
                >
                  <Left>
                    <Image
                      style={stylesList.iconLeft}
                      source={require('../assets/rate_app.png')}
                    />
                  </Left>
                  <Body>
                    <Text>{this.getRateAppLabel()}</Text>
                  </Body>
                  <Right>
                    <Icon
                      name="arrow-forward"
                      style={stylesList.iconArrow}
                    />
                  </Right>
                </ListItem>
              </View>
            </List>
            <InfoLine text={this.getRateAppInfoText()} />
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
