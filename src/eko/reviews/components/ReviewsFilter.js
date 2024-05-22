import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

// components
import {View} from 'native-base';

// helpers
import styleConst from '../../../core/style-const';

const size = 26;
const containerSize = 50;

const styleFooter = StyleSheet.create({
  footer: {
    height: 50,
    backgroundColor: styleConst.color.bg,
    borderTopWidth: 0,
  },
  footerFilters: {},
  button: {
    height: styleConst.ui.footerHeightAndroid,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: styleConst.color.lightBlue,
  },
  orderPriceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
    backgroundColor: styleConst.color.bg,
  },
  orderPriceContainerNotSale: {
    flexDirection: 'row',
  },
  content: {
    marginBottom: 20,
  },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    height: containerSize,
    backgroundColor: styleConst.color.bg,
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

const ReviewsFilter = props => {
  const {
    onPressDate = null,
    onPressRating = null,
    onPressAddReview = null,
  } = props;

  const _renderIcon = (iconName, onPressHandler) => (
    <TouchableOpacity style={styles.icon} onPress={onPressHandler}>
      <View style={styles.iconInner}>
        <Image style={styles.image} source={icons[iconName]} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styleFooter.footerFilters, styleFooter.footer]}>
      <View style={[styles.container]}>
        {onPressRating ? _renderIcon('rating', onPressRating) : null}
        {onPressDate ? _renderIcon('date', onPressDate) : null}
        {onPressAddReview ? _renderIcon('add', onPressAddReview) : null}
      </View>
    </View>
  );
};

export default ReviewsFilter;
