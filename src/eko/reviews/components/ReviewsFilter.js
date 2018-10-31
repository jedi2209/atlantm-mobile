import React, { Component } from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';

// components
import { Footer } from 'native-base';

// helpers
import PropTypes from 'prop-types';
import styleConst from '@core/style-const';
import isIPhoneX from '@utils/is_iphone_x';

const size = 26;
const containerSize = 45;
const styles = StyleSheet.create({
  footer: {
    height: isIPhoneX() ? styleConst.ui.footerHeightIphone : styleConst.ui.footerHeightAndroid,
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

const icons = {
  date: require('../../assets/sort_date.png'),
  rating: require('../../assets/sort_rating.png'),
  add: require('../../assets/add_review.png'),
};

export default class ReviewsFilter extends Component {
  static propTypes = {
    onPressDate: PropTypes.func,
    onPressRating: PropTypes.func,
    onPressAddReview: PropTypes.func,
  }

  static defaultProps = {
    onPressDate: null,
    onPressRating: null,
    onPressAddReview: null,
  }

  renderIcon = (iconName, onPressHandler) => (
    <TouchableOpacity
      style={styles.icon}
      onPress={onPressHandler}
    >
      <View style={styles.iconInner}>
        <Image
          style={styles.image}
          source={icons[iconName]}
        />
      </View>
    </TouchableOpacity>
  )

  render() {
    const {
      onPressDate,
      onPressRating,
      onPressAddReview,
    } = this.props;

    return (
      <Footer style={styles.footer}>
          <View style={styles.container}>
            { onPressRating ? this.renderIcon('rating', onPressRating) : null}
            { onPressDate ? this.renderIcon('date', onPressDate) : null}
            { onPressAddReview ? this.renderIcon('add', onPressAddReview) : null}
          </View>
      </Footer>
    );
  }
}
