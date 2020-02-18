import React, {Component} from 'react';
import {
  View,
  Text,
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Maps
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

// Redux
import {connect} from 'react-redux';
import {
  actionRequestCheckAvailableNaviApps,
  actionDoneCheckAvailableNaviApps,
  actionSetAvailableNaviApps,
} from '@contacts/actions';
import {
  CONTACTS_MAP_YNDX_NAVIGATOR,
  CONTACTS_MAP_YNDX_MAPS,
  CONTACTS_MAP_GOOGLE_MAPS,
  CONTACTS_MAP_APPLE_MAPS,
} from '@contacts/actionTypes';

// components
import {Icon} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import FooterButton from '@core/components/FooterButton';
import HeaderIconBack from '@core/components/HeaderIconBack/HeaderIconBack';

// Helpers
import {get} from 'lodash';
import styleConst from '@core/style-const';
import stylesHeader from '@core/components/Header/style';

const isAndroid = Platform.OS === 'android';
// import isIPhoneX from '@utils/is_iphone_x';
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
    paddingBottom: isAndroid
      ? styleConst.ui.footerHeightAndroid
      : styleConst.ui.footerHeightIphone,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  errorText: {
    fontSize: 20,
    alignSelf: 'center',
  },
  iconRoute: {
    marginLeft: 10,
    fontSize: 30,
    color: 'white',
  },
});

const mapStateToProps = ({dealer, contacts}) => {
  return {
    dealerSelected: dealer.selected,
    availableNaviApps: contacts.map.availableNaviApps,
    isRequestCheckAvailableNaviApps:
      contacts.map.isRequestCheckAvailableNaviApps,
  };
};

const mapDispatchToProps = {
  actionRequestCheckAvailableNaviApps,
  actionDoneCheckAvailableNaviApps,
  actionSetAvailableNaviApps,
};

class MapScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Найти нас',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: (
      <HeaderIconBack
        navigation={navigation}
        returnScreen={
          navigation.state.params && navigation.state.params.returnScreen
        }
      />
    ),
    headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
  });

  shouldComponentUpdate(nextProps) {
    const {
      availableNaviApps,
      isRequestCheckAvailableNaviApps,
      dealerSelected,
      navigation,
    } = this.props;

    return (
      isRequestCheckAvailableNaviApps !==
        nextProps.isRequestCheckAvailableNaviApps ||
      availableNaviApps !== nextProps.availableNaviApps ||
      (dealerSelected.id !== nextProps.dealerSelected.id &&
        navigation.state.routeName === 'MapScreen')
    );
  }

  onPressRoute = async () => {
    const {availableNaviApps, actionSetAvailableNaviApps} = this.props;

    const {latitude, longitude} = this.getPositions();
    const {name, city, address, coords} = this.getDealerDetails();

    if (isAndroid) {
      return this.openDirections(
        'geo:0,0?q=' + name + ', ' + city + ', ' + address,
      );
    }

    if (availableNaviApps.length === 0) {
      actionSetAvailableNaviApps(['Отмена']);
    }

    return this.buildActionSheet(latitude, longitude);
  };

  getDealerDetails = () => {
    const {dealerSelected, navigation} = this.props;

    let name;
    let city;
    let address;

    let coords = get(navigation, 'state.params.coords');

    if (coords) {
      name = get(navigation, 'state.params.name');
      city = get(navigation, 'state.params.city');
      address = get(navigation, 'state.params.address');
    } else {
      name = get(dealerSelected, 'name');
      city = get(dealerSelected, 'city.name');
      address = get(dealerSelected, 'address');
      coords = get(dealerSelected, 'coords');
    }

    return {
      name,
      city,
      address,
      coords,
    };
  };

  buildActionSheet = async (latitude, longitude) => {
    const {
      availableNaviApps,
      actionSetAvailableNaviApps,
      actionRequestCheckAvailableNaviApps,
      actionDoneCheckAvailableNaviApps,
    } = this.props;

    if (availableNaviApps.length > 1) {
      return this.actionSheet.show();
    }

    actionRequestCheckAvailableNaviApps();

    const apps = ['Отмена'];
    const baseParams = {latitude, longitude};

    const checkAppAvailable = name => {
      return Linking.canOpenURL(
        this.getNaviLink({
          ...baseParams,
          name,
        }),
      ).then(isAppAvailable => {
        return {name, isAppAvailable};
      });
    };

    Promise.all([
      checkAppAvailable(CONTACTS_MAP_YNDX_NAVIGATOR),
      checkAppAvailable(CONTACTS_MAP_YNDX_MAPS),
      checkAppAvailable(CONTACTS_MAP_GOOGLE_MAPS),
      checkAppAvailable(CONTACTS_MAP_APPLE_MAPS),
    ]).then(results => {
      results.forEach(app => {
        if (app.isAppAvailable) {
          apps.push(app.name);
        }
      });

      actionSetAvailableNaviApps(apps);

      actionDoneCheckAvailableNaviApps();

      this.actionSheet.show();
    });
  };

  getNaviLink = ({name, latitude, longitude}) => {
    switch (name) {
      case CONTACTS_MAP_YNDX_NAVIGATOR:
        return `yandexnavi://build_route_on_map?lat_to=${latitude}&lon_to=${longitude}`;
      case CONTACTS_MAP_YNDX_MAPS:
        return `yandexmaps://maps.yandex.ru/?pt=${longitude},${latitude}&z=12`;
      case CONTACTS_MAP_GOOGLE_MAPS:
        return `comgooglemaps://?daddr=${latitude},${longitude}`;
      default:
        // CONTACTS_MAP_APPLE_MAPS
        return `maps://?daddr=${latitude},${longitude}`;
    }
  };

  openDirections = url => {
    return Linking.openURL(url).catch(err => {
      __DEV__ && console.log('err', err);

      setTimeout(() =>
        Alert.alert(
          'Ошибка',
          'Не удалось открыть приложения для навигации, попробуйте снова.',
        ),
      );
    });
  };

  onPressRouteVariant = index => {
    let url;

    if (index === 0) {
      return false;
    }

    const {availableNaviApps, dealerSelected} = this.props;

    const navApp = availableNaviApps[index];

    const {name, city, address, coords} = this.getDealerDetails();

    console.log('coords', coords);

    const latitude = Number(coords.lat);
    const longitude = Number(coords.lon);

    const baseParams = {latitude, longitude};

    switch (navApp) {
      case CONTACTS_MAP_YNDX_NAVIGATOR:
        url = this.getNaviLink({
          ...baseParams,
          name: CONTACTS_MAP_YNDX_NAVIGATOR,
        });
        break;
      case CONTACTS_MAP_YNDX_MAPS:
        url = this.getNaviLink({...baseParams, name: CONTACTS_MAP_YNDX_MAPS});
        break;
      case CONTACTS_MAP_GOOGLE_MAPS:
        url = this.getNaviLink({...baseParams, name: CONTACTS_MAP_GOOGLE_MAPS});
        break;
      default:
        url = this.getNaviLink({...baseParams, name: CONTACTS_MAP_APPLE_MAPS});
        break;
    }

    return this.openDirections(url);
  };

  handleRef = ref => {
    this.map = ref;

    if (!this.map) {
      return;
    }

    const {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    } = this.getPositions();

    requestAnimationFrame(() => {
      if (!this.map) {
        return;
      }

      this.map.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta,
          longitudeDelta,
        },
        1,
      );
    });
  };

  getPositions = () => {
    const {dealerSelected, navigation} = this.props;

    let latitude;
    let longitude;

    if (get(navigation, 'state.params.coords')) {
      latitude = Number(get(navigation, 'state.params.coords.lat'));
      longitude = Number(get(navigation, 'state.params.coords.lon'));
    } else {
      latitude = Number(get(dealerSelected, 'coords.lat'));
      longitude = Number(get(dealerSelected, 'coords.lon'));
    }

    const aspectRatio = width / height;
    const latitudeDelta = 0.0922;
    const longitudeDelta = latitudeDelta * aspectRatio;

    return {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    };
  };

  render() {
    // Для iPad меню, которое находится вне роутера
    // window.atlantmNavigation = this.props.navigation;

    const {
      dealerSelected,
      availableNaviApps,
      isRequestCheckAvailableNaviApps,
    } = this.props;

    const {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    } = this.getPositions();

    if (!latitude || !longitude) {
      return (
        <View style={styles.safearea}>
          <Text style={styles.errorText}>Нет данных для отображения карты</Text>
        </View>
      );
    }

    const city = get(dealerSelected, 'city.name');
    const address = get(dealerSelected, 'address');
    let description;

    if (city) {
      description = 'г.' + city;
    }

    if (address) {
      description = description + ', ' + address;
    }

    console.log('== MapScreen == ');

    return (
      <SafeAreaView style={styles.safearea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.mapContainer}>
          <MapView
            ref={this.handleRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta,
              longitudeDelta,
            }}
            showsScale={true}
            zoomEnabled={true}
            pitchEnabled={true}
            loadingEnabled={true}
            loadingIndicatorColor={styleConst.color.blue}
            cacheEnabled={true}>
            <MapView.Marker
              coordinate={{
                latitude,
                longitude,
              }}
              pinColor={styleConst.color.blue}
              title={dealerSelected.name}
              description={description}
            />
          </MapView>

          <ActionSheet
            cancelButtonIndex={0}
            ref={component => (this.actionSheet = component)}
            title="Выберите приложение для навигации"
            options={availableNaviApps}
            onPress={this.onPressRouteVariant}
          />
          <FooterButton
            icon={
              <Icon
                name="navigation"
                style={styles.iconRoute}
                type="MaterialCommunityIcons"
              />
            }
            text="Проложить маршрут"
            theme="blue"
            isLoading={isRequestCheckAvailableNaviApps}
            onPressButton={this.onPressRoute}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapScreen);
