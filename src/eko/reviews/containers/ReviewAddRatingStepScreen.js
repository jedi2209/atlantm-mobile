import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';

// redux
import {connect} from 'react-redux';
import {REVIEW_ADD__SUCCESS, REVIEW_ADD__FAIL} from '../../actionTypes';
import {
  actionReviewAdd,
  actionSelectAddReviewRating,
  actionSelectAddReviewRatingVariant,
} from '../../actions';

// components
import {Checkbox, View} from 'native-base';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get} from 'lodash';

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
import styleConst from '../../../core/style-const';

const mapStateToProps = ({dealer, eko, nav, profile}) => {
  return {
    nav,
    login: profile.login,
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
  actionSelectAddReviewRatingVariant,
};

const ReviewAddRatingStepScreen = props => {
  const [publicAgree, setPublicAgree] = useState(true);

  const reviewData = props.route?.params;

  useEffect(() => {
    console.info('== ReviewAddRatingStepScreen ==');
  }, []);

  const _onPressButton = dataFromForm => {
    const {navigation} = props;

    const name = [
      dataFromForm.NAME,
      dataFromForm.SECOND_NAME,
      dataFromForm.LAST_NAME,
    ]
      .filter(Boolean)
      .join(' ');

    const dataToSend = {
      dealerId: get(reviewData, 'DEALER.id'),
      firstName: get(dataFromForm, 'NAME', ''),
      secondName: get(dataFromForm, 'SECOND_NAME', ''),
      lastName: get(dataFromForm, 'LAST_NAME', ''),
      email: get(dataFromForm, 'EMAIL', ''),
      phone: get(dataFromForm, 'PHONE', ''),
      name: name,
      messagePlus: get(reviewData, 'COMMENT_PLUS', null),
      messageMinus: get(reviewData, 'COMMENT_MINUS', null),
      publicAgree,
      rating: get(dataFromForm, 'RATING', ''),
    };

    return props.actionReviewAdd(dataToSend).then(action => {
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

  const _renderPublicAgree = isChecked => {
    return (
      <View py={5} backgroundColor={styleConst.color.white} px={3}>
        <Checkbox
          aria-label={strings.ReviewAddRatingStepScreen.approve}
          isChecked={isChecked}
          onChange={() => setPublicAgree(!isChecked)}>
          {strings.ReviewAddRatingStepScreen.approve}
        </Checkbox>
      </View>
    );
  };

  const FormConfig = {
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
              value: props.firstName,
              props: {
                required: true,
                textContentType: 'name',
              },
            },
            {
              name: 'SECOND_NAME',
              type: 'input',
              label: strings.Form.field.label.secondName,
              value: props.secondName,
              props: {
                textContentType: 'middleName',
              },
            },
            {
              name: 'LAST_NAME',
              type: 'input',
              label: strings.Form.field.label.lastName,
              value: props.lastName,
              props: {
                textContentType: 'familyName',
              },
            },
            {
              name: 'PHONE',
              type: 'phone',
              label: strings.Form.field.label.phone,
              value: props.phone,
              props: {
                required: true,
              },
            },
            {
              name: 'EMAIL',
              type: 'email',
              label: strings.Form.field.label.email,
              value: props.email,
              props: {
                required: true,
              },
            },
          ],
        },
      ],
    },
  };

  return (
    <View style={{marginTop: 10, flex: 1}}>
      {_renderPublicAgree(publicAgree)}
      <Form
        contentContainerStyle={{
          paddingHorizontal: 14,
          marginTop: 20,
        }}
        key="ReviewAddRatingForm"
        fields={FormConfig.fields}
        barStyle={'light-content'}
        SubmitButton={{text: strings.Form.button.send}}
        onSubmit={_onPressButton}
      />
    </View>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddRatingStepScreen);
