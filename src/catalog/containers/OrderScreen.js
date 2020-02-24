/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
} from 'react-native';
import {TextInput} from '../../core/components/TextInput';
import {Button} from 'native-base';
import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
// redux
import {connect} from 'react-redux';
import {actionOrderCar} from '../actions';
import {nameFill, phoneFill, emailFill} from '../../profile/actions';

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import {get} from 'lodash';
import isInternet from '../../utils/internet';
import numberWithGap from '../../utils/number-with-gap';
import showPrice from '@utils/price';
import styleConst from '@core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {CATALOG_ORDER__SUCCESS, CATALOG_ORDER__FAIL} from '../actionTypes';
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
  },
  buttonText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

const mapStateToProps = ({catalog, profile}) => {
  return {
    profile,
    comment: catalog.orderComment,
    isOrderCarRequest: catalog.meta.isOrderCarRequest,
  };
};

const mapDispatchToProps = {
  nameFill,
  phoneFill,
  emailFill,
  actionOrderCar,
};

class OrderScreen extends Component {
  constructor(props) {
    super(props);
    const {
      last_name = '',
      first_name = '',
      phone,
      email,
    } = this.props.profile.login;

    this.state = {
      date: '',
      email: email ? email.value : '',
      phone: phone ? phone.value : '',
      name: `${first_name} ${last_name}`,
      loading: false,
      success: false,
      comment: '',
    };
  }

  static navigationOptions = ({navigation}) => ({
    headerStyle: stylesHeader.blueHeader,
    headerTitleStyle: stylesHeader.blueHeaderTitle,
    headerLeft: (
      <View>
        <HeaderIconBack theme="white" navigation={navigation} />
      </View>
    ),
    headerRight: <View />,
  });

  static propTypes = {
    navigation: PropTypes.object,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    comment: PropTypes.string,
    isOrderCarRequest: PropTypes.bool,
  };

  onPressOrder = async () => {
    this.setState({loading: true});
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {navigation, actionOrderCar, isOrderCarRequest} = this.props;

      // предотвращаем повторную отправку формы
      if (isOrderCarRequest) {
        return;
      }

      const dealerId = get(navigation, 'state.params.dealerId');
      const carId = get(navigation, 'state.params.carId');
      const isNewCar = get(navigation, 'state.params.isNewCar');

      if (!this.state.name || !this.state.phone) {
        return setTimeout(() => {
          Alert.alert(
            'Недостаточно информации',
            'Для заявки на покупку авто необходимо заполнить ФИО и номер контактного телефона',
          );
        }, 100);
      }

      actionOrderCar({
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        dealerId,
        carId,
        comment: this.state.comment,
        isNewCar,
      }).then(action => {
        if (action.type === CATALOG_ORDER__SUCCESS) {
          const car = get(navigation, 'state.params.car');
          const {brand, model} = car;
          const path = isNewCar ? 'newcar' : 'usedcar';

          Amplitude.logEvent('order', `catalog/${path}`, {
            brand_name: brand,
            model_name: get(model, 'name'),
          });

          setTimeout(() => {
            this.setState({success: true, loading: false});
          }, 100);
        }

        if (action.type === CATALOG_ORDER__FAIL) {
          setTimeout(
            () => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'),
            100,
          );
        }
      });
    }
  };

  onChangeField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  render() {
    const {navigation} = this.props;

    const car = get(navigation, 'state.params.car');
    const region = get(navigation, 'state.params.region');
    const {brand, model, price, priceSpecial, complectation} = car;
    const processedPrice = showPrice(price, region);
    const processedPriceSpecial = showPrice(priceSpecial, region);

    return (
      <KeyboardAvoidingView>
        <StatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.heading}>Заявка на покупку</Text>
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
                  <View style={styles.group}>
                    <View style={styles.field}>
                      <TextInput
                        editable={false}
                        style={styles.textinput}
                        label="Марка"
                        value={brand ? brand.toString() : null}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        editable={false}
                        style={styles.textinput}
                        label="Модель"
                        value={model ? model.name.toString() : null}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        editable={false}
                        style={styles.textinput}
                        label="Комплектация"
                        value={complectation ? complectation.toString() : null}
                      />
                    </View>
                    <View style={styles.field}>
                      <TextInput
                        editable={false}
                        style={styles.textinput}
                        label="Цена"
                        value={
                          priceSpecial ? processedPriceSpecial : processedPrice
                        }
                      />
                    </View>
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
                        multiline={true}
                        numberOfLines={2}
                        style={{
                          height: Platform.OS === 'ios' ? 90 : 'auto',
                          borderColor: '#d8d8d8',
                          borderBottomWidth: 1,
                          color: '#222b45',
                          fontSize: 18,
                        }}
                        label="Комментарии"
                        keyboardType="email-address"
                        value={this.state.comment}
                        onChangeText={this.onChangeField('comment')}
                      />
                    </View>
                  </View>
                  <View style={styles.group}>
                    <Button
                      onPress={
                        this.state.loading ? undefined : this.onPressOrder
                      }
                      style={[styleConst.shadow.default, styles.button]}>
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
)(OrderScreen);
