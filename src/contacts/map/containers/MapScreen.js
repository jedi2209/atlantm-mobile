import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
  Text,
} from 'native-base';

// Maps
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Helpers
import styleConst from '../../../core/style-const';
import { scale } from '../../../utils/scale';
import styleHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
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
  static navigationOptions = () => ({
    headerTitle: 'Найти нас',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
  })

  render() {
    return (
      <Container>
        <Content style={styles.content} >
          <Text>Карта</Text>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
