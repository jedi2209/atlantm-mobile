import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Alert, StyleSheet, Platform, Linking } from 'react-native';
import {
  Body,
  Right,
  Label,
  Item,
  Input,
  Switch,
  Content,
  ListItem,
  Container,
  StyleProvider,
} from 'native-base';

// redux
import { connect } from 'react-redux';
import { actionFetchTva, actionSetPushTracking } from '../actions';
import { carNumberFill } from '../../profile/actions';
import { actionSetFCMToken, actionSetPushGranted } from '../../core/actions';

// components
import FCM from 'react-native-fcm';

import Spinner from 'react-native-loading-spinner-overlay';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import ListItemHeader from '../../profile/components/ListItemHeader';
import DealerItemList from '../../core/components/DealerItemList';
import FooterButton from '../../core/components/FooterButton';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import { TVA__SUCCESS, TVA__FAIL } from '../actionTypes';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
    paddingBottom: 100,
  },
});

const mapStateToProps = ({ dealer, nav, tva, profile, core }) => {
  return {
    nav,
    carNumber: profile.carNumber,
    pushTracking: tva.pushTracking,
    isTvaRequest: tva.meta.isRequest,
    dealerSelected: dealer.selected,
    fcmToken: core.fcmToken,
    pushGranted: core.pushGranted,
  };
};

const mapDispatchToProps = {
  carNumberFill,
  actionFetchTva,
  actionSetPushTracking,
  actionSetFCMToken,
  actionSetPushGranted,
};

class TvaScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Табло выдачи авто',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <View />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    isTvaRequest: PropTypes.bool,
    actionFetchTva: PropTypes.func,
    carNumberFill: PropTypes.func,
    carNumber: PropTypes.string,
    pushTracking: PropTypes.bool,
  }

  componentDidMount() {
    const { navigation } = this.props;
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
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'TvaScreen';
      }
    }

    return isActiveScreen;
  }

  onPressButton = (pushProps) => {
    let {
      carNumber,
      navigation,
      fcmToken,
      pushGranted,
      dealerSelected,
      actionFetchTva,
    } = this.props;

    let dealerId = dealerSelected.id;

    if (pushProps) {
      carNumber = pushProps.carNumber;
      dealerId = pushProps.dealerId;
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
      fcmToken,
      pushGranted,
    }).then(action => {
      if (action.type === TVA__SUCCESS) {
        navigation.navigate('TvaResultsScreen');
      }

      if (action.type === TVA__FAIL) {
        setTimeout(() => Alert.alert('', `${action.payload.message}. Возможно вы указали неправильный номер или автоцентр`), 100);
      }
    });
  }

  onChangeCarNumber = (value) => this.props.carNumberFill(value);

  renderListItems = () => {
    const { carNumber, pushTracking } = this.props;

    return (
      <View>
        <View style={stylesList.listItemContainer}>
          <ListItem style={[stylesList.listItem, stylesList.listItemReset]}>
            <Body>
              <Item style={stylesList.inputItem} fixedLabel>
                <Label style={stylesList.label}>Гос. номер</Label>
                <Input
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
              <Switch onValueChange={this.onPressPushTracking} value={pushTracking} />
            </Right>
          </ListItem>
        </View>

      </View>
    );
  }

  onPressPushTracking = (isPushTracking) => {
    const { fcmToken, actionSetFCMToken, actionSetPushTracking, actionSetPushGranted } = this.props;

    FCM.requestPermissions({ badge: true, sound: true, alert: true })
      .then(() => {
        if (!fcmToken) {
          FCM.getFCMToken().then(token => {
            actionSetFCMToken(token || null);
            actionSetPushGranted(true);
            actionSetPushTracking(isPushTracking);
          });
        } else {
          actionSetPushTracking(isPushTracking);
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
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const { navigation, dealerSelected, isTvaRequest } = this.props;

    console.log('== TvaScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>

            <Spinner visible={isTvaRequest} color={styleConst.color.blue} />

            <DealerItemList
              navigation={navigation}
              city={dealerSelected.city}
              name={dealerSelected.name}
              brands={dealerSelected.brands}
              returnScreen="Tva2Screen"
            />

            <ListItemHeader text="АВТОМОБИЛЬ" />

            {this.renderListItems()}
          </Content>
          <FooterButton
            text="ПРОВЕРИТЬ"
            arrow={true}
            onPressButton={() => this.onPressButton()}
          />
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TvaScreen);
