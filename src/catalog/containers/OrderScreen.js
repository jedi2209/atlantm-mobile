/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Alert, Platform} from 'react-native';
import Form from '../../core/components/Form/Form';
// redux
import {connect} from 'react-redux';
import {actionOrderCar} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

// helpers
import Analytics from '../../utils/amplitude-analytics';
import {get} from 'lodash';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import styleConst from '../../core/style-const';
import {CATALOG_ORDER__SUCCESS, CATALOG_ORDER__FAIL} from '../actionTypes';
import {ERROR_NETWORK} from '../../core/const';

import {strings} from '../../core/lang/const';

const $size = 40;
const styles = StyleSheet.create({
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

const mapStateToProps = ({dealer, profile}) => {
  return {
    dealerSelectedLocal: dealer.selectedLocal,
    dealerSelected: dealer.selected,
    listBelarussia: dealer.listBelarussia,
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
  };
};

const mapDispatchToProps = {
  actionOrderCar,
  localUserDataUpdate,
};

class OrderScreen extends Component {
  constructor(props) {
    super(props);
    const isNewCar = get(props.route, 'params.isNewCar');
    const orderedCar = get(props.route, 'params.car.ordered');
    let model = '';
    if (isNewCar) {
      model = get(props.route, 'params.car.model');
    } else {
      model = get(props.route, 'params.car.model.name');
    }

    let carName = null;

    if (get(props.route, 'params.car')) {
      carName = [
        get(props.route, 'params.car.brand'),
        model,
        get(props.route, 'params.car.complectation'),
        !orderedCar ? get(props.route, 'params.car.year') : null,
        orderedCar ? 'или аналог' : null,
      ]
        .filter(Boolean)
        .join(' ');
    }

    const dealer = get(props.route, 'params.car.dealer');
    let listDealers = [];
    if (dealer) {
      if (dealer.length) {
        dealer.map(el => {
          listDealers.push({
            label: el.name,
            value: el.id,
            key: el.id,
          });
        });
      } else {
        if (typeof dealer == 'object') {
          listDealers.push({
            label: dealer.name,
            value: dealer.id,
            key: dealer.id,
          });
        }
      }
    }

    // const region = get(this.props.route, 'params.region');

    // let dealersList = null;
    // let dealersSelect = [];

    // if (listAll) {
    //   switch (region) {
    //     case 'by':
    //       dealersList = this.props.listBelarussia;
    //       break;
    //     case 'ru':
    //       dealersList = this.props.listRussia;
    //       break;
    //     case 'ua':
    //       dealersList = this.props.listUkraine;
    //       break;
    //   }
    //   if (dealersList) {
    //     dealersList.map((el) => {
    //     });
    //   }
    // } else {
    //   dealersSelect.push({
    //   });
    // }

    this.FormConfig = {
      fields: {
        groups: [
          {
            name: listDealers.length
              ? strings.Form.group.dealerCar
              : strings.Form.group.car,
            fields: [
              listDealers.length > 1
                ? {
                    name: 'DEALER',
                    type: 'select',
                    label: strings.Form.field.label.dealer,
                    value: null,
                    props: {
                      items: listDealers,
                      required: true,
                      placeholder: {
                        label: strings.Form.field.placeholder.dealer,
                        value: null,
                        color: '#9EA0A4',
                      },
                    },
                  }
                : {
                    name: 'DEALERNAME',
                    type: 'input',
                    label: strings.Form.field.label.dealer,
                    value:
                      listDealers[0] && listDealers[0].label
                        ? listDealers[0].label
                        : null,
                    props: {
                      editable: false,
                      placeholder: strings.Form.field.placeholder.dealer,
                    },
                  },
              carName
                ? {
                    name: 'CARNAME',
                    type: 'input',
                    label: isNewCar
                      ? strings.Form.field.label.carNameComplectation
                      : strings.Form.field.label.carNameYear,
                    value: carName,
                    props: {
                      editable: false,
                    },
                  }
                : {},
              isNewCar
                ? {
                    name: 'TRADEIN',
                    type: 'checkbox',
                    label: strings.Form.field.label.tradeinWant,
                    value: false,
                  }
                : {},
              isNewCar
                ? {
                    name: 'CREDIT',
                    type: 'checkbox',
                    label: strings.Form.field.label.creditWant,
                    value: false,
                  }
                : {},
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

  static propTypes = {
    localUserDataUpdate: PropTypes.func,
    firstName: PropTypes.string,
    secondName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    comment: PropTypes.string,
  };

  // shouldComponentUpdate(nextProps) {
  //   if (!this.props.dealerSelectedLocal) {
  //     return false;
  //   } else {
  //     if (
  //       this.props.dealerSelectedLocal &&
  //       this.props.dealerSelectedLocal.id &&
  //       nextProps.dealerSelectedLocal
  //     ) {
  //       return (
  //         this.props.dealerSelectedLocal.id !== nextProps.dealerSelectedLocal.id
  //       );
  //     }
  //   }
  //   return false;
  // }

  onPressOrder = async data => {
    const isInternetExist = await isInternet();
    const nav = this.props.navigation;

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    let dealerId = 0;
    const localDealer = get(data, 'DEALER', null);
    if (localDealer) {
      dealerId = localDealer;
    } else {
      dealerId = get(this.props.route, 'params.car.dealer[0].id', null);
      if (!dealerId) {
        dealerId = get(this.props.route, 'params.car.dealer.id', null);
      }
    }
    const carId = get(this.props.route, 'params.carId');
    const isNewCar = get(this.props.route, 'params.isNewCar');

    const action = await this.props.actionOrderCar({
      firstName: get(data, 'NAME'),
      secondName: get(data, 'SECOND_NAME'),
      lastName: get(data, 'LAST_NAME'),
      email: get(data, 'EMAIL'),
      phone: get(data, 'PHONE'),
      tradeIn: get(data, 'TRADEIN', false),
      credit: get(data, 'CREDIT', false),
      dealerId,
      carId,
      comment: data.COMMENT || '',
      isNewCar,
    });

    if (action && action.type) {
      switch (action.type) {
        case CATALOG_ORDER__SUCCESS:
          const car = get(this.props.route, 'params.car');
          const {brand, model} = car;
          const path = isNewCar ? 'newcar' : 'usedcar';
          Analytics.logEvent('order', `catalog/${path}`, {
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
        case CATALOG_ORDER__FAIL:
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
      <Form
        contentContainerStyle={{
          paddingHorizontal: 14,
          marginTop: 20,
        }}
        key="OrderScreenForm"
        testID="OrderScreen.Form"
        fields={this.FormConfig.fields}
        barStyle={'light-content'}
        SubmitButton={{text: strings.Form.button.send}}
        onSubmit={this.onPressOrder}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);
