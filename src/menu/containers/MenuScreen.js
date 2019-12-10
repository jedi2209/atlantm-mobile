import React, {Component} from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Icon, Container, Text, Grid, Col, Row} from 'native-base';
import {TabNavigator, StackNavigator} from 'react-navigation';

// redux
import {connect} from 'react-redux';
import {
  actionMenuOpenedCount,
  actionAppRated,
  actionAppRateAskLater,
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionStoreUpdated,
} from '../../core/actions';

// components
import HeaderLogo from '../../core/components/HeaderLogo/HeaderLogo';

// helpers
import styleConst from '../../core/style-const';
import {scale, verticalScale} from '../../utils/scale';
import {get} from 'lodash';
import stylesHeader from '../../core/components/Header/style';
import RateThisApp from '../../core/components/RateThisApp';
import OneSignal from 'react-native-onesignal';
import PushNotifications from '../../core/components/PushNotifications';
import ContactsScreen from '../../contacts/containers/ContactsScreen';
import NewCarListScreen from '../../catalog/newcar/containers/NewCarListScreen';
import ProfileScreen from '../../profile/containers/ProfileScreen';
import ServiceScreen from '../../service/containers/ServiceScreen';
import InfoListScreen from '../../info/containers/InfoListScreen';
import InfoPostScreen from '../../info/containers/InfoPostScreen';
import NewCarFilterScreen from '../../catalog/newcar/containers/NewCarFilterScreen';

const MoreScreen = () => <Text>MenuScreen</Text>;

MoreScreen.navigationOptions = () => ({
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

const EnhancedMenuScreen = TabNavigator({
  Contacts: {
    screen: StackNavigator({
      // TODO: Все роуты назвать *Screen (e.g. HomeScreen, для консистентности)
      Home: {screen: ContactsScreen},
      InfoList: {screen: InfoListScreen},
      InfoPostScreen: {screen: InfoPostScreen},
    }),
  },
  Search: {
    screen: StackNavigator({
      NewCarListScreen: {screen: NewCarListScreen},
      NewCarFilterScreen: {
        screen: NewCarFilterScreen,
        navigationOptions: {
          tabBarVisible: false,
        },
      },
    },
    {
      mode: 'modal',
      // headerMode: 'none',
    }
    ),
  },
  Profile: {
    screen: ProfileScreen,
  },
  Service: {
    screen: ServiceScreen,
  },
  More: {
    screen: MoreScreen,
  },
});

EnhancedMenuScreen.navigationOptions = () => ({
  header: null,
});

export default EnhancedMenuScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
    justifyContent: 'space-around',
    flex: 1,
  },
  menu: {
    marginTop: verticalScale(25),
    marginBottom: verticalScale(40),
    marginLeft: scale(10),
    marginRight: scale(10),
  },
  text: {
    color: styleConst.color.greyText,
    fontSize: 14,
    fontFamily: styleConst.font.regular,
    textAlign: 'center',
    letterSpacing: styleConst.ui.letterSpacing,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    resizeMode: 'contain',
    width: scale(60),
    height: scale(60),
    marginBottom: verticalScale(5),
  },
});

const mapStateToProps = ({core, dealer}) => {
  return {
    dealerSelected: dealer.selected,
    menuOpenedCount: core.menuOpenedCount,
    isAppRated: core.isAppRated,
    AppRateAskLater: core.AppRateAskLater,
    isStoreUpdated: core.isStoreUpdated,
    MenuCounterLimit: 10, // счётчик открытия меню, после которого показывается предложение об оценке
  };
};

const mapDispatchToProps = {
  actionMenuOpenedCount,
  actionAppRated,
  actionAppRateAskLater,
  actionSetPushGranted,
  actionSetPushActionSubscribe,
  actionStoreUpdated,
};

