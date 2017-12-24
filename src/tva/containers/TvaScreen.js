import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Alert, StyleSheet, PushNotificationIOS } from 'react-native';
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
  };
};

const mapDispatchToProps = {
  carNumberFill,
  actionFetchTva,
  actionSetPushTracking,
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

  onPressButton = () => {
    const { dealerSelected, actionFetchTva, carNumber, navigation, fcmToken } = this.props;

    if (!carNumber) {
      return setTimeout(() => {
        Alert.alert(
          'Недостаточно информации',
          'Необходимо заполнить гос. номер автомобиля',
        );
      }, 100);
    }

    actionFetchTva({
      number: carNumber.replace(/\s/g, ''),
      dealer: dealerSelected.id,
      region: dealerSelected.region,
      fcmToken,
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
              <Switch onValueChange={this.onPressPushTracking} style={styles.switch} value={pushTracking} />
            </Right>
          </ListItem>
        </View>

      </View>
    );
  }

  onPressPushTracking = (isPushTracking) => {
    FCM.requestPermissions({ badge: true, sound: true, alert: true })
      .then(() => {
        this.props.actionSetPushTracking(isPushTracking);
      })
      .catch(() => console.log('reject'));

    PushNotificationIOS.checkPermissions(
      (permissions) => {
        if (permissions.alert === 1 || permissions.badge === 1 || permissions.sound === 1) {
          console.log('ios granted');
        } else {
          console.log('ios reject');
        }
      });
  }

  render() {
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
            onPressButton={this.onPressButton}
          />
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TvaScreen);
