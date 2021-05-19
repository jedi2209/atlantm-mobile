/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import {Content} from 'native-base';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';
// redux
import {connect} from 'react-redux';
import {
  actionOrderTestDrive,
  actionOrderTestDriveLead,
  actionFetchTestDriveCarDetails,
} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import {get, orderBy} from 'lodash';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import styleConst from '../../core/style-const';
import {
  TD_CAR_DETAILS__SUCCESS,
  TD_CAR_DETAILS__FAIL,
  TESTDRIVE_ORDER__SUCCESS,
  TESTDRIVE_ORDER__FAIL,
  TESTDRIVE_LEAD__SUCCESS,
  TESTDRIVE_LEAD__FAIL,
} from '../actionTypes';
import {ERROR_NETWORK} from '../../core/const';

// import API from '../../utils/api';
import {yearMonthDay, addDays, dayMonthYear} from '../../utils/date';

import {strings} from '../../core/lang/const';

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
    color: styleConst.color.white,
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
    tdCars: catalog.newCar.carDetails.tdcars,
  };
};

const mapDispatchToProps = {
  actionOrderTestDrive,
  actionOrderTestDriveLead,
  localUserDataUpdate,
  actionFetchTestDriveCarDetails,
};

class TestDriveScreen extends PureComponent {
  constructor(props) {
    super(props);
    const orderedCar = get(props.route, 'params.car.ordered');
    let model = '';
    this.carName = [
      get(props.route, 'params.car.brand'),
      model,
      get(props.route, 'params.car.complectation'),
      !orderedCar ? get(props.route, 'params.car.year') : null,
      orderedCar ? 'или аналог' : null,
    ]
      .filter(Boolean)
      .join(' ');

    const dealer = get(props.route, 'params.car.dealer');
    this.listAll = [];
    if (dealer && dealer.length > 1) {
      dealer.map((el) => {
        this.listAll.push({
          label: el.name,
          value: el.id,
          key: el.id,
        });
      });
    } else {
      this.listAll.push({
        label: dealer.name,
        value: dealer.id,
        key: dealer.id,
      });
    }

    this.state = {
      date: null,
      testDriveCar: get(props.route, 'params.carId'),
      TDCarsList: null,
      comment: '',
      dealerID: null,
      timeFetch: false,
      carFetch: false,
      isLead: true,
    };

    if (this.listAll.length === 1) {
      this.state.dealerID = this.listAll[0].value;
    }
  }

  static propTypes = {
    localUserDataUpdate: PropTypes.func,
    firstName: PropTypes.string,
    secondName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    comment: PropTypes.string,
  };

  componentDidMount() {
    // if (this.state.dealerID) {
    //   this.fetchTDCars(this.state.dealerID);
    // }
  }

