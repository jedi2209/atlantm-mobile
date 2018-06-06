import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';

// Maps
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions';

// Redux
import { connect } from 'react-redux';
import { actionRequestUserLocation, actionDoneUserLocation } from '@contacts/actions';

// components
import { Icon } from 'native-base';
import FooterButton from '@core/components/FooterButton';
import HeaderIconBack from '@core/components/HeaderIconBack/HeaderIconBack';

// Helpers
import { get } from 'lodash';
import styleConst from '@core/style-const';
import stylesHeader from '@core/components/Header/style';

const isAndroid = Platform.OS === 'android';
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
    justifyContent: 'center',
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
    // fontSize: 18,
    color: 'white',
  },
});

const mapStateToProps = ({ dealer, contacts }) => {
  return {
    isRequestUserLocation: contacts.map.isRequestUserLocation,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionRequestUserLocation,
  actionDoneUserLocation,
};

class MapScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Найти нас',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
  })

  shouldComponentUpdate(nextProps) {
    const { isRequestUserLocation, dealerSelected, navigation } = this.props;

    return isRequestUserLocation !== nextProps.isRequestUserLocation ||
      (dealerSelected.id !== nextProps.dealerSelected.id &&
      navigation.state.routeName === 'MapScreen');
  }

  onPressRoute = async () => {
    let positionRaw = {};
    let permissionGranted = true; // по умолчанию считаем что разрешение есть

    const latitude = Number(get(this.props.dealerSelected, 'coords.lat'));
    const longitude = Number(get(this.props.dealerSelected, 'coords.lon'));

    if (isAndroid) {
      try {
        permissionGranted = await this.requestLocationPermission();
      } catch (error) {}
    }

    // если для андроида нет разрешений – не запрашиваем геопозию, чтобы не было креша приложения
    // @see https://facebook.github.io/react-native/docs/geolocation.html#android
    if (permissionGranted || !isAndroid) {
      try {
        positionRaw = await this.getUserPosition();
      } catch (error) {}
    }

    const userLocation = {
      latitude: get(positionRaw, 'coords.latitude', null),
      longitude: get(positionRaw, 'coords.longitude', null),
    };
    const destinationLocation = {
      latitude,
      longitude,
    };

    this.openDirections(userLocation, destinationLocation);
  }

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Запрос геолокации',
          'message': 'Для построения маршрута',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;

    } catch (err) {
      return false;
    }
  }

  getUserPosition = () => {
    const { actionRequestUserLocation, actionDoneUserLocation } = this.props;

    return new Promise((resolve, reject) => {
      actionRequestUserLocation();

      navigator.geolocation.getCurrentPosition(
        function(position) {
          actionDoneUserLocation();

          return resolve(position);
        },
        function(error) {
          return reject(error);
        },
      );
    });
  }

  openDirections = (userLocation, destinationLocation) => {
    const data = {
      source: userLocation,
      destination: destinationLocation,
      params: [],
    };

    getDirections(data);
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const { dealerSelected, isRequestUserLocation } = this.props;

    const LATITUDE = get(this.props.dealerSelected, 'coords.lat');
    const LONGITUDE = get(this.props.dealerSelected, 'coords.lon');

    if (!LATITUDE || !LONGITUDE) {
      return (
        <View style={styles.safearea}>
          <Text style={styles.errorText}>Нет данных для отображение карты</Text>
        </View>
      );
    }

    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    const city = dealerSelected.city | '';
    const address = dealerSelected.address | '';
    let description;

    if (city) {
      description = city;
    }

    if (address) {
      description = description + ' ' + address;
    }

    console.log('== MapScreen == ');

    return (
      <View style={styles.safearea}>
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: +LATITUDE,
              longitude: +LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            showsScale={true}
            zoomEnabled={true}
            pitchEnabled={true}
            loadingEnabled={true}
            loadingIndicatorColor={styleConst.color.blue}
          >
            <MapView.Marker
              coordinate={{
                latitude: +LATITUDE,
                longitude: +LONGITUDE,
              }}
              pinColor={styleConst.color.blue}
              title={dealerSelected.name}
              description={description}
            />
          </MapView>
          <FooterButton
            icon={<Icon name="google-maps" style={styles.iconRoute} type="MaterialCommunityIcons" />}
            text="Как найти нас"
            isLoading={isRequestUserLocation}
            onPressButton={this.onPressRoute}
          />
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