class MenuScreen extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  UNSAFE_componentWillMount() {
    console.log('this.props.menuOpenedCount', this.props.menuOpenedCount);
    if (this.props.menuOpenedCount < this.props.MenuCounterLimit) {
      this.props.actionMenuOpenedCount();
    }
  }

  componentDidMount() {
    const {
      dealerSelected,
      menuOpenedCount,
      isStoreUpdated,
      actionStoreUpdated,
      actionSetPushActionSubscribe,
    } = this.props;

    const currentDealer = get(dealerSelected, 'id', false);
    console.log('Menu Prev ====== isStoreUpdated', isStoreUpdated);
    setTimeout(() => {
      OneSignal.promptForPushNotificationsWithUserResponse(status => {
        if (status) {
          if (isStoreUpdated != '2019-02-01') {
            // при первичном ините всегда подписываем насильно на акции
            console.log('Menu Inside ====== menuOpenedCount', menuOpenedCount);
            console.log('Menu Inside ====== isStoreUpdated', isStoreUpdated);
            if (currentDealer) {
              console.log(
                'Menu Inside Dealer ====== menuOpenedCount',
                menuOpenedCount,
              );
              console.log(
                'Menu Inside Dealer ====== isStoreUpdated',
                isStoreUpdated,
              );

              actionSetPushActionSubscribe(true);
              PushNotifications.subscribeToTopic('actions', currentDealer);
              PushNotifications.addTag('dealer', currentDealer);
              actionStoreUpdated('2019-02-01');
            }
            console.log(
              'Menu Inside After ====== isStoreUpdated',
              isStoreUpdated,
            );
          }
        }
      });
    }, 100);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.isAppRated !== nextProps.isAppRated;
  }

  onPressContacts = () => this.props.navigation.navigate('ContactsScreen');
  onPressInfoList = () => this.props.navigation.navigate('InfoListScreen');
  onPressProfile = () => this.props.navigation.navigate('Profile2Screen');
  onPressService = () => this.props.navigation.navigate('ServiceScreen');
  onPressCatalog = () => this.props.navigation.navigate('Catalog2Screen');
  onPressTva = () => this.props.navigation.navigate('Tva2Screen');
  onPressEko = () => this.props.navigation.navigate('Eko2Screen');
  onPressIndicators = () => this.props.navigation.navigate('IndicatorsScreen');
  onAppRateSuccess = () => {
    !this.props.isAppRated && this.props.actionAppRated();
  };
  onAppRateAskLater = () => {
    !this.props.isAppRated && this.props.actionMenuOpenedCount(0);
  };

  render() {
    // return <EnhancedMenuScreen />;

    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    console.log('== Menu ==');

    return (
      <Container style={styles.container}>
        {this.props.isAppRated !== true &&
        this.props.menuOpenedCount === this.props.MenuCounterLimit ? (
          <RateThisApp
            onSuccess={this.onAppRateSuccess}
            onAskLater={this.onAppRateAskLater}
          />
        ) : null}
        <Grid style={styles.menu}>
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressContacts}>
                <Image
                  style={styles.icon}
                  source={require('../assets/contacts.png')}
                />
                <Text style={styles.text}>Контакты</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressInfoList}>
                <Image
                  style={styles.icon}
                  source={require('../assets/info.png')}
                />
                <Text style={styles.text}>Акции</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressService}>
                <Image
                  style={styles.icon}
                  source={require('../assets/service.png')}
                />
                <Text style={styles.text}>Заявка на СТО</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity style={styles.item} onPress={this.onPressTva}>
                <Image
                  style={styles.icon}
                  source={require('../assets/car_delivery.png')}
                />
                <Text style={styles.text}>Табло выдачи авто</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressCatalog}>
                <Image
                  style={styles.icon}
                  source={require('../assets/catalog_auto.png')}
                />
                <Text style={styles.text}>Каталог автомобилей</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressIndicators}>
                <Image
                  style={styles.icon}
                  source={require('../assets/indicators.png')}
                />
                <Text style={styles.text}>Индикаторы</Text>
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col>
              <TouchableOpacity style={styles.item} onPress={this.onPressEko}>
                <Image
                  style={styles.icon}
                  source={require('../assets/reviews.png')}
                />
                <Text style={styles.text}>Отзывы и предложения</Text>
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity
                style={styles.item}
                onPress={this.onPressProfile}>
                <Image
                  style={styles.icon}
                  source={require('../assets/profile.png')}
                />
                <Text style={styles.text}>Личный кабинет</Text>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
      </Container>
    );
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen);
