import React, { Component } from 'react';
import { TouchableOpacity, View, Image, StyleSheet, Dimensions } from 'react-native';

// components
import { Footer } from 'native-base';
import PricePicker from '../../../core/components/PricePicker';

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
    currency: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    currentMinPrice: PropTypes.number,
    currentMaxPrice: PropTypes.number,
  }

  render() {
    const {
      min,
      max,
      step,
      currency,
      onPressPrice,
      onClosePrice,
      currentMinPrice,
      currentMaxPrice,
    } = this.props;

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

            <PricePicker
              style={styles.icon}
              min={min}
              max={max}
              step={step}
              currentMinPrice={currentMinPrice}
              currentMaxPrice={currentMaxPrice}
              currency={currency}
              onPressModal={onPressPrice}
              onCloseModal={onClosePrice}
            >
              <View style={styles.iconInner}>
                <Image
                  style={styles.image}
                  source={require('../assets/price.png')}
                />
              </View>
            </PricePicker>
          </View>
      </Footer>
    );
  }
}
