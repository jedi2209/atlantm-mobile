/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  TextInput,
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
    width: screenWidth - 48,
    height: 40,
    // paddingHorizontal: 14,
    borderColor: '#D8D8D8',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 2,
    color: '#222B45',
    borderRadius: 0,
  },
  dateInput: {
    paddingLeft: 14,
    // borderColor: 'red',
    borderWidth: 0,
    // borderStyle: 'solid',
    height: 40,
    alignItems: 'flex-start',
  },
  placeholderText: {
    alignSelf: 'flex-start',
    fontSize: 18,
    color: '#D8D8D8',
  },
  dateText: {
    fontSize: 18,
    color: '#222B45',
  },
  datePicker: {
    borderTopColor: 0,
  },
  dateIcon: {
    width: 0,
  },
  btnCancel: {
    padding: 10,
  },
  btnConfirm: {
    padding: 10,
  },
};

class ServiceScreen extends Component {
  constructor(props) {
    super(props);

    const {last_name, first_name, phone} = this.props.profile.login;

    this.state = {
      name: last_name && first_name ? `${first_name} ${last_name}` : '',
      phone: phone || '',
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
      <KeyboardAvoidingView behavior="position">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View
              style={{
                // justifyContent: 'center',
                // alignItems: 'center',
                display: 'flex',
                marginTop: 20,
                marginBottom: 20,
                width: '80%',
                paddingHorizontal: 14,
              }}>
              <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                Заявка на СТО
              </Text>
            </View>
            <View
              style={{
                marginVertical: 10,
                borderColor: 'red',
                borderWidth: 0,
                borderStyle: 'solid',
                width: '80%',
                marginLeft: 5,
              }}>
              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brands}
                goBack={true}
              />
            </View>
            <View
              style={{
                display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center',
              }}>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                  width: '100%',
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                }}
              />
            </View>
            {!this.state.success ? (
              <View
                style={{
                  width: '100%',
                  paddingLeft: 14,
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <DatePicker
                  style={styles.datePicker}
                  showIcon={false}
                  date={date.formatted}
                  mode="date"
                  minDate={new Date()}
                  placeholder="Выберите дату"
                  format="DD MMMM YYYY"
                  confirmBtnText="Выбрать"
                  cancelBtnText="Отмена"
                  customStyles={datePickerStyles}
                  onDateChange={this.onChangeDate}
                />
                <TextInput
                  style={{
                    height: 40,
                    paddingHorizontal: 14,
                    borderColor: '#D8D8D8',
                    borderTopWidth: 0,
                    borderRightWidth: 0,
                    borderLeftWidth: 0,
                    borderBottomWidth: 2,
                    color: '#222B45',
                    width: '90%',
                    borderRadius: 0,
                    fontSize: 18,
                    marginTop: 18,
                  }}
                  value={name}
                  placeholder="Имя"
                  onChangeText={this.onInputName}
                />
                <>
                  <TextInput
                    style={{
                      height: 40,
                      paddingHorizontal: 14,
                      borderColor: '#D8D8D8',
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      borderBottomWidth: 2,
                      color: '#222B45',
                      width: '90%',
                      borderRadius: 0,
                      marginTop: 18,
                      fontSize: 18,
                    }}
                    value={phone}
                    placeholder="Телефон"
                    keyboardType="phone-pad"
                    onChangeText={this.onInputPhone}
                  />
                  <TextInput
                    style={{
                      height: 40,
                      paddingHorizontal: 14,
                      borderColor: '#D8D8D8',
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      borderBottomWidth: 2,
                      color: '#222B45',
                      width: '90%',
                      borderRadius: 0,
                      marginTop: 18,
                      fontSize: 18,
                    }}
                    value={phone}
                    placeholder="Email"
                    onChangeText={this.onInputEmail}
                  />
                  <TextInput
                    style={{
                      height: 40,
                      paddingHorizontal: 14,
                      borderColor: '#D8D8D8',
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      borderBottomWidth: 2,
                      color: '#222B45',
                      width: '90%',
                      borderRadius: 0,
                      marginTop: 18,
                      fontSize: 18,
                    }}
                    value={phone}
                    placeholder="Авто"
                    onChangeText={this.onInputAuto}
                  />
                  <TextInput
                    style={{
                      height: 40,
                      paddingHorizontal: 14,
                      borderColor: '#D8D8D8',
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      borderBottomWidth: 2,
                      color: '#222B45',
                      width: '90%',
                      borderRadius: 0,
                      marginTop: 18,
                      fontSize: 18,
                    }}
                    value={phone}
                    placeholder="Гос. номер"
                    onChangeText={this.onInputNumber}
                  />
                  <Button
                    onPress={this.onPressOrder}
                    disabled={this.state.loading}
                    style={{
                      marginTop: 40,
                      width: '90%',
                      // backgroundColor: '#34BD78',
                      justifyContent: 'center',
                      paddingVertical: 16,
                      paddingHorizontal: 40,
                      shadowColor: '#0F66B2',
                      shadowOpacity: 0.5,
                      shadowRadius: 8,
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                    }}>
                    {this.state.loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text
                        style={{
                          color: '#fff',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                        }}>
                        Отправить
                      </Text>
                    )}
                  </Button>
                </>
              </View>
            ) : (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  Заявка успешно отправлена
                </Text>
                <Button
                  onPress={() =>
                    this.props.navigation.navigate('BottomTabNavigation')
                  }
                  style={{
                    marginTop: 40,
                    width: '90%',
                    justifyContent: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 40,
                    shadowColor: '#0F66B2',
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                  }}>
                  <Text style={{color: '#fff'}}>Назад</Text>
                </Button>
              </View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '20%',
              justifyContent: 'center',
              width: '90%',
            }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'red',
              }}>
              Заявка на СТО
            </Text>
          </View>
          <View>
            <List style={styles.list}>
              <Spinner
                visible={isOrderServiceRequest}
                color={styleConst.color.blue}
              />

              <ListItemHeader text="МОЙ АВТОЦЕНТР" />

              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brands}
                goBack={true}
              />

              <ListItemHeader text="КОНТАКТНАЯ ИНФОРМАЦИЯ" />

              <ProfileForm
                name={name}
                phone={phone}
                email={email}
                nameFill={nameFill}
                phoneFill={phoneFill}
                emailFill={emailFill}
              />

              <View style={styles.serviceForm}>
                <ServiceForm
                  car={car}
                  date={date}
                  carFill={carFill}
                  dateFill={dateFill}
                />
              </View>
            </List>
          </View>
          <FooterButton text="Отправить" onPressButton={this.onPressOrder} />
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceScreen);
