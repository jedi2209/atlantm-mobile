import React, {useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import {ScrollView, View, Checkbox, useToast} from 'native-base';
import {Controller, useForm, useWatch} from 'react-hook-form';
import {SubmitButton} from '../../../core/components/Form/SubmitCustom';
import {
  AgreementCheckbox,
  GroupForm,
  InputCustom,
} from '../../../core/components/Form/InputCustom';
import {KeyboardAvoidingView} from '../../../core/components/KeyboardAvoidingView';

// redux
import {connect} from 'react-redux';
import {REVIEW_ADD__SUCCESS, REVIEW_ADD__FAIL} from '../../actionTypes';
import {
  actionReviewAdd,
  actionSelectAddReviewRating,
  actionSelectAddReviewRatingVariant,
} from '../../actions';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get, isNil} from 'lodash';

import isInternet from '../../../utils/internet';
import UserData from '../../../utils/user';
import {
  REVIEW_ADD_RATING_5,
  REVIEW_ADD_RATING_4,
  REVIEW_ADD_RATING_3,
  REVIEW_ADD_RATING_2,
  REVIEW_ADD_RATING_1,
} from '../../constants';
import {strings} from '../../../core/lang/const';
import {ERROR_NETWORK} from '../../../core/const';

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

const isAndroid = Platform.OS === 'android';

const ReviewAddRatingStepScreen = props => {
  const [publicAgree, setPublicAgree] = useState(true);
  const [sendingForm, setSendingForm] = useState(false);
  const [sendingFormStatus, setFormSendingStatus] = useState(null);

  const toast = useToast();

  const reviewData = props.route?.params;

  useEffect(() => {
    console.info('== ReviewAddRatingStepScreen ==');
  }, []);

  const {
    control,
    handleSubmit,
    formState: {errors, isValidating, isValid},
  } = useForm({
    defaultValues: {
      NAME: get(props, 'firstName'),
      SECOND_NAME: get(props, 'secondName'),
      LAST_NAME: get(props, 'lastName'),
      EMAIL: get(props, 'email'),
      PHONE: get(props, 'phone'),
      approvePublication: true,
    },
    mode: 'onBlur',
  });

  const onPressSubmit = async dataFromForm => {
    const {navigation} = props;

    setSendingForm(true);

    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

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

        setFormSendingStatus(true);
        setTimeout(() => {
          setFormSendingStatus(null);
          setSendingForm(false);
          setTimeout(() => navigation.goBack(), 300);
        }, 500);

        // setTimeout(() => {
        //   Alert.alert(
        //     strings.ReviewAddRatingStepScreen.Notifications.success.text,
        //   );
        //   navigation.navigate('ReviewsScreen');
        // }, 100);
      }

      if (action.type === REVIEW_ADD__FAIL) {
        setFormSendingStatus(false);
        setTimeout(() => {
          setFormSendingStatus(null);
          setSendingForm(false);
        }, 500);

        // setTimeout(
        //   () =>
        //     Alert.alert(
        //       strings.Notifications.error.title,
        //       strings.Notifications.error.text,
        //     ),
        //   100,
        // );
      }
    });
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
    <ScrollView paddingX={4}>
      <KeyboardAvoidingView behavior={'padding'} enabled={!isAndroid}>
        <GroupForm title={strings.Form.group.contacts}>
            <Controller
              control={control}
              rules={{
                minLength: {
                  value: 3,
                  message: [
                    strings.Form.status.fieldRequired1,
                    strings.Form.status.fieldRequired2,
                  ].join(' '),
                },
              }}
              name="NAME"
              render={({field: {onChange, onBlur, value}}) => (
                <InputCustom
                  placeholder={strings.Form.field.label.name}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  textContentType={'name'}
                  value={value}
                  isValid={isNil(get(errors, 'NAME'))}
                />
              )}
            />

            <Controller
              control={control}
              name="SECOND_NAME"
              render={({field: {onChange, onBlur, value}}) => (
                <InputCustom
                  placeholder={strings.Form.field.label.secondName}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  textContentType={'middleName'}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="LAST_NAME"
              render={({field: {onChange, onBlur, value}}) => (
                <InputCustom
                  placeholder={strings.Form.field.label.lastName}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  textContentType={'familyName'}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              rules={{
                minLength: {
                  value: 12,
                  message: [
                    strings.Form.status.fieldRequired1,
                    strings.Form.status.fieldRequired2,
                  ].join(' '),
                },
              }}
              name="PHONE"
              render={({field: {onChange, onBlur, value}}) => (
                <InputCustom
                  type="phone"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  isValid={isNil(get(errors, 'PHONE'))}
                />
              )}
            />

            <Controller
              control={control}
              name="EMAIL"
              render={({field: {onChange, onBlur, value}}) => (
                <InputCustom
                  type="email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </GroupForm>
          <GroupForm title={strings.Form.group.additional}>
            <Controller
              control={control}
              name="approvePublication"
              render={({field: {onChange, onBlur, value}}) => (
                <InputCustom
                  aria-label={strings.ReviewAddRatingStepScreen.approve}
                  key="inputApprovePublication"
                  type="checkbox"
                  defaultIsChecked={true}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  isValid={isNil(get(errors, 'agreementCheckbox'))}
                />
              )}
            />
          </GroupForm>
          <Controller
            control={control}
            rules={{
              required: [
                strings.Form.status.fieldRequired1,
                strings.Form.status.fieldRequired2,
              ].join(' '),
            }}
            name="agreementCheckbox"
            render={({field: {onChange, onBlur, value}}) => (
              <AgreementCheckbox
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                isValid={isNil(get(errors, 'agreementCheckbox'))}
              />
            )}
          />
          <SubmitButton
            title={strings.Form.button.send}
            onPress={handleSubmit(onPressSubmit)}
            sendingStatus={sendingFormStatus}
            sending={sendingForm}>
          </SubmitButton>
        {/* <Form
          contentContainerStyle={{
            paddingHorizontal: 14,
            marginTop: 20,
          }}
          key="ReviewAddRatingForm"
          fields={FormConfig.fields}
          barStyle={'light-content'}
          SubmitButton={{text: strings.Form.button.send}}
          onSubmit={_onPressButton}
        /> */}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddRatingStepScreen);
