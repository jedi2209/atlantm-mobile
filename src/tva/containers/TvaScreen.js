/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Fab, Icon, useToast} from 'native-base';
import ToastAlert from '../../core/components/ToastAlert';
import {useNavigation} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

// redux
import {connect} from 'react-redux';
import {actionFetchTva, actionSetPushTracking} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

// components
import Form from '../../core/components/Form/Form';
import PushNotifications from '../../core/components/PushNotifications';

// helpers
import {get} from 'lodash';
import {TVA__SUCCESS, TVA__FAIL} from '../actionTypes';
import {strings} from '../../core/lang/const';
import styleConst from '../../core/style-const';
import {BELARUSSIA, ERROR_NETWORK} from '../../core/const';

const mapStateToProps = ({dealer, profile, tva}) => {
  return {
    region: dealer.region,
    isTvaRequest: tva.meta.isRequest,
    pushTracking: tva.pushTracking,
    carNumber: profile.cars.length
      ? profile.cars[0].number
      : profile.localUserData.CARNUMBER
      ? profile.localUserData.CARNUMBER
      : '',
  };
};

const mapDispatchToProps = {
  localUserDataUpdate,
  actionFetchTva,
  actionSetPushTracking,
};

const TvaScreen = props => {
  const {
    region,
    route,
    carNumber,
    actionFetchTva,
    localUserDataUpdate,
    actionSetPushTracking,
  } = props;

  const toast = useToast();
  const navigation = useNavigation();

  const fabEnable = region === BELARUSSIA ? true : false;

  const FormConfig = {
    fields: {
      groups: [
        {
          name: strings.Form.group.car,
          fields: [
            {
              name: 'CARNUMBER',
              type: 'input',
              label: strings.Form.field.label.carNumber,
              value: carNumber,
              props: {
                required: true,
                placeholder: null,
              },
            },
            // {
            //   name: 'PUSHSWITCH',
            //   type: 'switch',
            //   label: 'Отслеживать изменения',
            //   value: PushTracking,
            //   props: {
            //     onValueChange: onPressPushTracking,
            //   },
            // },
          ],
        },
      ],
    },
  };

  useEffect(() => {
    const params = get(route, 'params', {});

    if (params.isPush) {
      _onPressButton(params);
    }
  }, []);

  const _onPressButton = async pushProps => {
    const isInternet = require('../../utils/internet').default;
    const isInternetExist = await isInternet();
    if (!isInternetExist) {
      toast.show({
        title: ERROR_NETWORK,
        status: 'warning',
        duration: 2000,
        id: 'networkError',
      });
      return;
    }
    // const dealerId = pushProps.DEALER.id;
    const carNumber = pushProps.CARNUMBER;

    let pushTracking = false;
    onPressPushTracking(false);

    const action = await actionFetchTva({
      number: carNumber,
      region: props.region,
      // dealer: dealerId,
      pushTracking,
    });

    if (action) {
      switch (action.type) {
        case TVA__SUCCESS:
          const carNumber_find = [
            'о',
            'О',
            'т',
            'Т',
            'е',
            'Е',
            'а',
            'А',
            'н',
            'Н',
            'к',
            'К',
            'м',
            'М',
            'в',
            'В',
            'с',
            'С',
            'х',
            'Х',
            'р',
            'Р',
            'у',
            'У',
            '-',
          ];
          const carNumber_replace = [
            'T',
            'O',
            'T',
            'T',
            'E',
            'E',
            'A',
            'A',
            'H',
            'H',
            'K',
            'K',
            'M',
            'M',
            'B',
            'B',
            'C',
            'C',
            'X',
            'X',
            'P',
            'P',
            'Y',
            'Y',
            '',
          ];

          let carNumberChanged = carNumber.replace(
            new RegExp(
              '(' +
                carNumber_find
                  .map(function (i) {
                    return i.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
                  })
                  .join('|') +
                ')',
              'g',
            ),
            function (s) {
              return carNumber_replace[carNumber_find.indexOf(s)];
            },
          );
          localUserDataUpdate({
            CARNUMBER: carNumberChanged.toUpperCase(),
          });

          if (pushTracking === true) {
            PushNotifications.subscribeToTopic(
              'tva',
              carNumberChanged.toUpperCase(),
            );
          } else {
            PushNotifications.unsubscribeFromTopic('tva');
          }
          navigation.navigateDeprecated('TvaResultsScreen');
          break;
        case TVA__FAIL:
          toast.show({
            render: ({id}) => {
              return (
                <ToastAlert
                  id={id}
                  status="error"
                  duration={3000}
                  description={action.payload.message}
                  title={strings.Notifications.error.title}
                />
              );
            },
          });
          setTimeout(() => {
            if (pushTracking === true) {
              PushNotifications.unsubscribeFromTopic('tva');
              onPressPushTracking(false);
            }
          }, 250);
          break;
      }
    }
  };

  const onPressPushTracking = isPushTracking => {
    if (isPushTracking === true) {
      PushNotifications.subscribeToTopic('tva', '').then(isPushTracking => {
        actionSetPushTracking(isPushTracking);
      });
    } else {
      PushNotifications.unsubscribeFromTopic('tva');
      actionSetPushTracking(isPushTracking);
    }
  };

  return (
    <>
      <Form
        contentContainerStyle={{
          paddingHorizontal: 14,
          marginTop: 20,
        }}
        keyboardAvoidingViewProps={{
          enableAutomaticScroll: false,
        }}
        key="TVAForm"
        fields={FormConfig.fields}
        barStyle={'light-content'}
        SubmitButton={{text: strings.Form.button.send}}
        onSubmit={_onPressButton}
      />
      {fabEnable ? (
        <Fab
          renderInPortal={false}
          size="sm"
          style={{backgroundColor: styleConst.new.blueHeader}}
          mb={8}
          onPress={() =>
            navigation.navigateDeprecated('ChatScreen', {
              prevScreen: carNumber ? 'ТВА -- ' + carNumber : 'ТВА',
            })
          }
          icon={
            <Icon
              size={7}
              as={Ionicons}
              name="chatbox-outline"
              color="warmGray.50"
              _dark={{
                color: 'warmGray.50',
              }}
            />
          }
        />
      ) : null}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TvaScreen);
