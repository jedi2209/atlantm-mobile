import React, { Component } from 'react';
import { TouchableOpacity, View, Image, StyleSheet, Dimensions } from 'react-native';

// containers
import { Footer } from 'native-base';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../../core/style-const';

const size = 26;
const containerSize = 45;
const styles = StyleSheet.create({
  footer: {
    height: 45,
    backgroundColor: styleConst.color.header,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  icon: {
    paddingHorizontal: styleConst.ui.horizontalGap * 2,
    width: containerSize,
    height: containerSize,
    justifyContent: 'center',
  },
  iconInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: size,
    height: size,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});

export default class FooterFilter extends Component {
  static propTypes = {
    onPressCity: PropTypes.func,
    onPressPrice: PropTypes.func,
  }

  render() {
    return (
      <Footer style={styles.footer}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.icon}
              onPress={this.props.onPressCity}
            >
              <View style={styles.iconInner}>
                <Image
                  style={styles.image}
                  source={require('../assets/location.png')}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.icon}
              onPress={this.props.onPressPrice}
            >
              <View style={styles.iconInner}>
                <Image
                  style={styles.image}
                  source={require('../assets/price.png')}
                />
              </View>
            </TouchableOpacity>
          </View>
      </Footer>
    );
  }
}
