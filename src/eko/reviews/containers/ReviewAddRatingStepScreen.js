import React, {Component} from 'react';
import {
  SafeAreaView,
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
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
import {Label, Switch, Body, ListItem, Right} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';
import Form from '../../../core/components/Form/Form';
import UserData from '../../../utils/user';
import {
  REVIEW_ADD_RATING_5,
  REVIEW_ADD_RATING_4,
  REVIEW_ADD_RATING_3,
  REVIEW_ADD_RATING_2,
  REVIEW_ADD_RATING_1,
} from '../../constants';
import strings from '../../../core/lang/const';

const $size = 40;
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  publicAgreeContainer: {
    marginBottom: 5,
    borderRadius: 5,
  },
  publicAgreeText: {
    fontSize: 14,
    paddingVertical: 5,
  },
  switch: {
    marginTop: 2,
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
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE')
      ? UserData.get('PHONE')
      : UserData.get('PHONE'),
    email: UserData.get('EMAIL')
      ? UserData.get('EMAIL')
      : UserData.get('EMAIL'),
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
    this.FormConfig = {
      fields: {
        groups: [
          {
            name: strings.ReviewAddRatingStepScreen.mainReview,
            fields: [
              {
                name: 'RATING',
                type: 'select',
                label: strings.ReviewAddRatingStepScreen.mainReview2,
                value: '',
                props: {
                  items: [
                    {
                      label: REVIEW_ADD_RATING_5,
                      value: 5,
                      key: 5,
                    },
                    {
                      label: REVIEW_ADD_RATING_4,
                      value: 4,
                      key: 4,
                    },
                    {
                      label: REVIEW_ADD_RATING_3,
                      value: 3,
                      key: 3,
                    },
                    {
                      label: REVIEW_ADD_RATING_2,
                      value: 2,
                      key: 2,
                    },
                    {
                      label: REVIEW_ADD_RATING_1,
                      value: 1,
                      key: 1,
                    },
                  ],
                  required: true,
                  placeholder: {
                    label: strings.ReviewAddRatingStepScreen.addReview,
                    value: null,
                    color: '#9EA0A4',
                  },
                },
              },
            ],
          },
          {
            name: strings.Form.group.contacts,
            fields: [
              {
                name: 'NAME',
                type: 'input',
                label: strings.Form.field.label.name,
                value: this.props.firstName,
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: strings.Form.field.label.secondName,
                value: this.props.secondName,
                props: {
                  textContentType: 'middleName',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: strings.Form.field.label.lastName,
                value: this.props.lastName,
                props: {
                  textContentType: 'familyName',
                },
              },
              {
                name: 'PHONE',
                type: 'phone',
                label: strings.Form.field.label.phone,
                value: this.props.phone,
                props: {
                  required: true,
                },
              },
              {
                name: 'EMAIL',
                type: 'email',
                label: strings.Form.field.label.email,
                value: this.props.email,
              },
            ],
          },
        ],
      },
    };
  }

  static navigationOptions = ({navigation}) => ({
    headerTitle: (
      <Text style={stylesHeader.blueHeaderTitle}>
        {strings.ReviewAddRatingStepScreen.title}
      </Text>
    ),
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: (
      <View>
        <HeaderIconBack theme="white" navigation={navigation} />
      </View>
    ),
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

  onChangeField = (fieldName) => (value) => {
    this.setState({[fieldName]: value});
  };

  onPressButton = (dataFromForm) => {
    const {
      dealerSelected,
      navigation,
      publicAgree,
      messagePlus,
      messageMinus,
      reviewAddRating,
      actionReviewAdd,
    } = this.props;

    const name = [
      dataFromForm.NAME,
      dataFromForm.SECOND_NAME,
      dataFromForm.LAST_NAME,
    ]
      .filter(Boolean)
      .join(' ');

    actionReviewAdd({
      dealerId: dealerSelected.id,
      firstName: get(dataFromForm, 'NAME', ''),
      secondName: get(dataFromForm, 'SECOND_NAME', ''),
      lastName: get(dataFromForm, 'LAST_NAME', ''),
      email: get(dataFromForm, 'EMAIL', ''),
      phone: get(dataFromForm, 'PHONE', ''),
      name: name,
      messagePlus,
      messageMinus,
      publicAgree,
      rating: get(dataFromForm, 'RATING', ''),
    }).then((action) => {
      if (action.type === REVIEW_ADD__SUCCESS) {
        Amplitude.logEvent('order', 'eko/review_add');

        setTimeout(() => {
          Alert.alert(
            strings.ReviewAddRatingStepScreen.Notifications.success.text,
          );
          navigation.navigate('ReviewsScreen');
        }, 100);
      }

      if (action.type === REVIEW_ADD__FAIL) {
        setTimeout(
          () =>
            Alert.alert(
              strings.Notifications.error.title,
              strings.Notifications.error.text,
            ),
          100,
        );
      }
    });
  };

  renderPublicAgree = () => {
    const {publicAgree, actionSelectAddReviewPublicAgree} = this.props;

    const onPressHandler = () => actionSelectAddReviewPublicAgree(!publicAgree);

    return (
      <View style={[styles.publicAgreeContainer, stylesList.listItemContainer]}>
        <ListItem onPress={onPressHandler} style={stylesList.listItem}>
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
    const {isReviewAddRequest} = this.props;

    console.log('== ReviewAddRatingStepScreen ==');

    return (
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={{flex: 1, backgroundColor: '#eee'}}>
            <View
              style={{
                flex: 1,
                paddingTop: 20,
                marginBottom: 160,
                paddingHorizontal: 14,
              }}>
              <Spinner
                visible={isReviewAddRequest}
                color={styleConst.color.blue}
              />
              {this.renderPublicAgree()}
              <Form
                fields={this.FormConfig.fields}
                barStyle={'light-content'}
                onSubmit={this.onPressButton}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddRatingStepScreen);
