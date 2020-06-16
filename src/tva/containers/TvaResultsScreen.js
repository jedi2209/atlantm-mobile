/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {Container, Content, StyleProvider, Button} from 'native-base';

// redux
import {connect} from 'react-redux';
import {
  actionTvaMessageSend,
  actionTvaMessageFill,
  actionSetActiveTvaOrderId,
} from '../actions';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import ButtonFull from '../../core/components/ButtonFull';
import MessageForm from '../../core/components/MessageForm';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import ListItemHeader from '../../profile/components/ListItemHeader';
import HeaderSubtitle from '../../core/components/HeaderSubtitle';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import Amplitude from '../../utils/amplitude-analytics';
import {get} from 'lodash';
import {dayMonthYearTime} from '../../utils/date';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {
  TVA_SEND_MESSAGE__SUCCESS,
  TVA_SEND_MESSAGE__FAIL,
} from '../actionTypes';
import isInternet from '../../utils/internet';
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
    padding: 8,
    borderRadius: 4,
  },
  groupLabel: {
    marginBottom: 24,
    fontSize: 18,
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

const mapStateToProps = ({dealer, nav, tva}) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    results: tva.results,
    message: tva.message,
    activeOrderId: tva.activeOrderId,
    isMessageSending: tva.meta.isMessageSending,
  };
};

const mapDispatchToProps = {
  actionTvaMessageFill,
  actionTvaMessageSend,
  actionSetActiveTvaOrderId,
};

class TvaResultsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      loading: false,
      success: false,
    };
  }
  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerStyle: stylesHeader.whiteHeader,
      headerTitleStyle: stylesHeader.whiteHeaderTitle,
      headerTitle: 'Информация об авто',
      headerLeft: (
        <HeaderIconBack
          theme="blue"
          navigation={navigation}
          returnScreen={returnScreen}
        />
      ),
      headerRight: <View />,
    };
  };

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    isMessageSending: PropTypes.bool,
    actionTvaMessageFill: PropTypes.func,
    actionTvaMessageSend: PropTypes.func,
    actionSetActiveTvaOrderId: PropTypes.func,
    message: PropTypes.string,
    results: PropTypes.object,
    activeOrderId: PropTypes.string,
  };

  componentDidMount() {
    const {
      results,
      actionTvaMessageFill,
      actionSetActiveTvaOrderId,
    } = this.props;
    const activeTvaOrderId = get(results, 'info.0.id');

    actionTvaMessageFill('');
    actionSetActiveTvaOrderId(activeTvaOrderId);
  }

  onPressMessageButton = async () => {
    this.setState({loading: true});
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {
        dealerSelected,
        activeOrderId,
        isMessageSending,
        actionTvaMessageFill,
        actionTvaMessageSend,
      } = this.props;
      const message = this.state.comment;

      // предотвращаем повторную отправку формы
      if (isMessageSending) {
        return;
      }

      if (!message) {
        this.setState({loading: false});
        setTimeout(() => {
          Alert.alert('Введите текст сообщения');
        }, 100);

        return;
      }

      actionTvaMessageSend({
        text: message,
        id: activeOrderId,
        dealer: dealerSelected.id,
      }).then((action) => {
        this.setState({loading: false});
        const {type, payload} = action;

        if (type === TVA_SEND_MESSAGE__SUCCESS) {
          Amplitude.logEvent('order', 'tva/message');

          setTimeout(() => {
            actionTvaMessageFill('');
            Alert.alert(payload.status);
          }, 100);
        }

        if (type === TVA_SEND_MESSAGE__FAIL) {
          setTimeout(
            () => Alert.alert('', 'Произошла ошибка, попробуйте снова'),
            100,
          );
        }
      });
    }
  };

  onPressOrder = (orderId) => this.props.actionSetActiveTvaOrderId(orderId);

  processDate = (date) => dayMonthYearTime(date);

  onChangeField = (fieldName) => (value) => {
    this.setState({[fieldName]: value});
  };

  render() {
    // Для iPad меню, которое находится вне роутера
    // window.atlantmNavigation = this.props.navigation;

    const {
      message,
      results,
      activeOrderId,
      isMessageSending,
      actionTvaMessageFill,
    } = this.props;

    const {car, info = []} = results;
    const titleCar = `${car.brand} ${car.model}`;
    const titleCarNumber = car.number;
    const textList = [titleCar, titleCarNumber];

    return (
      <KeyboardAvoidingView>
        <StatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.heading}>
                  {`${titleCar} ${titleCarNumber}`}
                </Text>
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
                      Сообщение успешно отправлено
                    </Text>
                  </View>
                  <View>
                    <Button
                      onPress={() =>
                        this.props.navigation.navigate('BottomTabNavigation')
                      }
                      style={[styleConst.shadow.default, styles.button]}>
                      <Text style={styles.buttonText}>Назад</Text>
                    </Button>
                  </View>
                </View>
              ) : (
                <>
                  {info.map((item) => (
                    <>
                      <View
                        style={[
                          styles.group,
                          activeOrderId === item.id && {
                            backgroundColor: '#eef0f3',
                          },
                        ]}>
                        <Text style={styles.groupLabel}>№ {item.id}</Text>
                        <View style={styles.field}>
                          <TextInput
                            editable={false}
                            style={styles.textinput}
                            label="Мастер-приёмщик"
                            value={item.name}
                          />
                        </View>
                        <View style={styles.field}>
                          <TextInput
                            editable={false}
                            style={styles.textinput}
                            label="Время выдачи"
                            value={this.processDate(item.date)}
                          />
                        </View>
                        <View style={styles.field}>
                          <TextInput
                            editable={false}
                            style={styles.textinput}
                            label="Статус"
                            value={item.status}
                          />
                        </View>
                      </View>
                    </>
                  ))}
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
                        label="Сообщение мастеру"
                        value={this.state.comment}
                        onChangeText={this.onChangeField('comment')}
                      />
                    </View>
                  </View>
                  <View style={styles.group}>
                    <Button
                      onPress={
                        this.state.loading
                          ? undefined
                          : this.onPressMessageButton
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
)(TvaResultsScreen);
