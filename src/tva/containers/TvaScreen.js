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

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
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
  static navigationOptions = ({navigation}) => ({
    // Табло выдачи авто
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

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen =
          get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
          'TvaScreen';
      }
    }

    return isActiveScreen;
  }

  onPressButton = pushProps => {
    let {
      carNumber,
      navigation,
      pushTracking,
      dealerSelected,
      actionFetchTva,
    } = this.props;

    let dealerId = dealerSelected.id;

    if (pushProps) {
      carNumber = pushProps.carNumber;
      dealerId = pushProps.dealerId;
      pushTracking = false;
      this.onPressPushTracking(false);
    }

    if (!carNumber && !pushProps) {
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

  onChangeCarNumber = value => this.props.carNumberFill(value);

  renderListItems = () => {
    const {carNumber, pushTracking} = this.props;

    return (
      <View>
        <View style={stylesList.listItemContainer}>
          <ListItem style={[stylesList.listItem, stylesList.listItemReset]}>
            <Body>
              <Item style={stylesList.inputItem} fixedLabel>
                <Label style={stylesList.label}>Гос. номер</Label>
                <Input
                  style={stylesList.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Поле для заполнения"
                  onChangeText={this.onChangeCarNumber}
                  value={carNumber}
                  returnKeyType="done"
                  returnKeyLabel="Готово"
                  underlineColorAndroid="transparent"
                />
              </Item>
            </Body>
          </ListItem>
        </View>

        <View style={stylesList.listItemContainer}>
          <ListItem style={stylesList.listItem} last>
            <Body>
              <Label style={stylesList.label}>Отслеживание</Label>
            </Body>
            <Right>
              <Switch
                onValueChange={this.onPressPushTracking}
                value={pushTracking}
              />
            </Right>
          </ListItem>
        </View>
      </View>
    );
  };

  onPressPushTracking = isPushTracking => {
    const {actionSetPushTracking, carNumber} = this.props;
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
                    <Button onPress={this.onPressOrder} style={styles.button}>
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
