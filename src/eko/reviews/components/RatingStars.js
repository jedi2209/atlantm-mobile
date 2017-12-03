import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

// components
import { Icon } from 'native-base';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../../core/style-const';

const styles = StyleSheet.create({
  rating: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  starThemeGrey: {
    color: styleConst.color.greyText2,
  },
  starThemeBlue: {
    color: styleConst.color.systemBlue,
  },
  starSizeS: {
    fontSize: 12,
  },
  starSizeM: {
    fontSize: 18,
  },
});

export default class RatingStars extends PureComponent {
  static propTypes = {
    rating: PropTypes.number,
    itemId: PropTypes.string,
    theme: PropTypes.string,
    size: PropTypes.string,
  }

  static defaultProps = {
    rating: null,
    itemId: '',
    theme: 'grey',
    size: 's',
  }

  render() {
    const { rating, itemId, theme, size } = this.props;

    if (!rating) return null;

    const stars = new Array(rating).fill(0);
    const emptyStars = new Array(5 - rating).fill(0);

    return (
      <View style={styles.rating}>
        {stars.map((star, idx) => {
          return <Icon
            key={`star-${idx}-${itemId}`}
            name="ios-star"
            style={[
              styles.star,
              size === 's' ? styles.starSizeS : styles.starSizeM,
              theme === 'grey' ? styles.starThemeGrey : styles.starThemeBlue,
            ]}
          />;
        })}
        {emptyStars ? emptyStars.map((star, idx) => {
          return <Icon
            key={`emptyStars-${idx}-${itemId}`}
            name="ios-star-outline"
            style={[
              styles.star,
              size === 's' ? styles.starSizeS : styles.starSizeM,
              theme === 'grey' ? styles.starThemeGrey : styles.starThemeBlue,
            ]}
          />;
        }) : null}
      </View>
    );
  }
}
