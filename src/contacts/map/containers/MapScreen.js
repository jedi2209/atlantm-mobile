import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
} from 'native-base';

// Maps
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

// Redux
import { connect } from 'react-redux';

// Helpers
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const mapStateToProps = ({ dealer }) => {
  return {
    dealerSelected: dealer.selected,
  };
};

class MapScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Найти нас',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
  })

  shouldComponentUpdate(nextProps) {
    return this.props.selectedDealer.id !== nextProps.selectedDealer.id &&
      this.props.navigation.state.routeName === 'MapScreen';
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const { dealerSelected } = this.props;
    const ASPECT_RATIO = width / height;
    const LATITUDE = +dealerSelected.coords.lat;
    const LONGITUDE = +dealerSelected.coords.lon;
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
      <Container style={styles.container} >
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
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
                latitude: LATITUDE,
                longitude: LONGITUDE,
              }}
              pinColor={styleConst.color.blue}
              title={dealerSelected.name}
              description={description}
            />
          </MapView>
        </View>
      </Container>
    );
  }
}

export default connect(mapStateToProps)(MapScreen);
