import React, { Component } from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';

// components
import { Footer } from 'native-base';
import PricePicker from '@core/components/PricePicker';

// helpers
import PropTypes from 'prop-types';
import isIPhoneX from '@utils/is_iphone_x';
import styleConst from '@core/style-const';

const size = 26;
const containerSize = 45;
const styles = StyleSheet.create({
  footer: {
    height: isIPhoneX() ? styleConst.footerHeight : styleConst.footerHeightAndroid,
    backgroundColor: styleConst.color.header,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    paddingLeft: '2%',
    paddingRight: '2%',
    bottom: isIPhoneX() ? styleConst.ui.horizontalGap : 0
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
    onClosePrice: PropTypes.func,
    currency: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    currentMinPrice: PropTypes.number,
    currentMaxPrice: PropTypes.number,
    showPriceFilterIcon: PropTypes.bool,
  }

  static defaultProps = {
    showPriceFilterIcon: false,
  }

  render() {
    const {
      min,
      max,
      step,
      currency,
      onPressCity,
      onPressPrice,
      onClosePrice,
      currentMinPrice,
      currentMaxPrice,
      showPriceFilterIcon,
    } = this.props;

    return (
      <Footer style={styles.footer}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.icon}
              onPress={onPressCity}
            >
              <View style={styles.iconInner}>
                <Image
                  style={styles.image}
                  source={require('../assets/location.png')}
                />
              </View>
            </TouchableOpacity>

            {
              showPriceFilterIcon ?
              (
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
              ) : null
            }
          </View>
      </Footer>
    );
  }
}
