import React, {useEffect} from 'react';
import {Alert} from 'react-native';

// redux
import {connect} from 'react-redux';
import {
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
} from '../../actions';

// components
import {HStack, View, Pressable} from 'native-base';
import RadioIcon from '../../../core/components/RadioIcon';
import ListItemHeader from '../../../profile/components/ListItemHeader';
import RatingStars from '../components/RatingStars';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {
  REVIEWS_RATING_TYPE__FROM,
  REVIEWS_RATING_TYPE__TO,
} from '../../constants';
import PropTypes from 'prop-types';

import {strings} from '../../../core/lang/const';

const RATING_ARRAY = [1, 2, 3, 4, 5];

const mapStateToProps = ({eko, nav}) => {
  return {
    nav,
    filterRatingFrom: eko.reviews.filterRatingFrom,
    filterRatingTo: eko.reviews.filterRatingTo,
  };
};

const mapDispatchToProps = {
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
};

const ReviewsFilterRatingScreen = ({
  filterRatingFrom,
  filterRatingTo,
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
}) => {
  useEffect(() => {
    console.info('== ReviewsFilterDateScreen ==');
  }, []);

  const _onPressItem = (selectedRating, type) => {
    requestAnimationFrame(() => {
      if (type === REVIEWS_RATING_TYPE__FROM) {
        if (selectedRating > filterRatingTo) {
          return setTimeout(
            () =>
              Alert.alert(
                strings.ReviewsFilterRatingScreen.Notifications.rating,
              ),
            100,
          );
        }

        if (_isRatingFromSelected(selectedRating)) {
          return false;
        } else {
          actionSelectFilterRatingFrom(selectedRating);
        }
      }

      if (type === REVIEWS_RATING_TYPE__TO) {
        if (selectedRating < filterRatingFrom) {
          return setTimeout(
            () =>
              Alert.alert(
                strings.ReviewsFilterRatingScreen.Notifications.rating2,
              ),
            100,
          );
        }

        if (_isRatingToSelected(selectedRating)) {
          return false;
        } else {
          actionSelectFilterRatingTo(selectedRating);
        }
      }
    });
  };

  const _isRatingFromSelected = selectedRatingFrom =>
    filterRatingFrom === selectedRatingFrom;
  const _isRatingToSelected = selectedRatingTo =>
    filterRatingTo === selectedRatingTo;

  const _renderRating = type => {
    switch (type) {
      case 'from':
        return RATING_ARRAY.map((rating, idx) => {
          const handler = () => _onPressItem(rating, REVIEWS_RATING_TYPE__FROM);
          const isSelected = _isRatingFromSelected(rating);
          const key = `rating-from-${rating}`;

          return _renderItem(rating, isSelected, handler, key);
        });
      case 'to':
        return RATING_ARRAY.map((rating, idx) => {
          const handler = () => _onPressItem(rating, REVIEWS_RATING_TYPE__TO);
          const isSelected = _isRatingToSelected(rating);
          const key = `rating-to-${rating}`;

          return _renderItem(rating, isSelected, handler, key);
        });
      default:
        break;
    }
  };

  const _renderItem = (rating, isSelected, onPressHandler, key) => {
    return (
      <View key={key} style={stylesList.listItemContainer}>
        <Pressable
          style={[stylesList.listItemPressable, {marginTop: 15}]}
          onPress={onPressHandler}>
          <HStack ml={3} alignContent={'center'}>
            <RadioIcon
              selected={isSelected}
              containerStyle={{marginRight: 10}}
            />
            <RatingStars size="M" theme="blue" rating={rating} itemId={key} />
          </HStack>
        </Pressable>
      </View>
    );
  };

  return (
    <View>
      <ListItemHeader
        text={strings.ReviewsFilterRatingScreen.rating.from.toUpperCase()}
      />
      {_renderRating('from')}
      <ListItemHeader
        text={strings.ReviewsFilterRatingScreen.rating.to.toUpperCase()}
      />
      {_renderRating('to')}
    </View>
  );
};

ReviewsFilterRatingScreen.propTypes = {
  filterRatingFrom: PropTypes.number,
  filterRatingTo: PropTypes.number,
  actionSelectFilterRatingFrom: PropTypes.func,
  actionSelectFilterRatingTo: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewsFilterRatingScreen);
