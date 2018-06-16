import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Content, StyleProvider } from 'native-base';

// redux
import { connect } from 'react-redux';
import { actionFetchDealerRating } from '../../actions';

// components
import Review from '../components/Review';
import ReviewDealerAnswer from '../components/ReviewDealerAnswer';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import HeaderSubtitle from '../../../core/components/HeaderSubtitle';
import SpinnerView from '../../../core/components/SpinnerView';

// helpers
import { get } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  review: {
    marginBottom: styleConst.ui.horizontalGap,
  },
});

const mapStateToProps = ({ dealer, eko, nav }) => {
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
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Отзыв',
    headerStyle: [stylesHeader.common, stylesHeader.resetBorder],
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'ReviewScreen';
      }
    }

    return isActiveScreen;
  }

  componentDidMount() {
    const { dealerSelected, reviewDealerRating, actionFetchDealerRating } = this.props;

    if (!reviewDealerRating) {
      actionFetchDealerRating({
        dealerId: dealerSelected.id,
      });
    }
  }

  getReview = () => get(this.props.navigation, 'state.params.review');

  render() {
    const {
      navigation,
      dealerSelected,
      reviewDealerRating,
      isFetchDealerRating,
    } = this.props;

    const review = this.getReview();

    if (!review) return null;

    console.log('== ReviewScreen ==');

    if (isFetchDealerRating) {
      return <SpinnerView />;
    }

    const subtitle = [
      dealerSelected.name,
      `Рейтинг ${reviewDealerRating} из 10`,
    ];

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            <HeaderSubtitle content={subtitle} isBig={true} />

            <View style={styles.review}>
              <Review review={review} />
            </View>

            { review.answer ? <ReviewDealerAnswer text={review.answer} /> : null }
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewScreen);
