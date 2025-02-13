import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Button, Fab, HStack, Icon} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// redux
import {connect} from 'react-redux';
import {
  actionReviewVisit,
  actionFetchReviews,
  actionDateFromFill,
  actionSelectFilterDatePeriod,
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
  clearFiltersEKO,
} from '../../actions';
import {localDealerClear} from '../../../dealer/actions';

// components
import ReviewsList from '../components/ReviewsList';
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

const mapStateToProps = ({dealer, eko}) => {
  return {
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
  actionDateFromFill,
  actionSelectFilterDatePeriod,
  actionSelectFilterRatingFrom,
  actionSelectFilterRatingTo,
  clearFiltersEKO,
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
    dateFrom,
    dateTo,
    filterRatingFrom,
    filterRatingTo,
    actionReviewVisit,
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
    }
  }, [dealerSelectedLocal, dateFrom, filterRatingTo, filterRatingFrom]);

  useEffect(() => {
    if (!dealerSelectedLocal) {
      navigation.navigateDeprecated('ChooseDealerScreen', {
        returnScreen: route.name,
        goBack: true,
        isLocal: true,
      });
    }

    return () => {
      if (get(route, 'params.prevScreen', null) !== 'ChooseDealerScreen') {
        props.localDealerClear();
        props.clearFiltersEKO();
      }
    };
  }, []);

  const _onPressItem = review => {
    navigation.navigateDeprecated('ReviewScreen', {
      review,
      returnScreen: 'ReviewsScreen',
    });
    actionReviewVisit(review?.id);
  };

  const _fetchReviews = type => {
    let {
      pages,
      filterRatingFrom,
      filterRatingTo,
      dealerSelectedLocal,
      actionFetchReviews,
    } = props;

    return actionFetchReviews({
      type,
      dateTo,
      dateFrom:
        dateFrom === strings.ReviewsFilterDateScreen.periods.all
          ? substractYears(10)
          : dateFrom
          ? dateFrom
          : substractYears(10),
      ratingFrom: filterRatingFrom ? filterRatingFrom : 1,
      ratingTo: filterRatingTo ? filterRatingTo : 5,
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
        style={{marginHorizontal: 8, marginBottom: 8}}
        showBrands={false}
        placeholder={strings.ChooseDealerScreen.title}
      />

      {dealerSelectedLocal ? (
        <ReviewsList
          items={reviews}
          pages={pages}
          dataHandler={_fetchReviews}
          onPressItemHandler={_onPressItem}
          isFetchItems={isFetchReviews}
        />
      ) : null}
      <Fab
        renderInPortal={false}
        style={{backgroundColor: styleConst.color.blue, marginBottom: 20}}
        shadow={7}
        size="sm"
        icon={
          <Icon
            size={8}
            as={MaterialCommunityIcons}
            name="plus"
            color={styleConst.color.white}
            _dark={{
              color: styleConst.color.white,
            }}
          />
        }
        placement="bottom-right"
        onPress={() => navigation.navigateDeprecated('ReviewAddMessageStepScreen')}
      />
    </SafeAreaView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewsScreen);
