import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Platform, Alert, Linking } from 'react-native';
import PropTypes from 'prop-types';

// components
import FCM from 'react-native-fcm';
import { ListItem, Body, Item, Label, Input, Right, Switch } from 'native-base';
import ListItemHeader from '../components/ListItemHeader';
import PushNotifications from '../../core/components/PushNotifications';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
import styleConst from '../../core/style-const';

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  inputItem: {
    paddingRight: 7,
  },
  inputItemCar: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 7,
  },
  carNumber: {
    marginTop: 5,
    color: styleConst.color.greyText3,
    fontSize: 16,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
  },
  textContainer: {
    paddingHorizontal: styleConst.ui.horizontalGapInList,
    paddingTop: styleConst.ui.horizontalGap,
  },
  text: {
    color: styleConst.color.greyText3,
    fontSize: styleConst.ui.smallTextSize,
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
  },
  input: {
    ...Platform.select({
      android: {
        width: 2000,
      },
    }),
  },
  inputContainer: {
    ...Platform.select({
      android: {
        flex: 3,
        justifyContent: 'center',
        overflow: 'hidden',
      },
    }),
  },
  actionListItemContainer: {
    marginTop: 30,
  },
});

export default class ProfileForm extends PureComponent {
  static propTypes = {
    dealerSelected: PropTypes.object,

    auth: PropTypes.object,
    isRegisterForm: PropTypes.bool,

    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    car: PropTypes.string,
    carVIN: PropTypes.string,
    carNumber: PropTypes.string,

    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    carFill: PropTypes.func,
    carVINFill: PropTypes.func,
    carNumberFill: PropTypes.func,
    carSection: PropTypes.bool,

    fcmToken: PropTypes.string,
    pushActionSubscribe: PropTypes.bool,
    actionSetFCMToken: PropTypes.func,
    actionSetPushGranted: PropTypes.func,
    actionSetPushActionSubscribe: PropTypes.func,
  }

  static defaultProps = {
    auth: {},
    name: '',
    phone: '',
    email: '',
    car: '',
    carVIN: '',
    carNumber: '',
    carSection: false,
    isRegisterForm: false,
  }

  onChangeName = value => this.props.nameFill(value)
  onChangePhone = value => this.props.phoneFill(value)
  onChangeEmail = value => this.props.emailFill(value)
  onChangeCar = value => this.props.carFill(value)
  onChangeCarVIN = value => this.props.carVINFill(value)
  onChangeCarNumber = value => this.props.carNumberFill(value)

  getCarSectionTitle = () => {
    const { auth } = this.props;

    let title = 'МОЙ АВТОМОБИЛЬ';

    if (auth.cars && auth.cars.length >= 2) {
      title = 'МОИ АВТОМОБИЛИ';
    }

    return title;
  }

  renderCars = () => {
    const { auth } = this.props;

    return auth.cars.map((car, idx, carArray) => {
      return (
        <View key={`${car.brand}${idx}`} style={stylesList.listItemContainer}>
          <ListItem last={(carArray.length - 1) === idx} style={[stylesList.listItem, stylesList.listItemReset]} >
            <Body>
              <Item style={[stylesList.inputItem, styles.inputItemCar]} fixedLabel>
                <Label style={stylesList.label}>
                  <Text style={styles.carName}>{car.brand} {car.model}</Text>
                </Label>
                <View style={styles.carNumberContainer}>
                    <Text style={styles.carNumber}>{car.number}</Text>
                  </View>
              </Item>
            </Body>
          </ListItem>
        </View>
      );
    });
  }

  renderListItem = ({ label, value, onChange, inputProps = {}, isLast }) => {
    const renderInput = () => (
      <Input
        multiline={isAndroid}
        numberOfLines={1}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Поле для заполнения"
        onChangeText={onChange}
        value={value}
        returnKeyType="done"
        returnKeyLabel="Готово"
        underlineColorAndroid="transparent"
        {...inputProps}
      />
    );

    return (
      <View style={stylesList.listItemContainer}>
        <ListItem last={isLast} style={[stylesList.listItem, stylesList.listItemReset]} >
          <Body>
            <Item style={[stylesList.inputItem, styles.inputItem]} fixedLabel>
              <Label style={[stylesList.label, styles.label]}>{label}</Label>
              {
                isAndroid ?
                  <View style={styles.inputContainer}>{renderInput()}</View> :
                  renderInput()
              }
            </Item>
          </Body>
        </ListItem>
      </View>
    );
  }

