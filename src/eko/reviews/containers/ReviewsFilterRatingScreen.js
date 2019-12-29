import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet, Alert, Text} from 'react-native';

// redux
import {connect} from 'react-redux';
import {
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
} from '../../actions';

// components
import {Body, Content, ListItem, StyleProvider} from 'native-base';
import RadioIcon from '../../../core/components/RadioIcon';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
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
import stylesHeader from '../../../core/components/Header/style';

const RATING_ARRAY = [1, 2, 3, 4, 5];

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

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

class ReviewsFilterDateScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      <Text style={stylesHeader.blueHeaderTitle}>Отзывы c рейтингом</Text>
    ),
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: (
      <View>
        <HeaderIconBack theme="white" navigation={navigation} />
      </View>
    ),
    headerRight: <View />,
  });

  static propTypes = {
    navigation: PropTypes.object,
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
              Alert.alert('"Рейтинг от" не может быть больше "рейтинга до"'),
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
              Alert.alert('"Рейтинг до" не может быть меньше "рейтинга от"'),
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
      const isLast = RATING_ARRAY.length - 1 === idx;
      const isSelected = this.isRatingFromSelected(rating);
      const key = `rating-from-${rating}`;

      return this.renderItem(rating, isSelected, handler, isLast, key);
    });
  };

  renderRatingTo = () => {
    return RATING_ARRAY.map((rating, idx) => {
      const handler = () => this.onPressItem(rating, REVIEWS_RATING_TYPE__TO);
      const isLast = RATING_ARRAY.length - 1 === idx;
      const isSelected = this.isRatingToSelected(rating);
      const key = `rating-to-${rating}`;

      return this.renderItem(rating, isSelected, handler, isLast, key);
    });
  };

  renderItem = (rating, isSelected, onPressHandler, isLast, key) => {
    return (
      <View key={key} style={stylesList.listItemContainer}>
        <ListItem
          last={isLast}
          icon
          style={stylesList.listItemPressable}
          onPress={onPressHandler}>
          <RadioIcon
            containerStyle={{
              marginTop: 5,
            }}
            selected={isSelected}
          />
          <Body style={stylesList.bodyWithLeftGap}>
            <RatingStars size="M" theme="blue" rating={rating} itemId={key} />
          </Body>
        </ListItem>
      </View>
    );
  };

  render() {
    console.log('== ReviewsFilterDateScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            <ListItemHeader text="РЕЙТИНГ ОТ" />
            {this.renderRatingFrom()}
            <ListItemHeader text="РЕЙТИНГ ДО" />
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
)(ReviewsFilterDateScreen);
