import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Container, Content, StyleProvider } from 'native-base';

// redux
import { connect } from 'react-redux';
import { actionAddReviewMessagePlusFill, actionAddReviewMessageMinusFill } from '../../actions';

// components
import FooterButton from '../../../core/components/FooterButton';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import { get } from 'lodash';
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
  actionAddReviewMessagePlusFill,
  actionAddReviewMessageMinusFill,
};

class ReviewAddRatingStepScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Новый отзыв',
    headerStyle: stylesHeader.common,
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
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'ReviewAddRatingStepScreen';
      }
    }

    return isActiveScreen;
  }

  componentDidMount() {

  }

  onPressButton = () => {

  }

  render() {
    const {
      navigation,
      dealerSelected,
    } = this.props;

    console.log('== ReviewAddRatingStepScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
          </Content>
          <FooterButton
            text="ОТПРАВИТЬ"
            arrow={true}
            onPressButton={this.onPressButton}
          />
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewAddRatingStepScreen);
