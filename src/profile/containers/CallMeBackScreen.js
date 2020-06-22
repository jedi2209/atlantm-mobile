/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// redux
import {connect} from 'react-redux';
import {get} from 'lodash';
import {callMe} from '../../contacts/actions';
import {localUserDataUpdate} from '../../profile/actions';
import {CALL_ME__SUCCESS, CALL_ME__FAIL} from '../../contacts/actionTypes';
import {StackActions, NavigationActions} from 'react-navigation';
import Amplitude from '@utils/amplitude-analytics';
import {
  Alert,
  View,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';

import isInternet from '@utils/internet';
import {ERROR_NETWORK} from '@core/const';

const mapStateToProps = ({dealer, profile, contacts, service, nav}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    firstName: profile.login.NAME
      ? profile.login.NAME
      : profile.localUserData.NAME
      ? profile.localUserData.NAME
      : '',
    secondName: profile.login.SECOND_NAME
      ? profile.login.SECOND_NAME
      : profile.localUserData.SECOND_NAME
      ? profile.localUserData.SECOND_NAME
      : '',
    phone:
      profile.login.PHONE && profile.login.PHONE.length
        ? profile.login.PHONE[0].VALUE
        : profile.localUserData.PHONE
        ? profile.localUserData.PHONE
        : '',
    profile,
    isСallMeRequest: contacts.isСallMeRequest,
  };
};

const mapDispatchToProps = {
  localUserDataUpdate,
  callMe,
};

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';

class CallMeBackScreen extends React.Component {
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
            name: 'Автоцентр',
            fields: [
              {
                name: 'DEALER',
                type: 'dealerSelect',
                label: 'Автоцентр',
                value: this.props.dealerSelected,
                props: {
                  goBack: true,
                  isLocal: false,
                  navigation: this.props.navigation,
                  returnScreen: this.props.navigation.state.routeName,
                },
              },
            ],
          },
          {
            name: 'Контактные данные',
            fields: [
              {
                name: 'NAME',
                type: 'input',
                label: 'Имя',
                value: this.props.firstName,
                props: {
                  required: true,
                  textContentType: 'name',
                },
              },
              {
                name: 'SECOND_NAME',
                type: 'input',
                label: 'Отчество',
                value: this.props.secondName,
                props: {
                  textContentType: 'name',
                },
              },
              {
                name: 'PHONE',
                type: 'phone',
                label: 'Телефон',
                value: this.props.phone,
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

  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: stylesHeader.whiteHeader,
      headerTitleStyle: stylesHeader.whiteHeaderTitle,
      headerTitle: 'Перезвоните мне',
      headerLeft: (
        <HeaderIconBack
          theme="blue"
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
      headerRight: <View />,
    };
  };

  // componentDidUpdate(prevpProps) {
  //   if (prevpProps.profile.login !== this.props.profile.login) {
  //     const {last_name, first_name, phone} = this.props.profile.login;

  //     if (last_name && first_name) {
  //       this.setState({name: `${first_name} ${last_name}`});
  //     }

  //     if (phone) {
  //       this.setState({phone});
  //     }
  //   }
  // }

  onPressCallMe = async (props) => {
    const isInternetExist = await isInternet();
    let actionID = null;

    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.actionID
    ) {
      actionID = this.props.navigation.state.params.actionID;
    }

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    }

    const name = [props.NAME, props.SECOND_NAME].filter(Boolean).join(' ');

    this.setState({loading: true});

    const dealerID = props.DEALER.id;

    const action = await this.props.callMe({
      dealerID,
      name: name || '',
      actionID,
      phone: get(props, 'PHONE', ''),
    });

    if (action.type === CALL_ME__SUCCESS) {
      const _this = this;
      Amplitude.logEvent('order', 'contacts/callme');
      _this.props.localUserDataUpdate({
        NAME: props.NAME,
        SECOND_NAME: props.SECOND_NAME,
        PHONE: props.PHONE,
      });
      Alert.alert(
        'Ваша заявка успешно отправлена!',
        'Наши менеджеры вскоре свяжутся с Вами. Спасибо!',
        [
          {
            text: 'ОК',
            onPress() {
              const resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: 'BottomTabNavigation',
                  }),
                ],
              });
              _this.props.navigation.dispatch(resetAction);
            },
          },
        ],
      );
      this.setState({success: true, loading: false});
    }

    if (action.type === CALL_ME__FAIL) {
      this.setState({loading: false});
      setTimeout(
        () => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
        100,
      );
    }
  };

  render() {
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
              <Form
                fields={this.FormConfig.fields}
                barStyle={'light-content'}
                SubmitButton={{
                  text: 'Жду звонка',
                }}
                onSubmit={this.onPressCallMe}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CallMeBackScreen);
