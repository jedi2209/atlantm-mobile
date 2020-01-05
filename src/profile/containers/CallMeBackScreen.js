/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// redux
import {connect} from 'react-redux';
import {callMe} from '../../contacts/actions';
import {CALL_ME__SUCCESS, CALL_ME__FAIL} from '../../contacts/actionTypes';
import Amplitude from '@utils/amplitude-analytics';
import {
  Alert,
  View,
  TextInput,
  ScrollView,
  Keyboard,
  Text,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {StyleProvider, Icon, Button} from 'native-base';
import DeviceInfo from 'react-native-device-info';

import isInternet from '@utils/internet';
import {ERROR_NETWORK} from '@core/const';

const mapStateToProps = ({dealer, profile, contacts, nav, info}) => {
  return {
    list: info.list,
    nav,
    profile,
    dealerSelected: dealer.selected,
    isСallMeRequest: contacts.isСallMeRequest,
  };
};
const mapDispatchToProps = {callMe};

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import stylesHeader from '../../core/components/Header/style';

class CallMeBackScreen extends React.Component {
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

  componentDidUpdate(prevpProps) {
    if (prevpProps.profile.login !== this.props.profile.login) {
      const {last_name, first_name, phone} = this.props.profile.login;

      if (last_name && first_name) {
        this.setState({name: `${first_name} ${last_name}`});
      }

      if (phone) {
        this.setState({phone});
      }
    }
  }

  onInputName = text => {
    this.setState({name: text});
  };

  onInputPhone = text => {
    this.setState({phone: text});
  };

  onPressCallMe = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {
        callMe,
        profile,
        navigation,
        dealerSelected,
        isСallMeRequest,
      } = this.props;

      // предотвращаем повторную отправку формы
      if (isСallMeRequest) {
        return;
      }

      const {email} = profile.login;
      const dealerID = dealerSelected.id;
      const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getSystemVersion()}`;
      const name = this.state.name;
      const phone = this.state.phone;

      if (name.length === 0 || phone.length === 0) {
        Alert.alert('Поле Имя и Номер телефона обязательные');
        return;
      }

      this.setState({loading: true});
      callMe({
        name,
        email: email || '', // апи не терпит undefined
        phone,
        device,
        dealerID,
      }).then(action => {
        if (action.type === CALL_ME__SUCCESS) {
          Amplitude.logEvent('order', 'contacts/callme');
          this.setState({success: true});
        }

        if (action.type === CALL_ME__FAIL) {
          this.setState({loading: false});
          setTimeout(
            () => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
            100,
          );
        }
      });
    }
  };

  render() {
    const {name, phone} = this.state;

    return (
      <KeyboardAvoidingView behavior="position">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '20%',
                justifyContent: 'center',
                width: '90%',
              }}>
              <Text
                style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>
                Обратный звонок
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
            {!this.state.success ? (
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}>
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
                  <Button
                    onPress={this.onPressCallMe}
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
                  onPress={() => this.props.navigation.navigate('Home')}
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallMeBackScreen);
