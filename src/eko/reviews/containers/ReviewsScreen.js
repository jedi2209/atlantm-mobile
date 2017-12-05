import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content, StyleProvider } from 'native-base';

// redux
import { connect } from 'react-redux';
import {
  actionReviewVisit,
  actionFetchReviews,
  actionReviewsReset,
  actionDateFromFill,
  actionDateToFill,
  actionSelectFilterDatePeriod,
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
} from '../../actions';

// components
import ReviewsList from '../components/ReviewsList';
import ReviewsFilter from '../components/ReviewsFilter';
import DealerItemList from '../../../core/components/DealerItemList';
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import { REVIEWS_FILTER_DATE_PERIOD__MONTH } from '../../constants';
import { get } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import { substructMonth } from '../../../utils/date';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({ dealer, nav, eko }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    reviews: eko.reviews.items,
    pages: eko.reviews.pages,
    total: eko.reviews.total,
    dateFrom: eko.reviews.dateFrom,
    dateTo: eko.reviews.dateTo,
    filterRatingFrom: eko.reviews.filterRatingFrom,
    filterRatingTo: eko.reviews.filterRatingTo,
    isFetchReviews: eko.reviews.meta.isFetchReviews,
    needFetchReviews: eko.reviews.meta.needFetchReviews,
  };
};

const mapDispatchToProps = {
  actionReviewVisit,
  actionFetchReviews,
  actionReviewsReset,
  actionDateToFill,
  actionDateFromFill,
  actionSelectFilterDatePeriod,
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
};

class ReviewsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Отзывы',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  componentDidUpdate() {
    const { needFetchReviews, isFetchReviews } = this.props;

    if (needFetchReviews && !isFetchReviews) {
      this.fetchReviews();
    }
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'ReviewsScreen';
      }
    }

    return isActiveScreen;
  }

  onPressItem = review => {
    const { navigation, actionReviewVisit } = this.props;

    navigation.navigate('ReviewScreen', { review });

    this.props.actionReviewVisit(review.id);
  }

  fetchReviews = (type) => {
    let {
      pages,
      dateTo,
      dateFrom,
      filterRatingFrom,
      filterRatingTo,
      navigation,
      dealerSelected,
      actionFetchReviews,
      actionDateFromFill,
      actionSelectFilterDatePeriod,
      actionSelectFilterRatingFrom,
      actionSelectFilterRatingTo,
    } = this.props;

    if (!dateFrom) {
      dateFrom = substructMonth();
      actionDateFromFill(dateFrom);
      actionSelectFilterDatePeriod(REVIEWS_FILTER_DATE_PERIOD__MONTH);
    }

    console.log('filterRatingFrom', filterRatingFrom);
    console.log('filterRatingTo', filterRatingTo);

    if (!filterRatingFrom) {
      actionSelectFilterRatingFrom(1);
      actionSelectFilterRatingTo(5);
    }

    return actionFetchReviews({
      type,
      dateTo,
      dateFrom,
      ratingFrom: filterRatingFrom,
      ratingTo: filterRatingTo,
      nextPage: pages.next,
      dealerId: dealerSelected.id,
    });
  }

  onPressRating = () => this.props.navigation.navigate('ReviewsFilterRatingScreen')
  onPressDate = () => this.props.navigation.navigate('ReviewsFilterDateScreen')
  onPressAddReview = () => this.props.navigation.navigate('ReviewAddMessageStepScreen')

  render() {
    const {
      pages,
      reviews,
      navigation,
      dealerSelected,
      isFetchReviews,
    } = this.props;

    console.log('== ReviewsScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>

            <DealerItemList
              navigation={navigation}
              city={dealerSelected.city}
              name={dealerSelected.name}
              brands={dealerSelected.brands}
              returnScreen="ReviewsScreen"
            />

            <View style={styles.list}>
              <ReviewsList
                items={reviews}
                pages={pages}
                dataHandler={this.fetchReviews}
                onPressItemHandler={this.onPressItem}
                isFetchItems={isFetchReviews}
              />
            </View>
          </Content>
          <ReviewsFilter
            onPressRating={this.onPressRating}
            onPressDate={this.onPressDate}
            onPressAddReview={this.onPressAddReview}
          />
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsScreen);
