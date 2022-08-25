/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';

// redux
import {connect} from 'react-redux';
import {actionFetchDealerRating} from '../../actions';

// components
import Review from '../components/Review';
import ReviewDealerAnswer from '../components/ReviewDealerAnswer';
import HeaderSubtitle from '../../../core/components/HeaderSubtitle';
import SpinnerView from '../../../core/components/SpinnerView';

// helpers
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import {strings} from '../../../core/lang/const';
import { ScrollView, VStack } from 'native-base';

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
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  actionFetchDealerRating,
};

class ReviewScreen extends Component {
  componentDidMount() {
    const {dealerSelected, reviewDealerRating, actionFetchDealerRating} =
      this.props;

    if (!reviewDealerRating) {
      actionFetchDealerRating({
        dealerId: dealerSelected.id,
      });
    }
  }

  getReview = () => get(this.props.route, 'params.review');

  render() {
    const {
      navigation,
      dealerSelected,
      reviewDealerRating,
      isFetchDealerRating,
    } = this.props;

    const review = this.getReview();

    if (!review) {
      return null;
    }

    console.info('== ReviewScreen ==');

    if (isFetchDealerRating) {
      return <SpinnerView />;
    }

    const subtitle = [
      dealerSelected.name,
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewScreen);
