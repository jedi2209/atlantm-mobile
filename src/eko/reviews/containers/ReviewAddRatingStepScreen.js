import React, {Component} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Platform,
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

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';

import Form from '../../../core/components/Form/Form';
import UserData from '../../../utils/user';
import {
  REVIEW_ADD_RATING_5,
  REVIEW_ADD_RATING_4,
  REVIEW_ADD_RATING_3,
  REVIEW_ADD_RATING_2,
  REVIEW_ADD_RATING_1,
} from '../../constants';
import {strings} from '../../../core/lang/const';

const $size = 40;
const styles = StyleSheet.create({
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
    backgroundColor: styleConst.color.white,
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
    color: styleConst.color.white,
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
    this.reviewData = props.route?.params;
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
                props: {
                  required: true,
                },
              },
            ],
          },
        ],
      },
    };
  }

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

  onPressButton = dataFromForm => {
    const {dealerSelected, navigation, publicAgree} = this.props;

    const name = [
      dataFromForm.NAME,
      dataFromForm.SECOND_NAME,
      dataFromForm.LAST_NAME,
    ]
      .filter(Boolean)
      .join(' ');

    return this.props
      .actionReviewAdd({
        dealerId: dealerSelected.id,
        firstName: get(dataFromForm, 'NAME', ''),
        secondName: get(dataFromForm, 'SECOND_NAME', ''),
        lastName: get(dataFromForm, 'LAST_NAME', ''),
        email: get(dataFromForm, 'EMAIL', ''),
        phone: get(dataFromForm, 'PHONE', ''),
        name: name,
        messagePlus: get(this.reviewData, 'COMMENT_PLUS', null),
        messageMinus: get(this.reviewData, 'COMMENT_MINUS', null),
        publicAgree,
        rating: get(dataFromForm, 'RATING', ''),
      })
      .then(action => {
        if (action.type === REVIEW_ADD__SUCCESS) {
          Analytics.logEvent('order', 'eko/review_add');

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
              {strings.ReviewAddRatingStepScreen.approve}
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
    console.info('== ReviewAddRatingStepScreen ==');

    return (
      <View style={{marginTop: 10, flex: 1}}>
        {this.renderPublicAgree()}
        <Form
          contentContainerStyle={{
            paddingHorizontal: 14,
            marginTop: 20,
          }}
          key='ReviewAddRatingForm'
          fields={this.FormConfig.fields}
          barStyle={'light-content'}
          SubmitButton={{text: strings.Form.button.send}}
          onSubmit={this.onPressButton}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddRatingStepScreen);
