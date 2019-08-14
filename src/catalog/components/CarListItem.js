import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';

// components
import Imager from '../../core/components/Imager';

// helpers
import { get } from 'lodash';
import numberWithGap from '../../utils/number-with-gap';
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  container: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    paddingBottom: styleConst.ui.horizontalGap,
    marginLeft: styleConst.ui.horizontalGap,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.systemGray,
  },
  card: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 70,
    marginRight: styleConst.ui.horizontalGap,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: styleConst.font.medium,
  },
  priceContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  price: {
    flex: 1,
    fontSize: 14,
    fontFamily: styleConst.font.regular,
  },
  priceDefault: {
    textDecorationLine: 'line-through',
  },
  priceSpecial: {
    color: styleConst.color.red,
  },
  info: {
    marginTop: -4,
    flex: 1,
    flexWrap: 'wrap',
  },
  extra: {
    flexDirection: 'row',
  },
  extraItem: {
    marginRight: 10,
  },
  extraText: {
    fontFamily: styleConst.font.regular,
    fontSize: 12,
    color: styleConst.color.greyText3,
    flexDirection: 'column',
  },
});

export default class CarListItem extends Component {
  static propTypes = {
    car: PropTypes.object,
    prices: PropTypes.object,
    itemScreen: PropTypes.string,
    navigate: PropTypes.func,
  }

  static defaultProps = {
    car: null,
    prices: {},
    itemScreen: null,
    navigate: null,
  }

  onPress = () => {
    const { navigate, itemScreen, car } = this.props;

    navigate(itemScreen, { carId: car.id.api });
  }

  shouldComponentUpdate(nextProps) {
    const { car } = this.props;

    return (car.id.api !== nextProps.car.id.api);
  }

  renderPrice = ({ car, prices }) => {
    const isSale = car.sale === true;
    const currency = get(prices, 'curr.name');
    const priceDefault = numberWithGap(get(car, 'price.app.standart'));
    const priceSpecial = numberWithGap(get(car, 'price.app.sale'));

    return (
      <View style={styles.priceContainer}>
        <Text style={[styles.price, isSale ? styles.priceDefault : '']}>
          {`${priceDefault} ${currency}`}
        </Text>
        {
          isSale ?
            <Text style={[styles.price, styles.priceSpecial]}>{`${priceSpecial} ${currency}`}</Text> :
            null
        }
      </View>
    );
  }

  render() {
    const { car, prices } = this.props;
    const modelName = get(car, 'model.name', '');
    const complectation = get(car, 'complectation.name', '');
    const engineVolume = get(car, 'engine.volume.full');
    const mileage = get(car, 'mileage');
    const gearbox = get(car, 'gearbox.name');
    const year = get(car, 'year');

    // console.log('== CarListItem ==');

    return (
      <TouchableHighlight
        onPress={this.onPress}
        style={styles.container}
        underlayColor={styleConst.color.select}
      >
        <View style={styles.card}>
          <Imager
            resizeMode="contain"
            style={styles.image}
            source={{ uri: get(car, 'img.thumb.0') + '440x400' }}
          />

          <View style={styles.info}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {`${get(car, 'brand.name')} ${modelName || ''} ${complectation}`}
              </Text>
            </View>

            {this.renderPrice({ car, prices })}

            <View style={styles.extra}>
              {
                (get(car, 'engine.type') || engineVolume) ?
                  (
                  <View style={styles.extraItem}>
                    <View style={styles.extraTextContainer}><Text style={styles.extraText}>{car.engine.type}</Text></View>
                    {engineVolume ? <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`${engineVolume} см³`}</Text></View> : null}
                  </View>
                  ) : null
              }
              <View style={styles.extraItem}>
                {year ? <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`${year} г.в.`}</Text></View> : null}
                {mileage ? <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`пробег ${numberWithGap(mileage)} км.`}</Text></View> : null}
                {gearbox ? <View style={styles.extraTextContainer}><Text style={styles.extraText}>{`${gearbox}`}</Text></View> : null}
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
