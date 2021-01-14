/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {Content} from 'native-base';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';
// redux
import {connect} from 'react-redux';
import {actionOrderMyPrice} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import {get} from 'lodash';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {MYPRICE_ORDER__SUCCESS, MYPRICE_ORDER__FAIL} from '../actionTypes';
import {ERROR_NETWORK} from '../../core/const';

import strings from '../../core/lang/const';

const $size = 40;
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
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
    paddingTop: 20,
    paddingHorizontal: 14,
    backgroundColor: '#eee',
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
    backgroundColor: styleConst.color.lightBlue,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

const mapStateToProps = ({dealer, catalog, profile}) => {
  return {
    dealerSelected: dealer.selected,
    firstName: UserData.get('NAME'),
    secondName: UserData.get('SECOND_NAME'),
    lastName: UserData.get('LAST_NAME'),
    phone: UserData.get('PHONE')
      ? UserData.get('PHONE')
      : UserData.get('PHONE'),
    email: UserData.get('EMAIL')
      ? UserData.get('EMAIL')
      : UserData.get('EMAIL'),
    profile,
    comment: catalog.orderComment,
  };
};

const mapDispatchToProps = {
  actionOrderMyPrice,
  localUserDataUpdate,
};

class OrderMyPriceScreen extends Component {
  constructor(props) {
    super(props);
    const isNewCar = get(this.props.navigation, 'state.params.isNewCar');
    const orderedCar = get(this.props.navigation, 'state.params.car.ordered');
    let model = '';
    if (isNewCar) {
      model = get(this.props.navigation, 'state.params.car.model');
    } else {
      model = get(this.props.navigation, 'state.params.car.model.name');
    }
    const carName = [
      get(this.props.navigation, 'state.params.car.brand'),
      model,
      get(this.props.navigation, 'state.params.car.complectation'),
      !orderedCar ? get(this.props.navigation, 'state.params.car.year') : null,
      orderedCar ? 'или аналог' : null,
    ]
      .filter(Boolean)
      .join(' ');

    this.state = {
      date: '',
      comment: '',
    };

    this.FormConfig = {
      fields: {
        groups: [
          {
            name: strings.Form.group.car,
            fields: [
              {
                name: 'CARNAME',
                type: 'input',
                label: isNewCar
                  ? strings.Form.field.carNameComplectation
                  : strings.Form.field.carNameYear,
                value: carName,
                props: {
                  editable: false,
                },
              },
              {
                name: 'SUMM',
                type: 'input',
                label: strings.Form.field.carYourPrice,
                value: '',
                props: {
                  keyboardType: 'number-pad',
                  required: true,
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
          {
            name: strings.Form.group.additional,
            fields: [
              {
                name: 'COMMENT',
                type: 'textarea',
                label: strings.Form.field.label.comment,
                value: this.props.comment,
                props: {
                  placeholder: strings.Form.field.placeholder.comment,
                },
              },
            ],
          },
        ],
      },
    };
  }

  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.whiteHeader,
    headerTitleStyle: stylesHeader.whiteHeaderTitle,
    headerTitle: strings.Form.OrderMyPriceScreen.title,
    headerLeft: <HeaderIconBack theme="blue" navigation={navigation} />,
    headerRight: <View />,
  });

  static propTypes = {
    navigation: PropTypes.object,
    localUserDataUpdate: PropTypes.func,
    firstName: PropTypes.string,
    secondName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    comment: PropTypes.string,
  };

  onPressOrder = async (data) => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    const {navigation} = this.props;

    const dealerId = get(navigation, 'state.params.dealerId');
    const carId = get(navigation, 'state.params.carId');
    const isNewCar = get(navigation, 'state.params.isNewCar');
    const action = await this.props.actionOrderMyPrice({
      firstName: get(data, 'NAME'),
      secondName: get(data, 'SECOND_NAME'),
      lastName: get(data, 'LAST_NAME'),
      email: get(data, 'EMAIL'),
      phone: get(data, 'PHONE'),
      summ: get(data, 'SUMM'),
      dealerId,
      carId,
      comment: data.COMMENT || '',
    });
    if (action && action.type) {
      switch (action.type) {
        case MYPRICE_ORDER__SUCCESS:
          const car = get(navigation, 'state.params.car');
          const {brand, model} = car;
          const path = isNewCar ? 'newcar' : 'usedcar';
          Amplitude.logEvent('order', `catalog/${path}`, {
            brand_name: brand,
            model_name: get(model, 'name'),
          });
          this.props.localUserDataUpdate({
            NAME: get(data, 'NAME'),
            SECOND_NAME: get(data, 'SECOND_NAME'),
            LAST_NAME: get(data, 'LAST_NAME'),
            PHONE: get(data, 'PHONE'),
            EMAIL: get(data, 'EMAIL'),
          });
          Alert.alert(
            strings.Notifications.success.title,
            strings.Notifications.success.textOrder,
            [
              {
                text: 'ОК',
                onPress() {
                  navigation.goBack();
                },
              },
            ],
          );
          break;
        case MYPRICE_ORDER__FAIL:
          Alert.alert(
            strings.Notifications.error.title,
            strings.Notifications.error.text,
          );
          break;
      }
    }
  };

  render() {
    return (
      <KeyboardAvoidingView onPress={Keyboard.dismiss}>
        <TouchableWithoutFeedback
          style={{flex: 1, backgroundColor: '#eee'}}
          onPress={Keyboard.dismiss}>
          <Content
            style={styles.container}
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps={
              Platform.OS === 'android' ? 'always' : 'never'
            }>
            <Form
              fields={this.FormConfig.fields}
              barStyle={'light-content'}
              SubmitButton={{text: strings.Form.button.send}}
              onSubmit={this.onPressOrder}
            />
          </Content>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderMyPriceScreen);
