import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet, Text, StatusBar} from 'react-native';
import {Content, StyleProvider} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionAddReviewPlusFill, actionAddReviewMinusFill} from '../../actions';

// components
import InfoLine from '../../components/InfoLine';
import ReviewAddMessageForm from '../components/ReviewAddMessageForm';
import FooterButton from '../../../core/components/FooterButton';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import HeaderSubtitle from '../../../core/components/HeaderSubtitle';

// helpers
import {get} from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({dealer, eko, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    messagePlus: eko.reviews.messagePlus,
    messageMinus: eko.reviews.messageMinus,
  };
};

const mapDispatchToProps = {
  actionAddReviewPlusFill,
  actionAddReviewMinusFill,
};

class ReviewAddMessageStepScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <Text style={stylesHeader.blueHeaderTitle}>Новый отзыв</Text>,
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: (
      <View>
        <HeaderIconBack theme="white" navigation={navigation} />
      </View>
    ),
    headerRight: <View />,
  });

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen =
          get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
          'ReviewAddMessageStepScreen';
      }
    }

    return isActiveScreen;
  }

  componentDidMount() {}

  onPressButton = () =>
    this.props.navigation.navigate('ReviewAddRatingStepScreen');

  render() {
    const {
      messagePlus,
      messageMinus,
      actionAddReviewPlusFill,
      actionAddReviewMinusFill,
      navigation,
      dealerSelected,
    } = this.props;

    console.log('== ReviewAddMessageStepScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <StatusBar barStyle="light-content" />
          <Content style={{paddingTop: 10}}>
            <HeaderSubtitle content={dealerSelected.name} isBig={true} />
            <ReviewAddMessageForm
              messagePlus={messagePlus}
              messageMinus={messageMinus}
              messagePlusFill={actionAddReviewPlusFill}
              messageMinusFill={actionAddReviewMinusFill}
            />
          </Content>
          <FooterButton text="Продолжить" onPressButton={this.onPressButton} />
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddMessageStepScreen);
