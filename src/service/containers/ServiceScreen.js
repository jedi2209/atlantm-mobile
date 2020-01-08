/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  // TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {List, StyleProvider, Button} from 'native-base';
import DatePicker from 'react-native-datepicker';

// redux
import {connect} from 'react-redux';
import {dateFill, orderService} from '../actions';
import {carFill, nameFill, phoneFill, emailFill} from '../../profile/actions';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import ServiceForm from '../../service/components/ServiceForm';
import FooterButton from '../../core/components/FooterButton';
import ProfileForm from '../../profile/components/ProfileForm';
import ListItemHeader from '../../profile/components/ListItemHeader';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import isInternet from '../../utils/internet';
import {yearMonthDay} from '../../utils/date';
import getTheme from '../../../native-base-theme/components';
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
    height: 40,
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
    color: '#222b45',
    fontSize: 18,
  },
  button: {
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
      last_name,
      first_name,
      phone,
      cars,
      email,
    } = this.props.profile.login;
    const car = cars
      ? cars.filter(value => {
          if (value.owner) {
            return value;
          }
        })
      : [{number: '', brand: '', model: ''}];

    this.state = {
      firstName: first_name || '',
      lastName: last_name || '',
      email: email ? phone.value : '',
      phone: phone ? phone.value : '',
      car: `${car[0].brand} ${car[0].model}`,
      carNumber: car[0].number,
      name: last_name && first_name ? `${first_name} ${last_name}` : '',
      loading: false,
      success: false,
    };
  }

  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: (
      <View>
        <HeaderIconBack
          theme="white"
          navigation={navigation}
          returnScreen="BottomTabNavigation"
        />
      </View>
    ),
    headerRight: <View />,
  });

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

  onPressOrder = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {
        car,
        date,
        name,
        phone,
        email,
        orderService,
        dealerSelected,
        isOrderServiceRequest,
      } = this.props;

      // предотвращаем повторную отправку формы
      if (isOrderServiceRequest) {
        return;
      }

      const dealerID = dealerSelected.id;

      console.log(
        car,
        date,
        name,
        phone,
        email,
        orderService,
        dealerSelected,
        isOrderServiceRequest,
      );
      if (!name || !phone || !car || !date || !date.date) {
        return Alert.alert(
          'Не хватает информации',
          'Для заявки на СТО необходимо заполнить ФИО, номер контактного телефона, название автомобиля и желаемую дату',
        );
      }

      const orderDate = yearMonthDay(date.date);
      const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getSystemVersion()}`;

      orderService({
        car,
        date: orderDate,
        name,
        email,
        phone,
        device,
        dealerID,
      }).then(action => {
        if (action.type === SERVICE_ORDER__SUCCESS) {
          Amplitude.logEvent('order', 'service');

          setTimeout(() => Alert.alert('Ваша заявка успешно отправлена'), 100);
        }

        if (action.type === SERVICE_ORDER__FAIL) {
          setTimeout(
            () => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
            100,
          );
        }
      });
    }
  };

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'ServiceScreen';

    return isActiveScreen;
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      car,
      date,
      name,
      phone,
      email,
      carFill,
      dateFill,
      nameFill,
      emailFill,
      phoneFill,
      navigation,
      dealerSelected,
      isOrderServiceRequest,
    } = this.props;

    console.log('== Service ==');

    return (
      <KeyboardAvoidingView>
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
                        textAlign: 'center',
                      }}>
                      Заявка успешно отправлена
                    </Text>
                  </View>
                  <View>
                    <Button
                      onPress={() =>
                        this.props.navigation.navigate('BottomTabNavigation')
                      }
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
                      // date={date.formatted}
                      // onDateChange={this.onChangeDate}
                    />
                  </View>
                  <View style={styles.group}>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Имя"
                        value={this.state.name}
                        // onChangeText={this.onInputName}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Телефон"
                        keyboardType="phone-pad"
                        value={this.state.phone}
                        // onChangeText={this.onInputPhone}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Email"
                        keyboardType="email-address"
                        value={this.state.email}
                        // onChangeText={this.onInputEmail}
                      />
                    </View>
                  </View>
                  <View style={styles.group}>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Авто"
                        value={this.state.car}
                        // onChangeText={this.onInputAuto}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Гос. номер"
                        value={this.state.carNumber}
                        // onChangeText={this.onInputAuto}
                      />
                    </View>
                  </View>
                  <View style={styles.group}>
                    <Button onPress={this.onPressSave} style={styles.button}>
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
