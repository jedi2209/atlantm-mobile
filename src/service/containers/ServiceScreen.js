/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import {Button} from 'native-base';
import DatePicker from 'react-native-datepicker';
import {StackActions, NavigationActions} from 'react-navigation';

// redux
import {connect} from 'react-redux';
import {dateFill, orderService} from '../actions';
import {carFill, nameFill, phoneFill, emailFill} from '../../profile/actions';

import DeviceInfo from 'react-native-device-info';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import isInternet from '../../utils/internet';
import {yearMonthDay} from '../../utils/date';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {ERROR_NETWORK} from '../../core/const';
import {SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL} from '../actionTypes';

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
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
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
    backgroundColor: '#0F66B2',
    justifyContent: 'center',
    shadowColor: '#0f66b2',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

const mapStateToProps = ({dealer, profile, service, nav}) => {
  return {
    nav,
    date: service.date,
    car: profile.car,
    name: profile.login ? profile.login.name : '',
    phone: profile.login ? profile.login.phone : '',
    email: profile.login ? profile.login.email : '',
    dealerSelected: dealer.selected,
    profile,
    isOrderServiceRequest: service.meta.isOrderServiceRequest,
  };
};

const mapDispatchToProps = {
  carFill,
  dateFill,
  nameFill,
  phoneFill,
  emailFill,
  orderService,
};

const {width: screenWidth} = Dimensions.get('window');

const datePickerStyles = {
  dateTouchBody: {
    width: screenWidth - 28,
    height: 40,
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
  },
  dateInput: {
    borderWidth: 0,
    alignItems: 'flex-start',
  },
  placeholderText: {
    fontSize: 18,
    color: '#d8d8d8',
  },
  dateText: {
    fontSize: 18,
    color: '#222b45',
  },
  datePicker: {
    borderTopColor: 0,
  },
};

class ServiceScreen extends Component {
  constructor(props) {
    super(props);

    const {
      last_name = '',
      first_name = '',
      phone,
      cars,
      email,
    } = this.props.profile.login;
    const defaultCar = {number: '', brand: '', model: ''};
    const car =
      cars && cars.length > 0 ? cars.find(value => value.owner) : defaultCar;

    this.state = {
      date: '',
      email: email ? email.value : '',
      phone: phone ? phone.value : '',
      car: `${car.brand} ${car.model}`,
      carNumber: car.number,
      name: `${first_name} ${last_name}`,
      loading: false,
      success: false,
    };
  }

  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: stylesHeader.blueHeader,
      headerTitleStyle: stylesHeader.blueHeaderTitle,
      headerLeft: (
        <View>
          <HeaderIconBack
            theme="white"
            navigation={navigation}
            returnScreen={returnScreen}
          />
        </View>
      ),
      headerRight: <View />,
    };
  };

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    carFill: PropTypes.func,
    dateFill: PropTypes.func,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    car: PropTypes.string,
    date: PropTypes.object,
    isOrderServiceRequest: PropTypes.bool,
  };

  onChangeField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  onPressOrder = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
      return;
    }

    // Предотвращаем повторную отправку формы.
    if (this.props.isOrderServiceRequest) {
      return;
    }

    if (
      !this.state.name.trim() ||
      !this.state.phone.trim() ||
      !this.state.car.trim() ||
      !this.state.date
    ) {
      return Alert.alert(
        'Не хватает информации',
        'Для заявки на СТО необходимо заполнить ФИО, номер контактного телефона, название автомобиля и желаемую дату',
      );
    }

    try {
      const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getSystemVersion()}`;
      const orderDate = yearMonthDay(this.state.date);
      const dealerID = this.props.dealerSelected.id;

      this.setState({loading: true});

      const action = await this.props.orderService({
        car: this.state.car,
        date: orderDate,
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        device,
        dealerID,
      });

      if (action.type === SERVICE_ORDER__SUCCESS) {
        Amplitude.logEvent('order', 'service');
        this.setState({success: true, loading: false});
      }

      if (action.type === SERVICE_ORDER__FAIL) {
        setTimeout(
          () => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
          100,
        );
      }
    } catch (error) {}
  };

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'ServiceScreen';

    return isActiveScreen;
  }

  render() {
    const {navigation, dealerSelected} = this.props;

    return (
      <KeyboardAvoidingView>
        <StatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.heading}>Заявка на СТО</Text>
              </View>
              {this.state.success ? (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <View style={styles.group}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                      }}>
                      Заявка успешно отправлена
                    </Text>
                  </View>
                  <View>
                    <Button
                      onPress={() => {
                        const resetAction = StackActions.reset({
                          index: 0,
                          actions: [
                            NavigationActions.navigate({
                              routeName: 'BottomTabNavigation',
                            }),
                          ],
                        });
                        this.props.navigation.dispatch(resetAction);
                      }}
                      style={styles.button}>
                      <Text style={styles.buttonText}>Назад</Text>
                    </Button>
                  </View>
                </View>
              ) : (
                <>
                  <View
                    // Визуально выравниваем относительно остальных компонентов.
                    style={[styles.group, {marginLeft: -14, marginRight: -14}]}>
                    <DealerItemList
                      goBack
                      navigation={navigation}
                      city={dealerSelected.city}
                      name={dealerSelected.name}
                      brands={dealerSelected.brands}
                    />
                  </View>
                  <View style={styles.group}>
                    <DatePicker
                      showIcon={false}
                      mode="date"
                      minDate={new Date()}
                      placeholder="Выберите дату"
                      format="DD MMMM YYYY"
                      confirmBtnText="Выбрать"
                      cancelBtnText="Отмена"
                      customStyles={datePickerStyles}
                      date={this.state.date}
                      onDateChange={(_, date) => {
                        this.onChangeField('date')(date);
                      }}
                    />
                  </View>
                  <View style={styles.group}>
                    <View style={styles.field}>
                      <TextInput
                        autoCorrect={false}
                        style={styles.textinput}
                        label="Имя"
                        value={this.state.name}
                        onChangeText={this.onChangeField('name')}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Телефон"
                        keyboardType="phone-pad"
                        value={this.state.phone}
                        onChangeText={this.onChangeField('phone')}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Email"
                        keyboardType="email-address"
                        value={this.state.email}
                        onChangeText={this.onChangeField('email')}
                      />
                    </View>
                  </View>
                  <View style={styles.group}>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Авто"
                        value={this.state.car}
                        onChangeText={this.onChangeField('car')}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Гос. номер"
                        value={this.state.carNumber}
                        onChangeText={this.onChangeField('carNumber')}
                      />
                    </View>
                  </View>
                  <View style={styles.group}>
                    <Button
                      onPress={
                        this.state.loading ? undefined : this.onPressOrder
                      }
                      style={styles.button}>
                      {this.state.loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Отправить</Text>
                      )}
                    </Button>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceScreen);