  renderListSwitcher = (onSwitch, value) => {
    return (
      <View style={[stylesList.listItemContainer, styles.actionListItemContainer]}>
        <ListItem style={stylesList.listItem} first last>
          <Body>
            <Label style={stylesList.label}>Уведомления об акциях</Label>
          </Body>
          <Right>
            <Switch onValueChange={onSwitch} value={value} />
          </Right>
        </ListItem>
      </View>
    );
  }

  onSwitchActionSubscribe = (isSubscribe) => {
    const {
      dealerSelected,

      fcmToken,
      actionSetFCMToken,
      actionSetPushGranted,
      actionSetPushActionSubscribe,
    } = this.props;

    const id = dealerSelected.id;

    const topicSetSubscribe = () => {
      actionSetPushActionSubscribe(isSubscribe);

      if (isSubscribe) {
        PushNotifications.subscribeToTopic({ id });
      } else {
        PushNotifications.unsubscribeFromTopic({ id });
      }
    };

    FCM.requestPermissions({ badge: true, sound: true, alert: true })
      .then(() => {
        if (!fcmToken) {
          FCM.getFCMToken().then((token) => {
            actionSetFCMToken(token || null);
            actionSetPushGranted(true);
            topicSetSubscribe();
          });
        } else {
          topicSetSubscribe();
        }
      })
      .catch(() => {
        if (Platform.OS === 'ios') {
          setTimeout(() => {
            return Alert.alert(
              'Уведомления выключены',
              'Необходимо разрешить получение push-уведомлений для приложения Атлант-М в настройках',
              [
                { text: 'Ок', style: 'cancel' },
                {
                  text: 'Настройки',
                  onPress() {
                    Linking.openURL('app-settings://notification/com.atlant-m');
                  },
                },
              ],
            );
          }, 100);
        }
      });
  }

  render() {
    const {
      car,
      auth,
      name,
      phone,
      email,
      carVIN,
      carNumber,
      carSection,
      carVINFill,
      isRegisterForm,
      pushActionSubscribe,
      actionSetPushActionSubscribe,
    } = this.props;

    const isCars = get(auth, 'cars', []).length !== 0;

    return (
      <View style={styles.container}>
        {this.renderListItem({
          label: 'ФИО',
          value: name,
          onChange: this.onChangeName,
          inputProps: { autoCapitalize: 'words' },
        })}
        {this.renderListItem({
          label: 'Телефон',
          value: phone,
          onChange: this.onChangePhone,
          inputProps: {
            maxLength: 20,
            keyboardType: 'phone-pad',
          },
        })}
        {this.renderListItem({
          label: 'Email',
          value: email,
          onChange: this.onChangeEmail,
          inputProps: { keyboardType: 'email-address' },
          isLast: true,
        })}

        {
          isRegisterForm ?
            (
              <View style={styles.textContainer}>
                <Text style={styles.text}>* – обязательно заполните все поля</Text>
              </View>
            ) : null
        }

        {
          carSection ?
            (
              <View>
                <ListItemHeader text={this.getCarSectionTitle()} />
                {
                  carVINFill ?
                    this.renderListItem({
                      label: 'VIN',
                      value: carVIN,
                      onChange: this.onChangeCarVIN,
                    }) : null
                }
                {
                  !isCars && !carVINFill ?
                    this.renderListItem({
                      label: 'Авто',
                      value: car,
                      onChange: this.onChangeCar,
                    }) : null
                }
                {
                  !isCars ?
                    this.renderListItem({
                      label: 'Гос. номер',
                      value: carNumber,
                      onChange: this.onChangeCarNumber,
                      isLast: true,
                    }) : null
                }

                {isCars ? this.renderCars() : null }
              </View>
            ) : null
        }

        {this.renderListSwitcher(this.onSwitchActionSubscribe, pushActionSubscribe)}
      </View>
    );
  }
}
