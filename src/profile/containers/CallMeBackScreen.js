/* eslint-disable react/no-did-update-set-state */
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
  StyleSheet,
  ScrollView,
  Keyboard,
  Text,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {Button} from 'native-base';
import DeviceInfo from 'react-native-device-info';
import {StackActions, NavigationActions} from 'react-navigation';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';
import styleConst from '../../core/style-const';

import isInternet from '@utils/internet';
import {ERROR_NETWORK} from '@core/const';

import DealerItemList from '../../core/components/DealerItemList';

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

const styles = StyleSheet.create({
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
    backgroundColor: styleConst.color.lightBlue,
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

class CallMeBackScreen extends React.Component {
  constructor(props) {
    super(props);

    const {last_name, first_name, phone} = this.props.profile.login;

    this.state = {
      name: last_name && first_name ? `${first_name} ${last_name}` : '',
      phone: phone ? phone.value : '',
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
        <HeaderIconBack
          theme="white"
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
      headerRight: <View />,
    };
  };

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

  onChangeField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  onPressCallMe = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {callMe, profile, dealerSelected, isСallMeRequest} = this.props;

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
    const {navigation, dealerSelected} = this.props;

    return (
      <KeyboardAvoidingView>
        <StatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.heading}>Обратный звонок</Text>
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
                  </View>
                  <View style={styles.group}>
                    <Button
                      onPress={
                        this.state.loading ? undefined : this.onPressCallMe
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
)(CallMeBackScreen);
