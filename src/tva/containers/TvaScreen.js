/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Toast} from 'native-base';

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

const mapStateToProps = ({dealer, profile, tva, nav, core}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    dealerSelectedLocal: dealer.selectedLocal,
    isTvaRequest: tva.meta.isRequest,
    pushGranted: core.pushGranted,
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

class TvaScreen extends Component {
  static propTypes = {
    dealerSelected: PropTypes.object,
    isTvaRequest: PropTypes.bool,
    actionFetchTva: PropTypes.func,
    pushTracking: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      success: false,
    };

    this.FormConfig = {
      fields: {
        groups: [
          {
            name: strings.Form.group.dealer,
            fields: [
              {
                name: 'DEALER',
                type: 'dealerSelect',
                label: strings.Form.field.label.dealer,
                value:
                  this.props.dealerSelectedLocal &&
                  this.props.dealerSelectedLocal.id
                    ? this.props.dealerSelectedLocal
                    : this.props.dealerSelected,
                props: {
                  goBack: false,
                  isLocal: true,
                  returnScreen: this.props.navigation.state?.routeName,
                },
              },
            ],
          },
          {
            name: strings.Form.group.car,
            fields: [
              {
                name: 'CARNUMBER',
                type: 'input',
                label: strings.Form.field.label.carNumber,
                value: this.props.carNumber,
                props: {
                  required: true,
                  placeholder: null,
                },
              },
              // {
              //   name: 'PUSHSWITCH',
              //   type: 'switch',
              //   label: 'Отслеживать изменения',
              //   value: this.props.PushTracking,
              //   props: {
              //     onValueChange: this.onPressPushTracking,
              //   },
              // },
            ],
          },
        ],
      },
    };
  }

  componentDidMount() {
    const {navigation, route} = this.props;
    const params = get(route, 'params', {});

    if (params.isPush) {
      this.onPressButton(params);
    }
  }

  onPressButton = async pushProps => {
    this.setState({loading: true});

    const dealerId = pushProps.DEALER.id;
    const carNumber = pushProps.CARNUMBER;

    let pushTracking = false;
    this.onPressPushTracking(false);

    const action = await this.props.actionFetchTva({
      number: carNumber,
      region: pushProps.DEALER.region,
      dealer: dealerId,
      pushTracking,
    });

    this.setState({loading: false});
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
          this.props.localUserDataUpdate({
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
          this.props.navigation.navigate('TvaResultsScreen');
          break;
        case TVA__FAIL:
          Toast.show({
            text: action.payload.message,
            position: 'bottom',
            type: 'danger',
            duration: 3000,
          });
          setTimeout(() => {
            if (pushTracking === true) {
              PushNotifications.unsubscribeFromTopic('tva');
              this.onPressPushTracking(false);
            }
          }, 250);
          break;
      }
    }
  };

  onPressPushTracking = isPushTracking => {
    const {actionSetPushTracking} = this.props;
    if (isPushTracking === true) {
      PushNotifications.subscribeToTopic('tva', '').then(isPushTracking => {
        actionSetPushTracking(isPushTracking);
      });
    } else {
      PushNotifications.unsubscribeFromTopic('tva');
      actionSetPushTracking(isPushTracking);
    }
  };

  render() {
    return (
      <Form
        contentContainerStyle={{
          paddingHorizontal: 14,
          marginTop: 20,
        }}
        keyboardAvoidingViewProps={{
          enableAutomaticScroll: false,
        }}
        key='TVAForm'
        fields={this.FormConfig.fields}
        barStyle={'light-content'}
        SubmitButton={{text: strings.Form.button.send}}
        onSubmit={this.onPressButton}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TvaScreen);