  onPressOrder = async (data) => {
    const isInternetExist = await isInternet();
    const nav = this.props.navigation;

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    const carID = this.state.testDriveCar;
    const dealerID = get(data, 'DEALER')
      ? get(data, 'DEALER')
      : this.state.dealerID;
    const isNewCar = get(this.props.route, 'params.isNewCar');
    const time = get(data, 'DATETIME.time');
    // console.log('onPressOrder', this.state, carID, dealerID, data);
    // return true;
    if (!this.state.isLead) {
      // делаем online-запись
      const action = await this.props.actionOrderTestDrive({
        firstName: get(data, 'NAME'),
        secondName: get(data, 'SECOND_NAME'),
        lastName: get(data, 'LAST_NAME'),
        email: get(data, 'EMAIL'),
        phone: get(data, 'PHONE'),
        dealerID,
        carID,
        time,
        comment: data.COMMENT || '',
        isNewCar,
      });
      if (action && action.type) {
        switch (action.type) {
          case TESTDRIVE_ORDER__SUCCESS: // отправляем online-запись на ТД
            const car = get(this.props.route, 'params.car');
            const {brand, model} = car;
            const path = isNewCar ? 'newcar' : 'usedcar';
            Analytics.logEvent('order', `testdrive/${path}`, {
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
                  onPress: () => {
                    nav.goBack();
                  },
                },
              ],
            );
            break;
          case TESTDRIVE_ORDER__FAIL: // online-запись не сработала, конвертируем в ЛИД
            const actionLead = await this.props.actionOrderTestDriveLead({
              firstName: get(data, 'NAME'),
              secondName: get(data, 'SECOND_NAME'),
              lastName: get(data, 'LAST_NAME'),
              email: get(data, 'EMAIL'),
              phone: get(data, 'PHONE'),
              dealerID,
              carID,
              comment: data.COMMENT || '',
              isNewCar,
            });
            if (actionLead && actionLead.type) {
              switch (actionLead.type) {
                case TESTDRIVE_LEAD__SUCCESS:
                  const car = get(this.props.route, 'params.car');
                  const {brand, model} = car;
                  const path = isNewCar ? 'newcar' : 'usedcar';
                  Analytics.logEvent('order', `testdrive/${path}`, {
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
                        onPress: () => {
                          nav.goBack();
                        },
                      },
                    ],
                  );
                  break;
                case TESTDRIVE_LEAD__FAIL:
                  Alert.alert(
                    strings.Notifications.error.title,
                    strings.Notifications.error.text,
                  );
                  break;
              }
            }
            break;
        }
      }
    } else {
      // делаем просто ЛИД
      let date = get(data, 'DATE');
      if (date) {
        date = yearMonthDay(date);
      }
      const actionLead = await this.props.actionOrderTestDriveLead({
        firstName: get(data, 'NAME'),
        secondName: get(data, 'SECOND_NAME'),
        lastName: get(data, 'LAST_NAME'),
        email: get(data, 'EMAIL'),
        phone: get(data, 'PHONE'),
        date: date,
        dealerID,
        carID,
        comment: data.COMMENT || '',
        isNewCar,
      });
      if (actionLead && actionLead.type) {
        switch (actionLead.type) {
          case TESTDRIVE_LEAD__SUCCESS:
            const car = get(this.props.route, 'params.car');
            const {brand, model} = car;
            const path = isNewCar ? 'newcar' : 'usedcar';
            Analytics.logEvent('order', `testdrive/${path}`, {
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
                  onPress: () => {
                    nav.goBack();
                  },
                },
              ],
            );
            break;
          case TESTDRIVE_LEAD__FAIL:
            Alert.alert(
              strings.Notifications.error.title,
              strings.Notifications.error.text,
            );
            break;
        }
      }
    }
  };

  onDealerChoose(value) {
    this.setState(
      {
        dealerID: value,
        date: null,
        // testDriveCar: '',
        TDCarsList: null,
        timeFetch: false,
        isLead: true,
      },
      () => {
        return true;
        // console.log('onDealerChoose', this.state, value);
        // if (!isNaN(value)) {
        //   this.fetchTDCars(value);
        // }
      },
    );
  }

  fetchTDCars = async (dealerID) => {
    this.setState({carFetch: true});
    const tdcarsTmp = get(this.props.route, 'params.testDriveCars');
    let tdCarsApi = [];
    if (typeof tdcarsTmp !== 'undefined') {
      tdcarsTmp.map((el) => {
        tdCarsApi.push(el.id);
      });

      const carsAwait = await this.props.actionFetchTestDriveCarDetails(
        dealerID,
        tdCarsApi,
      );

      if (carsAwait && carsAwait.type) {
        switch (carsAwait.type) {
          case TD_CAR_DETAILS__SUCCESS:
            let tdCarsArr = [];
            if (!carsAwait.payload.model) {
              Object.values(carsAwait.payload).map((el) => {
                return tdCarsArr.push({
                  label: el.name,
                  value: el.id,
                  key: el.id,
                });
              });
            } else {
              tdCarsArr.push({
                label: carsAwait.payload.name,
                value: carsAwait.payload.id,
                key: carsAwait.payload.id,
              });
            }
            if (tdCarsArr.length > 0) {
              tdCarsArr = orderBy(tdCarsArr, ['label'], ['desc']);
              this.setState({
                dealerID: dealerID,
                TDCarsList: tdCarsArr,
                carFetch: false,
                isLead: false,
              });
              if (tdCarsArr.length === 1) {
                this.onCarChoose(tdCarsArr[0]);
              }
            } else {
              this.setState({
                TDCarsList: null,
                carFetch: false,
                isLead: true,
              });
            }
            return tdCarsArr;
        }
      }
    } else {
      this.setState({
        TDCarsList: null,
        carFetch: false,
        isLead: true,
      });
    }
  };

  onCarChoose(value) {
    this.setState({
      testDriveCar: value,
      date: null,
    });
  }

  render() {
    let carblock = {
      name: 'CAR',
      type: 'select',
      label: strings.Form.field.car,
      value: this.state.testDriveCar,
      props: {
        items: this.state.TDCarsList,
        placeholder: {
          label: strings.Form.field.placeholder.carTestDrive,
          value: null,
          color: '#9EA0A4',
        },
        onChange: this.onCarChoose.bind(this),
        focusNextInput: false,
        required: true,
      },
    };
    let datetime = {
      name: 'DATETIME',
      type: 'dateTime',
      label: strings.Form.field.label.date,
      value: this.state.date || null,
      props: {
        placeholder:
          strings.Form.field.placeholder.date + dayMonthYear(addDays(2)),
        required: true,
        type: 'testDrive',
        minimumDate: new Date(addDays(2)),
        maximumDate: new Date(addDays(62)),
        dealer: {
          id: this.state.dealerID,
        },
        carID: this.state.testDriveCar,
      },
    };
    let date = {
      name: 'DATE',
      type: 'date',
      label: strings.Form.field.label.date,
      value: this.state.date || null,
      props: {
        placeholder:
          strings.Form.field.placeholder.date + dayMonthYear(addDays(2)),
        required: true,
        minimumDate: new Date(addDays(2)),
        maximumDate: new Date(addDays(62)),
      },
    };

    this.FormConfig = {
      fields: {
        groups: [
          {
            name:
              this.listAll.length > 1
                ? strings.Form.group.dealerCar
                : strings.Form.group.car,
            fields: [
              this.listAll.length > 1
                ? {
                    name: 'DEALER',
                    type: 'select',
                    label: strings.Form.field.label.dealer,
                    value: this.state.dealerID,
                    props: {
                      items: this.listAll,
                      required: true,
                      onChange: this.onDealerChoose.bind(this),
                      placeholder: {
                        label: strings.Form.field.placeholder.dealer,
                        value: null,
                        color: '#9EA0A4',
                      },
                    },
                  }
                : {},
              this.state.dealerID || true
                ? !this.state.carFetch
                  ? this.state.TDCarsList && this.state.TDCarsList.length
                    ? carblock
                    : {
                        name: 'CARLOAD',
                        type: 'input',
                        label: strings.Form.field.label.carTestDrive,
                        value: this.carName,
                        props: {
                          required: false,
                          editable: false,
                        },
                      }
                  : {
                      name: 'CARLOAD',
                      type: 'component',
                      label: strings.Form.field.label.car,
                      value: (
                        <>
                          <ActivityIndicator
                            color={styleConst.color.blue}
                            style={[styleConst.spinner, {height: 39}]}
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#ababab',
                              textAlign: 'center',
                            }}>
                            {strings.Form.status.carTestDriveSearch}
                          </Text>
                        </>
                      ),
                    }
                : {},
              !this.state.isLead
                ? this.state.dealerID &&
                  this.state.TDCarsList &&
                  this.state.TDCarsList.length &&
                  this.state.testDriveCar
                  ? datetime
                  : {}
                : date,
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

export default connect(mapStateToProps, mapDispatchToProps)(TestDriveScreen);
