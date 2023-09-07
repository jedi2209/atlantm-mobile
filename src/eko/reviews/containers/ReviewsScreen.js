import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

// redux
import {connect} from 'react-redux';
import {
  actionReviewVisit,
  actionFetchReviews,
  actionDateFromFill,
  actionDateToFill,
  actionSelectFilterDatePeriod,
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
} from '../../actions';
import {localDealerClear} from '../../../dealer/actions';

// components
import ReviewsList from '../components/ReviewsList';
import ReviewsFilter from '../components/ReviewsFilter';
import DealerItemList from '../../../core/components/DealerItemList';

// helpers
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import {substractYears} from '../../../utils/date';
import {strings} from '../../../core/lang/const';
import LogoLoader from '../../../core/components/LogoLoader';

import {EVENT_DEFAULT} from '../../../core/actionTypes';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({dealer, nav, eko}) => {
  return {
    nav,
    dealerSelectedLocal: dealer.selectedLocal,
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
  actionDateToFill,
  actionDateFromFill,
  actionSelectFilterDatePeriod,
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
  localDealerClear,
};

const ReviewsScreen = props => {
  const {
    pages,
    reviews,
    navigation,
    route,
    dealerSelectedLocal,
    isFetchReviews,
    actionReviewVisit,
    localDealerClear,
  } = props;

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (dealerSelectedLocal) {
      setLoading(true);
      _fetchReviews(EVENT_DEFAULT).then(res => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
      // console.log('params.prevScreen', get(route, 'params.prevScreen', null));
      // return () => {
      //   if (get(route, 'params.prevScreen', null) !== 'ChooseDealerScreen') {
      //     localDealerClear();
      //   }
      // };
    } else {
      navigation.navigate('ChooseDealerScreen', {
        returnScreen: route.name,
        goBack: true,
        isLocal: true,
      });
    }
  }, [dealerSelectedLocal]);

  const _onPressItem = review => {
    navigation.navigate('ReviewScreen', {
      review,
      returnScreen: 'ReviewsScreen',
    });
    actionReviewVisit(review?.id);
  };

  // const _onPressRating = () => navigation.navigate('ReviewsFilterRatingScreen');
  // const _onPressDate = () => navigation.navigate('ReviewsFilterDateScreen');
  // const _onPressAddReview = () =>
  //   navigation.navigate('ReviewAddMessageStepScreen');

  const _fetchReviews = type => {
    let {
      pages,
      dateTo,
      dateFrom,
      filterRatingFrom,
      filterRatingTo,
      dealerSelectedLocal,
      actionFetchReviews,
      actionDateFromFill,
      actionSelectFilterDatePeriod,
      actionSelectFilterRatingFrom,
      actionSelectFilterRatingTo,
    } = props;

    if (!dateFrom) {
      dateFrom = substractYears(10);
      actionDateFromFill(dateFrom);
      actionSelectFilterDatePeriod(strings.ReviewsFilterDateScreen.periods.all);
    }

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
      dealerId: dealerSelectedLocal.id,
    });
  };

  if (isLoading) {
    return <LogoLoader />;
  }

  return (
    <SafeAreaView style={styles.content}>
      <DealerItemList
        dealer={dealerSelectedLocal}
        goBack={true}
        isLocal={true}
        returnScreen={route.name}
        style={{marginHorizontal: 8}}
        showBrands={false}
        placeholder={strings.ChooseDealerScreen.title}
      />

      {dealerSelectedLocal ? (
        <ReviewsList
          items={reviews}
          pages={pages}
          extraData={dealerSelectedLocal.id}
          dataHandler={_fetchReviews}
          onPressItemHandler={_onPressItem}
          isFetchItems={isFetchReviews}
        />
      ) : null}

      {/* <ReviewsFilter
        onPressRating={_onPressRating}
        onPressDate={_onPressDate}
        onPressAddReview={_onPressAddReview}
      /> */}
    </SafeAreaView>
  );
};

// class ReviewsScreen extends Component {
//   componentDidUpdate(prevProps) {
//     const {needFetchReviews, isFetchReviews} = this.props;
//     const isFilterWillUpdate =
//       prevProps.dateTo !== this.props.dateTo ||
//       prevProps.dateFrom !== this.props.dateFrom ||
//       prevProps.filterRatingFrom !== this.props.filterRatingFrom ||
//       prevProps.filterRatingTo !== this.props.filterRatingTo;

//     if (isFilterWillUpdate && needFetchReviews && !isFetchReviews) {
//       this.fetchReviews();
//     }
//   }
// }

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsScreen);
