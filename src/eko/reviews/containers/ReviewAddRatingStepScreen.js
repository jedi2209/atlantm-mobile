import React, { Component } from 'react';
import { Alert, View, StyleSheet } from 'react-native';

// redux
import { connect } from 'react-redux';
import { REVIEW_ADD__SUCCESS, REVIEW_ADD__FAIL } from '../../actionTypes';
import {
  actionReviewAdd,
  actionSelectAddReviewRating,
  actionSelectAddReviewPublicAgree,
  actionSelectAddReviewRatingVariant,
} from '../../actions';

// styles
import stylesList from '../../../core/components/Lists/style';

// components
import { Label, Container, Content, StyleProvider, Switch, Body, ListItem, Right } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import InfoLine from '../../components/InfoLine';
import RatingList from '../../components/RatingList';
import FooterButton from '../../../core/components/FooterButton';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

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
  publicAgreeContainer: {
    marginTop: 25,
    marginBottom: 5,
  },
  publicAgreeText: {
    fontSize: 16,
  },
});

const mapStateToProps = ({ dealer, eko, nav, profile }) => {
  return {
    nav,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    dealerSelected: dealer.selected,
    publicAgree: eko.reviews.publicAgree,
    messagePlus: eko.reviews.messagePlus,
    messageMinus: eko.reviews.messageMinus,
    reviewAddRating: eko.reviews.reviewAddRating,
    reviewAddRatingVariant: eko.reviews.reviewAddRatingVariant,
    isReviewAddRequest: eko.reviews.meta.isReviewAddRequest,
  };
};

const mapDispatchToProps = {
  actionReviewAdd,
  actionSelectAddReviewRating,
  actionSelectAddReviewPublicAgree,
  actionSelectAddReviewRatingVariant,
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

  onPressButton = () => {
    const {
      name,
      phone,
      email,
      dealerSelected,
      navigation,
      publicAgree,
      messagePlus,
      messageMinus,
      reviewAddRating,
      actionReviewAdd,
    } = this.props;

    if (!name || !phone || !email) {
      return setTimeout(() => {
        Alert.alert(
          'Недостаточно информации',
          'Для отправки отзыва необходимо заполнить ФИО, номер контактного телефона и email',
          [
            { text: 'Отмена', style: 'cancel' },
            {
              text: 'Заполнить',
              onPress() { navigation.navigate('Profile2Screen'); },
            },
          ],
        );
      }, 100);
    }

    actionReviewAdd({
      dealerId: dealerSelected.id,
      name,
      phone,
      email,
      messagePlus,
      messageMinus,
      publicAgree,
      rating: reviewAddRating,
    }).then(action => {
      if (action.type === REVIEW_ADD__SUCCESS) {
        setTimeout(() => {
          Alert.alert('Ваш отзыв успешно отправлен');
          navigation.navigate('ReviewsScreen');
        }, 100);
      }

      if (action.type === REVIEW_ADD__FAIL) {
        setTimeout(() => Alert.alert('', 'Произошла ошибка, попробуйте снова'), 100);
      }
    });
  }

  renderPublicAgree = () => {
    const { publicAgree, actionSelectAddReviewPublicAgree } = this.props;

    const onPressHandler = () => actionSelectAddReviewPublicAgree(!publicAgree);

    return (
      <View style={[
        styles.publicAgreeContainer,
        stylesList.listItemContainer,
        stylesList.listItemContainerFirst,
      ]}>
        <ListItem onPress={onPressHandler} last style={stylesList.listItem}>
          <Body>
            <Label style={[stylesList.label, styles.publicAgreeText]}>Я разрешаю опубликовать мой отзыв</Label>
          </Body>
          <Right>
            <Switch onValueChange={onPressHandler} style={styles.switch} value={publicAgree} />
          </Right>
        </ListItem>
      </View>
    );
  }

  render() {
    const {
      navigation,
      publicAgree,
      dealerSelected,
      reviewAddRating,
      isReviewAddRequest,
      reviewAddRatingVariant,
      actionSelectAddReviewRating,
      actionSelectAddReviewRatingVariant,
    } = this.props;

    console.log('== ReviewAddRatingStepScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
          <Spinner visible={isReviewAddRequest} color={styleConst.color.blue} />

            <RatingList
              ratingValue={reviewAddRating}
              ratingVariant={reviewAddRatingVariant}
              selectRatingValue={actionSelectAddReviewRating}
              selectRatingVariant={actionSelectAddReviewRatingVariant}
            />
            {this.renderPublicAgree()}
            <InfoLine gap={true} infoIcon={true} text={TEXT_MESSAGE_CONTROL} />
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
