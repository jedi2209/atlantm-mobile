import React, {Component} from 'react';
import {SafeAreaView, View, Alert, StatusBar} from 'react-native';

// redux
import {connect} from 'react-redux';
import {
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
} from '../../actions';

// components
import {Body, Content, ListItem, StyleProvider} from 'native-base';
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
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
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

class ReviewsFilterRatingScreen extends Component {
  static propTypes = {
    filterRatingFrom: PropTypes.number,
    filterRatingTo: PropTypes.number,
    actionSelectFilterRatingFrom: PropTypes.func,
    actionSelectFilterRatingTo: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    const {filterRatingFrom, filterRatingTo} = this.props;

    return (
      filterRatingFrom !== nextProps.filterRatingFrom ||
      filterRatingTo !== nextProps.filterRatingTo
    );
  }

  onPressItem = (selectedRating, type) => {
    const {
      filterRatingFrom,
      filterRatingTo,
      actionSelectFilterRatingFrom,
      actionSelectFilterRatingTo,
    } = this.props;

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

        if (this.isRatingFromSelected(selectedRating)) {
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

        if (this.isRatingToSelected(selectedRating)) {
          return false;
        } else {
          actionSelectFilterRatingTo(selectedRating);
        }
      }
    });
  };

  isRatingFromSelected = selectedRatingFrom =>
    this.props.filterRatingFrom === selectedRatingFrom;
  isRatingToSelected = selectedRatingTo =>
    this.props.filterRatingTo === selectedRatingTo;

  renderRatingFrom = () => {
    return RATING_ARRAY.map((rating, idx) => {
      const handler = () => this.onPressItem(rating, REVIEWS_RATING_TYPE__FROM);
      const isSelected = this.isRatingFromSelected(rating);
      const key = `rating-from-${rating}`;

      return this.renderItem(rating, isSelected, handler, key);
    });
  };

  renderRatingTo = () => {
    return RATING_ARRAY.map((rating, idx) => {
      const handler = () => this.onPressItem(rating, REVIEWS_RATING_TYPE__TO);
      const isSelected = this.isRatingToSelected(rating);
      const key = `rating-to-${rating}`;

      return this.renderItem(rating, isSelected, handler, key);
    });
  };

  renderItem = (rating, isSelected, onPressHandler, key) => {
    return (
      <View key={key} style={stylesList.listItemContainer}>
        <ListItem
          icon
          style={stylesList.listItemPressable}
          onPress={onPressHandler}>
          <RadioIcon containerStyle={{marginTop: 5}} selected={isSelected} />
          <Body style={stylesList.bodyWithLeftGap}>
            <RatingStars
              size="M"
              theme="blue"
              StyleContainer={{marginTop: 12}}
              rating={rating}
              itemId={key}
            />
          </Body>
        </ListItem>
      </View>
    );
  };

  render() {
    console.info('== ReviewsFilterDateScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styleConst.safearea.default}>
          <StatusBar barStyle="light-content" />
          <Content>
            <ListItemHeader
              text={strings.ReviewsFilterRatingScreen.rating.from.toUpperCase()}
            />
            {this.renderRatingFrom()}
            <ListItemHeader
              text={strings.ReviewsFilterRatingScreen.rating.to.toUpperCase()}
            />
            {this.renderRatingTo()}
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewsFilterRatingScreen);
