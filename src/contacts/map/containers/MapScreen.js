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
import { bindActionCreators } from 'redux';
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

const mapDispatchToProps = dispatch => {
  return bindActionCreators({

  }, dispatch);
};

class MapScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Найти нас',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
  })

  render() {
    const { dealerSelected } = this.props;
    const ASPECT_RATIO = width / height;
    const LATITUDE = +dealerSelected.coords.lat;
    const LONGITUDE = +dealerSelected.coords.lon;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
              description={`${dealerSelected.city} ${dealerSelected.address || ''}`}
            />
          </MapView>
        </View>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
