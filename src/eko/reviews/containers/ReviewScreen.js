/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

// redux
import {connect} from 'react-redux';
import {actionFetchDealerRating} from '../../actions';

// components
import Review from '../components/Review';
import ReviewDealerAnswer from '../components/ReviewDealerAnswer';
import HeaderSubtitle from '../../../core/components/HeaderSubtitle';
import LogoLoader from '../../../core/components/LogoLoader';

// helpers
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import {strings} from '../../../core/lang/const';
import {ScrollView, VStack} from 'native-base';

const styles = StyleSheet.create({
  review: {
    marginLeft: 0,
    marginTop: 10,
    marginBottom: styleConst.ui.horizontalGap,
  },
});

const mapStateToProps = ({dealer, eko, nav}) => {
  return {
    nav,
    reviewDealerRating: eko.reviews.reviewDealerRating,
    isFetchDealerRating: eko.reviews.meta.isFetchDealerRating,
    dealerSelectedLocal: dealer.selectedLocal,
  };
};

const mapDispatchToProps = {
  actionFetchDealerRating,
};

const ReviewScreen = ({
  dealerSelectedLocal,
  reviewDealerRating,
  actionFetchDealerRating,
  route,
  isFetchDealerRating,
}) => {
  const review = get(route, 'params.review');

  useEffect(() => {
    console.info('== ReviewScreen ==');
    if (!reviewDealerRating) {
      actionFetchDealerRating({
        dealerId: dealerSelectedLocal.id,
      });
    }
  }, [actionFetchDealerRating, dealerSelectedLocal.id, reviewDealerRating]);

  if (!review) {
    return null;
  }

  if (isFetchDealerRating) {
    return <LogoLoader />;
  }

  const subtitle = [
    dealerSelectedLocal.name,
    `${strings.ReviewScreen.rating} ${reviewDealerRating} из 10`,
  ];

  return (
    <ScrollView>
      <VStack>
        <View style={{marginTop: 10}}>
          <HeaderSubtitle content={subtitle} isBig={true} />
        </View>

        <View mb={2} style={styles.review}>
          <Review review={review} />
        </View>

        {review.answer ? <ReviewDealerAnswer text={review.answer} /> : null}
      </VStack>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewScreen);
