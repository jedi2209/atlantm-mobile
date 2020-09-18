/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';
import {Content} from 'native-base';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import Form from '../../core/components/Form/Form';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
// redux
import {connect} from 'react-redux';
import {actionOrderCreditCar} from '../actions';
import {localUserDataUpdate} from '../../profile/actions';

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import {get} from 'lodash';
import showPrice from '../../utils/price';
import UserData from '../../utils/user';
import isInternet from '../../utils/internet';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {CREDIT_ORDER__SUCCESS, CREDIT_ORDER__FAIL} from '../actionTypes';
import {ERROR_NETWORK} from '../../core/const';

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
  actionOrderCreditCar,
  localUserDataUpdate,
};

class OrderCreditScreen extends Component {
  constructor(props) {
    super(props);
    this.isNewCar = get(this.props.navigation, 'state.params.isNewCar');
    this.orderedCar = get(this.props.navigation, 'state.params.car.ordered');
    let model = '';
    if (this.isNewCar) {
      model = get(this.props.navigation, 'state.params.car.model');
    } else {
      model = get(this.props.navigation, 'state.params.car.model.name');
    }
    this.carName = [
      get(this.props.navigation, 'state.params.car.brand'),
      model,
      get(this.props.navigation, 'state.params.car.complectation'),
      !this.orderedCar
        ? get(this.props.navigation, 'state.params.car.year')
        : null,
      this.orderedCar ? 'или аналог' : null,
    ]
      .filter(Boolean)
      .join(' ');

    this.carPrice = Number(
      get(this.props.navigation, 'state.params.car.price'),
    );
    this.region = get(this.props.navigation, 'state.params.region');

    this.state = {
      date: '',
      comment: '',
      summ: this.carPrice,
    };

    const deviceWidth = Dimensions.get('window').width;
    this.sliderWidth = (deviceWidth / 100) * 80;
    this.priceStep = Math.ceil(this.carPrice / 1000) * 100;

    this.optionsPrice = [];
    let i = 0;
    while (i <= this.carPrice) {
      this.optionsPrice.push(i);
      i = i + this.priceStep;
    }
    this.optionsPrice.push(this.carPrice);
  }

  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.whiteHeader,
    headerTitleStyle: stylesHeader.whiteHeaderTitle,
    headerTitle: 'Заявка на кредит',
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
    const action = await this.props.actionOrderCreditCar({
      firstName: get(data, 'NAME'),
      secondName: get(data, 'SECOND_NAME'),
      lastName: get(data, 'LAST_NAME'),
      email: get(data, 'EMAIL'),
      phone: get(data, 'PHONE'),
      summ:
        this.state.summ ||
        get(data, 'SUMM') ||
        get(navigation, 'state.params.car.price'),
      dealerId,
      carId,
      comment: data.COMMENT || '',
    });
    if (action && action.type) {
      switch (action.type) {
        case CREDIT_ORDER__SUCCESS:
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
            'Ваша заявка успешно отправлена!',
            'Наши менеджеры вскоре свяжутся с Вами. Спасибо!',
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
        case CREDIT_ORDER__FAIL:
          Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова');
          break;
      }
    }
  };

  render() {
    const FormConfig = {
      fields: {
        groups: [
          {
            name: 'Автомобиль',
            fields: [
              {
                name: 'CARNAME',
                type: 'input',
                label: this.isNewCar
                  ? 'Марка, модель и комплектация'
                  : 'Марка, модель и год выпуска',
                value: this.carName,
                props: {
                  editable: false,
                },
              },
              {
                name: 'SUMM',
                type: 'component',
                label: 'Желаемая сумма кредита',
                value: (
                  <View>
                    <MultiSlider
                      values={[this.carPrice]}
                      step={this.priceStep}
                      min={0}
                      max={this.carPrice}
                      sliderLength={this.sliderWidth}
                      optionsArray={this.optionsPrice}
                      onValuesChange={(e) => {
                        this.setState({
                          summ: e[0],
                        });
                      }}
                      trackStyle={{
                        backgroundColor: '#d5d5e0',
                      }}
                      selectedStyle={{
                        backgroundColor: styleConst.color.lightBlue,
                      }}
                      customMarker={() => (
                        <View
                          style={[
                            styleConst.shadow.default,
                            {
                              height: 17,
                              width: 17,
                              borderRadius: 8.5,
                              backgroundColor: styleConst.color.lightBlue,
                            },
                          ]}
                        />
                      )}
                    />
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{color: '#74747A', fontSize: 14}}>
                        {showPrice(0, this.region)}
                      </Text>
                      <Text style={{color: '#74747A', fontSize: 14}}>
                        {showPrice(this.state.summ, this.region)}
                      </Text>
                    </View>
                  </View>
                ),
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
                  textContentType: 'middleName',
                },
              },
              {
                name: 'LAST_NAME',
                type: 'input',
                label: 'Фамилия',
                value: this.props.lastName,
                props: {
                  textContentType: 'familyName',
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
              {
                name: 'EMAIL',
                type: 'email',
                label: 'Email',
                value: this.props.email,
              },
            ],
          },
          {
            name: 'Дополнительно',
            fields: [
              {
                name: 'COMMENT',
                type: 'textarea',
                label: 'Комментарий',
                value: this.props.comment,
                props: {
                  placeholder:
                    'На случай если вам потребуется передать нам больше информации',
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
              fields={FormConfig.fields}
              barStyle={'light-content'}
              SubmitButton={{text: 'Отправить'}}
              onSubmit={this.onPressOrder}
            />
          </Content>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderCreditScreen);
