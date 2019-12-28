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

  static navigationOptions = () => ({
    header: null,
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
          <ImageBackground
            source={require('./bg.jpg')}
            style={{width: '100%', height: '100%'}}>
            <ScrollView>
              <View
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: 100,
                  justifyContent: 'center',
                }}>
                <Image
                  resizeMode="contain"
                  source={require('../../menu/assets/logo-horizontal-white.svg')}
                />
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
                    width: '80%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                />
              </View>
              {!this.state.success ? (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    style={{
                      height: 40,
                      paddingHorizontal: 14,
                      borderColor: 'gray',
                      borderWidth: 1,
                      color: '#fff',
                      width: '80%',
                      borderRadius: 5,
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
                        borderColor: 'gray',
                        borderWidth: 1,
                        color: '#fff',
                        width: '80%',
                        borderRadius: 5,
                        marginTop: 15,
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
                        marginTop: 20,
                        width: '80%',
                        backgroundColor: '#34BD78',
                        justifyContent: 'center',
                      }}>
                      {this.state.loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={{color: '#fff'}}>Отправить</Text>
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
                    style={{color: '#fff', fontSize: 22, fontWeight: '600'}}>
                    Заявка успешно отправлена
                  </Text>
                  <Button
                    onPress={() => this.props.navigation.navigate('Home')}
                    style={{
                      marginTop: 20,
                      width: '80%',
                      backgroundColor: '#34BD78',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: '#fff'}}>Назад</Text>
                  </Button>
                </View>
              )}
            </ScrollView>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallMeBackScreen);
