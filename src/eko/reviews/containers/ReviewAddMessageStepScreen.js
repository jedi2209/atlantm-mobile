import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content, StyleProvider } from 'native-base';

// redux
import { connect } from 'react-redux';
import { actionAddReviewPlusFill, actionAddReviewMinusFill } from '../../actions';

// components
import InfoLine from '../../components/InfoLine';
import ReviewAddMessageForm from '../components/ReviewAddMessageForm';
import FooterButton from '../../../core/components/FooterButton';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import HeaderSubtitle from '../../../core/components/HeaderSubtitle';

// helpers
import { get } from 'lodash';
import { TEXT_MESSAGE_CONTROL } from '../../constants';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({ dealer, eko, nav }) => {
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
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Новый отзыв',
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
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'ReviewAddMessageStepScreen';
      }
    }

    return isActiveScreen;
  }

  componentDidMount() {

  }

  onPressButton = () => this.props.navigation.navigate('ReviewAddRatingStepScreen')

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
        <Container>
          <Content style={styles.content}>
            <HeaderSubtitle content={dealerSelected.name} isBig={true} />
            <ReviewAddMessageForm
              messagePlus={messagePlus}
              messageMinus={messageMinus}
              messagePlusFill={actionAddReviewPlusFill}
              messageMinusFill={actionAddReviewMinusFill}
            />
            <InfoLine infoIcon={true} text={TEXT_MESSAGE_CONTROL} />
          </Content>
          <FooterButton
            text="ПРОДОЛЖИТЬ"
            arrow={true}
            onPressButton={this.onPressButton}
          />
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewAddMessageStepScreen);
