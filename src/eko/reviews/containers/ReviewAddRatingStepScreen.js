import React, {useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import {ScrollView} from 'native-base';
import {Snackbar, Portal} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import StarRating from 'react-native-star-rating-widget';
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
} from '../../actions';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get, isNil} from 'lodash';

import isInternet from '../../../utils/internet';
import UserData from '../../../utils/user';
import {strings} from '../../../core/lang/const';
import {ERROR_NETWORK} from '../../../core/const';
import styleConst from '../../../core/style-const';

const mapStateToProps = ({dealer, eko, nav, profile}) => {
  return {
    nav,
    login: profile.login,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE')
      ? UserData.get('PHONE')
      : UserData.get('PHONE'),
    email: UserData.get('EMAIL')
      ? UserData.get('EMAIL')
      : UserData.get('EMAIL'),
    isReviewAddRequest: eko.reviews.meta.isReviewAddRequest,
  };
};

const mapDispatchToProps = {
  actionReviewAdd,
};

const isAndroid = Platform.OS === 'android';

const ReviewAddRatingStepScreen = props => {
  const [sendingForm, setSendingForm] = useState(false);
  const [sendingFormStatus, setSendingFormStatus] = useState(null);
  const [portalSnackbarVisible, setPortalSnackbarVisible] = useState(false);
  const [errorText, setErrorText] = useState('');

  const {actionReviewAdd, navigation} = props;
  const reviewData = get(props, 'route.params');

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
      GRADE: 5,
      approvePublication: true,
    },
    mode: 'onBlur',
  });

  const onPressSubmit = async dataFromForm => {
    setSendingForm(true);

    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setSendingForm(false);
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
      publicAgree: get(dataFromForm, 'approvePublication'),
      rating: get(dataFromForm, 'GRADE', ''),
    };

    return actionReviewAdd(dataToSend).then(action => {
      if (get(action, 'type') === REVIEW_ADD__SUCCESS) {
        Analytics.logEvent('order', 'eko/review_add');
        setSendingFormStatus(true);
        setTimeout(() => {
          navigation.navigate('ReviewsScreenMain');
        }, 500);
      }

      if (get(action, 'type') === REVIEW_ADD__FAIL) {
        setSendingFormStatus(false);
        setErrorText(get(action, 'payload.error'));
        setPortalSnackbarVisible(true);
        setTimeout(() => {
          setSendingFormStatus(null);
          setSendingForm(false);
        }, 2500);
      }
    });
  };

  return (
    <ScrollView paddingX={4} paddingTop={4}>
      <KeyboardAvoidingView behavior={'padding'} enabled={!isAndroid}>
        <GroupForm title={strings.ReviewAddRatingStepScreen.mainReview}>
          <Controller
            control={control}
            name="GRADE"
            render={({field: {onChange, onBlur, value}}) => (
              <StarRating
                color={styleConst.color.blue}
                enableHalfStar={false}
                rating={value}
                maxStars={5}
                onBlur={onBlur}
                onChange={onChange}
                style={{marginVertical: 8, marginBottom: 16}}
              />
            )}
          />
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
                isValid={isNil(get(errors, 'approvePublication'))}
              />
            )}
          />
        </GroupForm>
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
          sending={sendingForm}
        />
      </KeyboardAvoidingView>
      <Portal>
        <Snackbar
          visible={portalSnackbarVisible}
          onDismiss={() => {
            setPortalSnackbarVisible(false);
            setErrorText('');
          }}
          duration={2000}
          action={{
            label: strings.ModalView.close,
          }}>
          {errorText}
        </Snackbar>
      </Portal>
    </ScrollView>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewAddRatingStepScreen);
