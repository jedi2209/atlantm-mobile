import React, {Component} from 'react';
import {
  SafeAreaView,
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';

// redux
import {connect} from 'react-redux';
import {REVIEW_ADD__SUCCESS, REVIEW_ADD__FAIL} from '../../actionTypes';
import {
  actionReviewAdd,
  actionSelectAddReviewRating,
  actionSelectAddReviewPublicAgree,
  actionSelectAddReviewRatingVariant,
} from '../../actions';

// styles
import stylesList from '../../../core/components/Lists/style';

// components
import {
  Label,
  Content,
  StyleProvider,
  Switch,
  Body,
  ListItem,
  Right,
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import InfoLine from '../../components/InfoLine';
import RatingList from '../../components/RatingList';
import FooterButton from '../../../core/components/FooterButton';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

import {TextInput} from '../../../core/components/TextInput';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';

const $size = 40;
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  publicAgreeContainer: {
    marginTop: 25,
    marginBottom: 5,
  },
  publicAgreeText: {
    fontSize: 16,
  },
  list: {
    paddingBottom: $size,
  },
  serviceForm: {
    marginTop: $size,
  },
  // Скопировано из ProfileSettingsScreen.
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 36,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 18,
  },
  group: {
    marginBottom: 36,
  },
  textinput: {
    height: Platform.OS === 'ios' ? 40 : 'auto',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0F66B2',
    justifyContent: 'center',
    shadowColor: '#0f66b2',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

const mapStateToProps = ({dealer, eko, nav, profile}) => {
  return {
    nav,
    login: profile.login,
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
  constructor(props) {
    super(props);

    const {last_name = '', first_name = '', phone, email} = this.props.login;

    this.state = {
      email: email ? email.value : '',
      phone: phone ? phone.value : '',
      name: `${first_name} ${last_name}`,
    };
  }

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
          'ReviewAddRatingStepScreen';
      }
    }

    return isActiveScreen;
  }

  onChangeField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

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

    if (
      !this.state.name.trim() ||
      !this.state.phone.trim() ||
      !this.state.email.trim()
    ) {
      return Alert.alert(
        'Не хватает информации',
        'Для заявки на СТО необходимо заполнить ФИО, номер контактного телефона, название автомобиля и желаемую дату',
      );
    }

    actionReviewAdd({
      dealerId: dealerSelected.id,
      name: this.state.name,
      phone: this.state.phone,
      email: this.state.email,
      messagePlus,
      messageMinus,
      publicAgree,
      rating: reviewAddRating,
    }).then(action => {
      if (action.type === REVIEW_ADD__SUCCESS) {
        Amplitude.logEvent('order', 'eko/review_add');

        setTimeout(() => {
          Alert.alert('Ваш отзыв успешно отправлен');
          navigation.navigate('ReviewsScreen');
        }, 100);
      }

      if (action.type === REVIEW_ADD__FAIL) {
        setTimeout(
          () => Alert.alert('', 'Произошла ошибка, попробуйте снова'),
          100,
        );
      }
    });
  };

  renderPublicAgree = () => {
    const {publicAgree, actionSelectAddReviewPublicAgree} = this.props;

    const onPressHandler = () => actionSelectAddReviewPublicAgree(!publicAgree);

    return (
      <View
        style={[
          styles.publicAgreeContainer,
          stylesList.listItemContainer,
          stylesList.listItemContainerFirst,
        ]}>
        <ListItem onPress={onPressHandler} last style={stylesList.listItem}>
          <Body>
            <Label style={[stylesList.label, styles.publicAgreeText]}>
              Я разрешаю опубликовать мой отзыв
            </Label>
          </Body>
          <Right>
            <Switch
              onValueChange={onPressHandler}
              style={styles.switch}
              value={publicAgree}
            />
          </Right>
        </ListItem>
      </View>
    );
  };

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
        <SafeAreaView style={styles.safearea}>
          <Content>
            <Spinner
              visible={isReviewAddRequest}
              color={styleConst.color.blue}
            />

            <RatingList
              ratingValue={reviewAddRating}
              ratingVariant={reviewAddRatingVariant}
              selectRatingValue={actionSelectAddReviewRating}
              selectRatingVariant={actionSelectAddReviewRatingVariant}
            />
            {this.renderPublicAgree()}
          </Content>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <View style={styles.container}>
                <View style={styles.group}>
                  <View style={styles.field}>
                    <TextInput
                      autoCorrect={false}
                      style={styles.textinput}
                      label="Имя"
                      value={this.state.name}
                      onChangeText={this.onChangeField('name')}
                    />
                  </View>
                  <View style={styles.field}>
                    <TextInput
                      style={styles.textinput}
                      label="Телефон"
                      keyboardType="phone-pad"
                      value={this.state.phone}
                      onChangeText={this.onChangeField('phone')}
                    />
                  </View>
                  <View style={styles.field}>
                    <TextInput
                      style={styles.textinput}
                      label="Email"
                      keyboardType="email-address"
                      value={this.state.email}
                      onChangeText={this.onChangeField('email')}
                    />
                  </View>
                </View>
              </View>
            </>
          </TouchableWithoutFeedback>
          <FooterButton text="Отправить" onPressButton={this.onPressButton} />
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddRatingStepScreen);
