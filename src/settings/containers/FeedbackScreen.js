/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Platform,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {
  ScrollView,
  Text,
} from 'native-base';
import DeviceInfo from 'react-native-device-info';
import {
  GroupForm,
  InputCustom,
} from '../../core/components/Form/InputCustom';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {SubmitButton} from '../../core/components/Form/SubmitCustom';

// redux
import {connect} from 'react-redux';
import {actionSetPushActionSubscribe, actionAppRated} from '../../core/actions';

// components
import TransitionView from '../../core/components/TransitionView';

// helpers
import API from '../../utils/api';
import Analytics from '../../utils/amplitude-analytics';
import isInternet from '../../utils/internet';
import UserData from '../../utils/user';
import styleConst from '../../core/style-const';
import {ERROR_NETWORK} from '../../core/const';
import {strings} from '../../core/lang/const';
import {get, isNil} from 'lodash';

const isAndroid = Platform.OS === 'android';

const mapStateToProps = ({profile}) => {
  return {
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    email: UserData.get('EMAIL'),
    profile,
  };
};

const mapDispatchToProps = {
  actionSetPushActionSubscribe,
  actionAppRated,
};

const FeedbackScreen = props => {
  const [sendingForm, setSendingForm] = useState(false);
  const [sendingFormStatus, setFormSendingStatus] = useState(null);

  const {
    actionAppRated,
    navigation,
    profile,
  } = props;

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
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    Analytics.logEvent('screen', 'settings');
  }, []);

  const onPressOrder = async data => {

    setSendingForm(true);

    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    const dataToSend = {
      firstName: get(data, 'NAME', ''),
      email: get(data, 'EMAIL', ''),
      text: get(data, 'COMMENT', ''),
      additional: {
        ip: await DeviceInfo.getIpAddress(),
        device: {
          id: DeviceInfo.getDeviceId(),
          brand: DeviceInfo.getBrand(),
          model: DeviceInfo.getModel(),
        },
        system: {
          name: DeviceInfo.getSystemName(),
          version: DeviceInfo.getSystemVersion(),
        },
        app: {
          version: DeviceInfo.getVersion(),
          build: DeviceInfo.getBuildNumber(),
          firstInstall: await DeviceInfo.getFirstInstallTime(),
          lastUpdateTime: await DeviceInfo.getLastUpdateTime(),
        },
        user: {
          id: get(profile, 'login.ID'),
          sap: get(profile, 'login.SAP.ID'),
        },
      },
    };

    const action = await API.orderFeedbackApp(dataToSend);

    // if (get(action, 'status') === 'success') {}

    setFormSendingStatus(true);
    setTimeout(() => {
      setFormSendingStatus(null);
      setSendingForm(false);
      setTimeout(() => navigation.goBack(), 300);
    }, 500);
    return true;
  };

  return (
    <ScrollView style={styleConst.safearea.default} paddingX={4}>
      <KeyboardAvoidingView behavior={'padding'} enabled={!isAndroid}>
        <Text selectable={false} style={[styleConst.text.bigHead, {fontSize: 24}]}>
          {strings.RateThisApp.titleBad}
        </Text>
        <TransitionView
          animation={styleConst.animation.zoomIn}
          duration={250}
          index={3}>
          <GroupForm title={strings.Form.group.contacts2}>
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
            </GroupForm>
            <GroupForm title={strings.Form.group.emailFeedback}>
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
        </TransitionView>
        <TransitionView
          animation={styleConst.animation.zoomIn}
          duration={250}
          index={4}>
          <GroupForm title={strings.Form.group.textFeedback}>
            <Controller
                control={control}
                key="additional"
                name="COMMENT"
                render={({field: {onChange, onBlur, value}}) => (
                  <InputCustom
                    placeholder={strings.RateThisApp.textBad}
                    key="inputComments"
                    type="textarea"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
            />
          </GroupForm>
        </TransitionView>
        <TransitionView
          animation={styleConst.animation.zoomIn}
          duration={250}
          index={5}>
          <SubmitButton
            title={strings.Form.button.send}
            onPress={handleSubmit(onPressOrder)}
            sendingStatus={sendingFormStatus}
            sending={sendingForm}>
          </SubmitButton>
        </TransitionView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackScreen);
