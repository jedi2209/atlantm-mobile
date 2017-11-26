import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'native-base';

// helpers
import styleConst from '../../../core/style-const';

const iconSize = 12;
const styles = StyleSheet.create({
  rating: {
    flexDirection: 'row',
  },
  star: {
    fontSize: iconSize,
    color: styleConst.color.greyText2,
    marginRight: 2,
  },
});

export default class RatingStars extends PureComponent {
  render() {
    const { rating, itemId } = this.props;
    const stars = new Array(rating).fill(0);
    const emptyStars = new Array(5 - rating).fill(0);

    return (
      <View style={styles.rating}>
        {stars.map((star, idx) => {
          return <Icon key={`star-${idx}-${itemId}`} name="ios-star" style={styles.star} />;
        })}
        {emptyStars ? emptyStars.map((star, idx) => {
          return <Icon key={`emptyStars-${idx}-${itemId}`} name="ios-star-outline" style={styles.star} />;
        }) : null}
      </View>
    );
  }
}
