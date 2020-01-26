/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  Alert,
  StyleSheet,
  Platform,
  Linking,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  // TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  Button,
  Body,
  Right,
  Label,
  Item,
  Input,
  Switch,
  Content,
  ListItem,
  StyleProvider,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionFetchTva, actionSetPushTracking} from '../actions';
import {carNumberFill} from '../../profile/actions';
//import { actionSetPushGranted } from '../../core/actions';

import {KeyboardAvoidingView} from '../../core/components/KeyboardAvoidingView';
import {TextInput} from '../../core/components/TextInput';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import ListItemHeader from '../../profile/components/ListItemHeader';
import DealerItemList from '../../core/components/DealerItemList';
import FooterButton from '../../core/components/FooterButton';
import PushNotifications from '../../core/components/PushNotifications';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {TVA__SUCCESS, TVA__FAIL} from '../actionTypes';

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

const mapStateToProps = ({dealer, nav, tva, profile, core}) => {
  return {
    nav,
    carNumber: profile.carNumber,
    pushTracking: tva.pushTracking,
    isTvaRequest: tva.meta.isRequest,
    dealerSelected: dealer.selected,
    //    fcmToken: core.fcmToken,
    pushGranted: core.pushGranted,
  };
};

const mapDispatchToProps = {
  carNumberFill,
  actionFetchTva,
  actionSetPushTracking,
  //  actionSetFCMToken,
  //  actionSetPushGranted,
};

class TvaScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carNumber: '',
      loading: false,
      success: false,
    };
  }
  static navigationOptions = ({navigation}) => {
    const returnScreen =
      (navigation.state.params && navigation.state.params.returnScreen) ||
      'BottomTabNavigation';
    console.log('returnScreen ========>', returnScreen);

    return {
      // Табло выдачи авто
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
    isTvaRequest: PropTypes.bool,
    actionFetchTva: PropTypes.func,
    carNumberFill: PropTypes.func,
    carNumber: PropTypes.string,
    pushTracking: PropTypes.bool,
  };

  componentDidMount() {
    const {navigation} = this.props;
    const params = get(navigation, 'state.params', {});

    if (params.isPush) {
      this.onPressButton(params);
    }
  }

  onChangeField = fieldName => value => {
    this.setState({[fieldName]: value});
  };

  onPressButton = pushProps => {
    this.setState({loading: true});
    let {navigation, pushTracking, dealerSelected, actionFetchTva} = this.props;
    let {carNumber} = this.state;
    let dealerId = dealerSelected.id;

    if (pushProps) {
      carNumber = pushProps.carNumber;
      dealerId = pushProps.dealerId;
      pushTracking = false;
      this.onPressPushTracking(false);
    }

    if (!carNumber && !pushProps) {
      this.setState({loading: false});
      return setTimeout(() => {
        Alert.alert(
          'Недостаточно информации',
          'Необходимо заполнить гос. номер автомобиля',
        );
      }, 100);
    }

    actionFetchTva({
      number: carNumber,
      dealer: dealerId,
      region: pushProps ? null : dealerSelected.region,
      pushTracking,
    }).then(action => {
      this.setState({loading: false});
      switch (action.type) {
        case TVA__SUCCESS:
          setTimeout(() => {
            if (pushTracking === true) {
              const carNumber_find = [
                'о',
                'О',
                'т',
                'Т',
                'е',
                'Е',
                'а',
                'А',
                'н',
                'Н',
                'к',
                'К',
                'м',
                'М',
                'в',
                'В',
                'с',
                'С',
                'х',
                'Х',
                'р',
                'Р',
                'у',
                'У',
                '-',
              ];
              const carNumber_replace = [
                'T',
                'O',
                'T',
                'T',
                'E',
                'E',
                'A',
                'A',
                'H',
                'H',
                'K',
                'K',
                'M',
                'M',
                'B',
                'B',
                'C',
                'C',
                'X',
                'X',
                'P',
                'P',
                'Y',
                'Y',
                '',
              ];

              let carNumberChanged = carNumber.replace(
                new RegExp(
                  '(' +
                    carNumber_find
                      .map(function(i) {
                        return i.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
                      })
                      .join('|') +
                    ')',
                  'g',
                ),
                function(s) {
                  return carNumber_replace[carNumber_find.indexOf(s)];
                },
              );
              PushNotifications.subscribeToTopic(
                'tva',
                carNumberChanged.toUpperCase(),
              );
            } else {
              PushNotifications.unsubscribeFromTopic('tva');
            }
            navigation.navigate('TvaResultsScreen');
          }, 250);
          break;
        case TVA__FAIL:
          setTimeout(() => {
            if (pushTracking === true) {
              PushNotifications.unsubscribeFromTopic('tva');
              this.onPressPushTracking(false);
            }
            Alert.alert(
              '',
              `${
                action.payload.message
              }. Возможно вы указали неправильный номер или автоцентр`,
            );
          }, 250);
          break;
      }
    });
  };

  onPressPushTracking = isPushTracking => {
    const {actionSetPushTracking} = this.props;
    const {carNumber} = this.state;
    if (isPushTracking === true) {
      PushNotifications.subscribeToTopic('tva', carNumber).then(
        isPushTracking => {
          actionSetPushTracking(isPushTracking);
        },
      );
    } else {
      PushNotifications.unsubscribeFromTopic('tva');
      actionSetPushTracking(isPushTracking);
    }
  };

  render() {
    const {navigation, dealerSelected, isTvaRequest} = this.props;

    console.log('>>>> dealerSelected.id', this.props.dealerSelected.id);

    return (
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.heading}>Табло выдачи авто</Text>
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
                    <View style={styles.field}>
                      <TextInput
                        style={styles.textinput}
                        label="Гос. номер"
                        value={this.state.carNumber}
                        onChangeText={this.onChangeField('carNumber')}
                      />
                    </View>
                    <View
                      style={
                        (styles.field,
                        {
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        })
                      }>
                      <Label style={stylesList.label}>Отслеживание</Label>
                      <Switch
                        onValueChange={this.onPressPushTracking}
                        value={this.props.pushTracking}
                      />
                    </View>
                  </View>
                  <View style={styles.group}>
                    <Button
                      onPress={
                        this.state.loading
                          ? undefined
                          : () => this.onPressButton()
                      }
                      style={styles.button}>
                      {this.state.loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Проверить</Text>
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

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            <Spinner visible={isTvaRequest} color={styleConst.color.blue} />

            <DealerItemList
              navigation={navigation}
              city={dealerSelected.city}
              name={dealerSelected.name}
              brands={dealerSelected.brands}
              goBack={true}
            />

            <ListItemHeader text="АВТОМОБИЛЬ" />

            {this.renderListItems()}
          </Content>
          <FooterButton
            text="Проверить"
            onPressButton={() => this.onPressButton()}
          />
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TvaScreen);
