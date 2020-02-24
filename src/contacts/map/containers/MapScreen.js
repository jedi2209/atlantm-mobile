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
  CONTACTS_MAP_YNDX_TAXI,
  CONTACTS_MAP_UBER_TAXI,
  CONTACTS_MAP_GOOGLE_MAPS,
  CONTACTS_MAP_APPLE_MAPS,
} from '@contacts/actionTypes';

// components
import {Icon, Button} from 'native-base';
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
    headerTransparent: true,
    // headerTitle: 'Найти нас',
    // headerStyle: stylesHeader.common,
    // headerTitleStyle: stylesHeader.title,
    headerLeft: (
      <HeaderIconBack
        theme="white"
        ContainerStyle={{
          backgroundColor: 'rgba(0,0,0, 0.2)',
          paddingHorizontal: 5,
          paddingVertical: 5,
          borderRadius: 20,
          marginLeft: 5,
        }}
        IconStyle={{
          marginLeft: 5,
        }}
        navigation={navigation}
        returnScreen={
          navigation.state.params && navigation.state.params.returnScreen
        }
      />
    ),
    // headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        name: '',
        city: '',
        address: '',
        coords: {
          latitude: 0,
          longitude: 0,
          aspectRatio: 0,
          latitudeDelta: 0,
          longitudeDelta: 0,
        },
      },
    };
  }

  componentDidMount() {
    const {dealerSelected, navigation} = this.props;

    let latitude, longitude, name, city, address;

    if (get(navigation, 'state.params.coords')) {
      latitude = Number(navigation.state.params.coords.lat);
      longitude = Number(navigation.state.params.coords.lon);
    } else {
      latitude = Number(get(dealerSelected, 'coords.lat'));
      longitude = Number(get(dealerSelected, 'coords.lon'));
    }

    if (get(navigation, 'state.params.name')) {
      name = navigation.state.params.name;
    }

    if (get(navigation, 'state.params.city')) {
      city = navigation.state.params.city;
    }

    if (get(navigation, 'state.params.address')) {
      address = navigation.state.params.address;
    }

    const aspectRatio = width / height;
    const latitudeDelta = 0.0922;
    const longitudeDelta = latitudeDelta * aspectRatio;

    this.setState(
      {
        data: {
          name: name,
          city: city,
          address: address,
          coords: {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          },
          aspectRatio: aspectRatio,
        },
        loading: false,
      },
      () => {
        console.log('this.setState', this.state);
      },
    );
  }

  onPressRoute = async () => {
    const {availableNaviApps, actionSetAvailableNaviApps} = this.props;

    if (availableNaviApps.length === 0) {
      actionSetAvailableNaviApps(['Отмена']);
    }

    return this.buildActionSheet(
      this.state.data.coords.latitude,
      this.state.data.coords.longitude,
    );
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
      checkAppAvailable(CONTACTS_MAP_YNDX_TAXI),
      checkAppAvailable(CONTACTS_MAP_UBER_TAXI),
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
    let link = '';
    const address = encodeURI(this.state.data.address);
    const address_name = encodeURI(this.state.data.name);
    switch (name) {
      case CONTACTS_MAP_YNDX_NAVIGATOR:
        link = `yandexnavi://build_route_on_map?lat_to=${latitude}&lon_to=${longitude}`;
        break;
      case CONTACTS_MAP_YNDX_MAPS:
        link = `yandexmaps://maps.yandex.ru/?pt=${longitude},${latitude}&z=12`;
        break;
      case CONTACTS_MAP_YNDX_TAXI:
        link = `https://3.redirect.appmetrica.yandex.com/route?end-lat=${latitude}&end-lon=${longitude}&ref=comatlantmapp&appmetrica_tracking_id=1178268795219780156`;
        break;
      case CONTACTS_MAP_GOOGLE_MAPS:
        link = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        break;
      case CONTACTS_MAP_UBER_TAXI:
        link = `uber://?action=setPickup&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${address_name}&[formatted_address]=${address}`;
        break;
      default:
        // CONTACTS_MAP_APPLE_MAPS
        link = `maps://?daddr=${latitude},${longitude}`;
        break;
    }
    return link;
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

    const {availableNaviApps} = this.props;

    const navApp = availableNaviApps[index];
    const latitude = Number(this.state.data.coords.latitude);
    const longitude = Number(this.state.data.coords.longitude);

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
      case CONTACTS_MAP_YNDX_TAXI:
        url = this.getNaviLink({...baseParams, name: CONTACTS_MAP_YNDX_TAXI});
        break;
      case CONTACTS_MAP_UBER_TAXI:
        url = this.getNaviLink({...baseParams, name: CONTACTS_MAP_UBER_TAXI});
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

    requestAnimationFrame(() => {
      if (!this.map) {
        return;
      }

      this.map.animateToRegion(this.state.data.coords, 1);
    });
  };

  _getDescription() {
    let description;

    if (this.state.data.city) {
      description = 'г.' + this.state.data.city;
    }

    if (this.state.data.address) {
      description = description + ', ' + this.state.data.address;
    }
    return description;
  }

  render() {
    const {
      dealerSelected,
      availableNaviApps,
      isRequestCheckAvailableNaviApps,
    } = this.props;

    console.log('== MapScreen == ');

    return this.state.loading ? (
      <View style={styles.safearea}>
        <Text style={styles.errorText}>Нет данных для отображения карты</Text>
      </View>
    ) : (
      <SafeAreaView style={styles.safearea}>
        <StatusBar barStyle="default" />
        <View style={styles.mapContainer}>
          <MapView
            ref={this.handleRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: this.state.data.coords.latitude,
              longitude: this.state.data.coords.longitude,
              latitudeDelta: this.state.data.coords.latitudeDelta,
              longitudeDelta: this.state.data.coords.longitudeDelta,
            }}
            showsScale={true}
            zoomEnabled={true}
            pitchEnabled={true}
            loadingEnabled={true}
            loadingIndicatorColor={styleConst.color.blue}
            cacheEnabled={true}>
            <MapView.Marker
              coordinate={{
                latitude: this.state.data.coords.latitude,
                longitude: this.state.data.coords.longitude,
              }}
              pinColor={styleConst.color.blue}
              title={dealerSelected.name}
              description={this._getDescription()}
            />
          </MapView>

          <ActionSheet
            cancelButtonIndex={0}
            ref={component => (this.actionSheet = component)}
            title="Выберите приложение для навигации"
            options={availableNaviApps}
            onPress={this.onPressRouteVariant}
          />
          <Button
            full
            style={[
              styleConst.shadow.default,
              {
                backgroundColor: styleConst.color.lightBlue,
                marginHorizontal: '10%',
                width: '80%',
                marginBottom: 40,
                borderRadius: 5,
              },
            ]}
            title="Построить маршрут"
            onPress={this.onPressRoute}>
            <Icon
              name="navigation"
              style={styles.iconRoute}
              type="MaterialCommunityIcons"
            />
            <Text
              style={{
                color: 'white',
                fontSize: 16,
              }}>
              ПОСТРОИТЬ МАРШРУТ
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapScreen);
