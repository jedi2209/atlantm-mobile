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
  ActivityIndicator,
} from 'react-native';

// Maps
import MapView, {
  Marker,
  enableLatestRenderer,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

// Redux
import {connect} from 'react-redux';
import {
  actionRequestCheckAvailableNaviApps,
  actionDoneCheckAvailableNaviApps,
  actionSetAvailableNaviApps,
} from '../../actions';

// components
import {Icon, Button} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionSheet from '@alessiocancian/react-native-actionsheet';

// Helpers
import {get} from 'lodash';
import {verticalScale} from '../../../utils/scale';
import styleConst from '../../../core/style-const';
import {strings} from '../../../core/lang/const';
import {APP_REGION} from '../../../core/const';

enableLatestRenderer();

const isAndroid = Platform.OS === 'android';
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
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
  button: {
    backgroundColor: styleConst.color.lightBlue,
    marginHorizontal: '10%',
    width: '80%',
    marginBottom: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  iconRoute: {
    marginLeft: 10,
  },
  spinner: {
    marginTop: verticalScale(260),
  },
});

const mapStateToProps = ({dealer, contacts}) => {
  return {
    dealerSelected: dealer.selected,
    availableNaviApps: contacts.map.availableNaviApps,
  };
};

const mapDispatchToProps = {
  actionRequestCheckAvailableNaviApps,
  actionDoneCheckAvailableNaviApps,
  actionSetAvailableNaviApps,
};

class MapScreen extends Component {
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
    const {dealerSelected, navigation, route} = this.props;

    let latitude, longitude, name, city, address;

    if (get(route, 'params.coords')) {
      latitude = Number(route.params.coords.lat);
      longitude = Number(route.params.coords.lon);
    } else {
      latitude = Number(get(dealerSelected, 'coords.lat'));
      longitude = Number(get(dealerSelected, 'coords.lon'));
    }

    if (get(route, 'params.name')) {
      name = route.params.name;
    }

    if (get(route, 'params.city')) {
      city = route.params.city;
    }

    if (get(route, 'params.address')) {
      address = route.params.address;
    }

    const aspectRatio = width / height;
    const latitudeDelta = 0.0922;
    const longitudeDelta = latitudeDelta * aspectRatio;

    this.setState({
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
    });
  }

  onPressRoute = async () => {
    const {availableNaviApps, actionSetAvailableNaviApps} = this.props;

    if (availableNaviApps.length === 0) {
      actionSetAvailableNaviApps([strings.Base.cancel.toLowerCase()]);
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

    const apps = [strings.Base.cancel.toLowerCase()];
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

    let NavApps = [];

    switch (APP_REGION) {
      case 'by':
        NavApps = [
          checkAppAvailable(strings.MapScreen.apps.yaNavi),
          checkAppAvailable(strings.MapScreen.apps.yaMaps),
          checkAppAvailable(strings.MapScreen.apps.yaTaxi),
          checkAppAvailable(strings.MapScreen.apps.uber),
          checkAppAvailable(strings.MapScreen.apps.googleMaps),
          checkAppAvailable(strings.MapScreen.apps.appleMaps),
        ];
        break;
      case 'ua':
        NavApps = [
          checkAppAvailable(strings.MapScreen.apps.uber),
          checkAppAvailable(strings.MapScreen.apps.googleMaps),
          checkAppAvailable(strings.MapScreen.apps.appleMaps),
        ];
        break;
    }

    Promise.all(NavApps).then(results => {
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
      case strings.MapScreen.apps.yaNavi:
        link = `yandexnavi://build_route_on_map?lat_to=${latitude}&lon_to=${longitude}`;
        break;
      case strings.MapScreen.apps.yaMaps:
        link = `yandexmaps://maps.yandex.ru/?pt=${longitude},${latitude}&z=12`;
        break;
      case strings.MapScreen.apps.yaTaxi:
        link = `https://3.redirect.appmetrica.yandex.com/route?end-lat=${latitude}&end-lon=${longitude}&ref=comatlantmapp&appmetrica_tracking_id=1178268795219780156`;
        break;
      case strings.MapScreen.apps.googleMaps:
        link = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        break;
      case strings.MapScreen.apps.uber:
        link = `uber://?action=setPickup&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[nickname]=${address_name}&[formatted_address]=${address}`;
        break;
      default:
        // strings.MapScreen.apps.appleMaps
        link = `maps://?daddr=${latitude},${longitude}`;
        break;
    }
    return link;
  };

  openDirections = url => {
    return Linking.openURL(url).catch(err => {
      console.error('err', err);

      setTimeout(() =>
        Alert.alert(
          strings.MapScreen.error.title,
          strings.MapScreen.error.text,
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
      case strings.MapScreen.apps.yaNavi:
        url = this.getNaviLink({
          ...baseParams,
          name: strings.MapScreen.apps.yaNavi,
        });
        break;
      case strings.MapScreen.apps.yaMaps:
        url = this.getNaviLink({
          ...baseParams,
          name: strings.MapScreen.apps.yaMaps,
        });
        break;
      case strings.MapScreen.apps.yaTaxi:
        url = this.getNaviLink({
          ...baseParams,
          name: strings.MapScreen.apps.yaTaxi,
        });
        break;
      case strings.MapScreen.apps.uber:
        url = this.getNaviLink({
          ...baseParams,
          name: strings.MapScreen.apps.uber,
        });
        break;
      case strings.MapScreen.apps.googleMaps:
        url = this.getNaviLink({
          ...baseParams,
          name: strings.MapScreen.apps.googleMaps,
        });
        break;
      default:
        url = this.getNaviLink({
          ...baseParams,
          name: strings.MapScreen.apps.appleMaps,
        });
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
    const {dealerSelected, availableNaviApps} = this.props;

    console.info('== MapScreen == ');

    return this.state.loading ? (
      // <View style={styles.safearea}>
      //   <Text style={styles.errorText}>{strings.MapScreen.empty.text}</Text>
      // </View>
      <ActivityIndicator
        size="large"
        color={styleConst.color.blue}
        style={[styleConst.spinner, styles.spinner]}
      />
    ) : (
      <SafeAreaView
        style={[
          styleConst.safearea.default,
          {
            paddingBottom: isAndroid
              ? styleConst.ui.footerHeightAndroid
              : styleConst.ui.footerHeightIphone,
          },
        ]}>
        <StatusBar barStyle="default" />
        <View style={styles.mapContainer} testID="MapScreen.MapView">
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
            <Marker
              coordinate={{
                latitude: this.state.data.coords.latitude,
                longitude: this.state.data.coords.longitude,
              }}
              pinColor={styleConst.color.blue}
              title={dealerSelected.name}
              ref={marker => {
                this.marker = marker;
              }}
              description={this._getDescription()}
            />
          </MapView>

          <ActionSheet
            cancelButtonIndex={0}
            ref={component => (this.actionSheet = component)}
            title={strings.MapScreen.chooseApp}
            options={availableNaviApps}
            onPress={this.onPressRouteVariant}
          />
          <Button
            size="md"
            testID="MapScreen.makeRouteButton"
            style={[styleConst.shadow.default, styles.button]}
            title={strings.MapScreen.makeRoute}
            onPress={this.onPressRoute}
            leftIcon={
              <Icon
                size={22}
                as={MaterialCommunityIcons}
                name="navigation"
                color="white"
                _dark={{
                  color: 'white',
                }}
                style={styles.iconRoute}
              />
            }>
            <Text style={styles.buttonText}>
              {strings.MapScreen.makeRoute.toUpperCase()}
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
