import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Alert, StyleSheet, Platform, TouchableOpacity, NetInfo } from 'react-native';
import {
  Body,
  Label,
  Item,
  Content,
  ListItem,
  Container,
  StyleProvider,
} from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionTvaMessageSend, actionTvaMessageFill, actionSetActiveTvaOrderId } from '../actions';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import ButtonFull from '../../core/components/ButtonFull';
import MessageForm from '../../core/components/MessageForm';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import ListItemHeader from '../../profile/components/ListItemHeader';
// import FooterButton from '../../core/components/FooterButton';

// styles
import styleListProfile from '../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
import { dayMonthYearTime } from '../../utils/date';
import { verticalScale } from '../../utils/scale';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import { TVA_SEND_MESSAGE__SUCCESS, TVA_SEND_MESSAGE__FAIL } from '../actionTypes';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
    paddingBottom: 100,
  },
  titleContainer: {
    backgroundColor: styleConst.color.header,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
    marginBottom: 0.3,
    paddingBottom: verticalScale(5),
  },
  title: {
    fontSize: 18,
    color: styleConst.color.greyText4,
    fontFamily: styleConst.font.regular,
    textAlign: 'center',
    marginBottom: 3,
  },
  label: {
    flex: 2.5,
  },
  itemTitle: {
    fontSize: 20,
  },
  button: {
    // marginTop: 10,
  },
});

const mapStateToProps = ({ dealer, nav, tva }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    results: tva.results,
    message: tva.message,
    activeOrderId: tva.activeOrderId,
    isMessageSending: tva.meta.isMessageSending,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionTvaMessageFill,
    actionTvaMessageSend,
    actionSetActiveTvaOrderId,
  }, dispatch);
};

class TvaResultsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Табло выдачи авто',
    headerStyle: [styleHeader.common, { borderBottomWidth: 0 }],
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

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
  }

  componentDidMount() {
    const { results, actionTvaMessageFill, actionSetActiveTvaOrderId } = this.props;
    const activeTvaOrderId = get(results, 'info.0.id');

    actionTvaMessageFill('');
    actionSetActiveTvaOrderId(activeTvaOrderId);
  }

  onPressMessageButton = () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        setTimeout(() => Alert.alert('Отсутствует интернет соединение'), 100);
        return;
      }

      const {
        message,
        dealerSelected,
        activeOrderId,
        isMessageSending,
        actionTvaMessageFill,
        actionTvaMessageSend,
      } = this.props;

      // предотвращаем повторную отправку формы
      if (isMessageSending) return;

      actionTvaMessageSend({
        text: message,
        id: activeOrderId,
        dealer: dealerSelected.id,
      })
        .then(action => {
          const { type, payload } = action;

          if (type === TVA_SEND_MESSAGE__SUCCESS) {
            setTimeout(() => {
              actionTvaMessageFill('');
              Alert.alert(payload.status);
            }, 100);
          }

          if (type === TVA_SEND_MESSAGE__FAIL) {
            setTimeout(() => Alert.alert('', 'Произошла ошибка, попробуйте снова'), 100);
          }
        });
    });
  }

  onPressOrder = (orderId) => this.props.actionSetActiveTvaOrderId(orderId)

  processDate = (date) => dayMonthYearTime(date)

  renderListItem = (label, value, isLast) => {
    return (
      <View style={styleListProfile.listItemContainer}>
        <ListItem last={isLast} style={[styleListProfile.listItem]}>
          <Body>
            <Item style={[styleListProfile.inputItem, { justifyContent: 'flex-start' }]} fixedLabel>
              <Label style={[styleListProfile.label, styles.label]}>{label}</Label>
              <View style={styleListProfile.listItemValueContainer}>
                <Text style={styleListProfile.listItemValue}>{value}</Text>
              </View>
            </Item>
          </Body>
        </ListItem>
      </View>
    );
  }

  render() {
    const {
      message,
      results,
      activeOrderId,
      isMessageSending,
      actionTvaMessageFill,
    } = this.props;

    const { car, info } = results;
    const titleCar = `${car.brand} ${car.model}`;
    const titleCarNumber = car.number;

    console.log('== TvaResultsScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>

            <Spinner visible={isMessageSending} color={styleConst.color.blue} />

            <View style={[
              styles.titleContainer,
              Platform.OS === 'android' && {
                marginTop: 15,
                marginBottom: 10,
                borderBottomWidth: 0,
                backgroundColor: 'transparent',
               },
            ]}>
              <Text style={styles.title}>{titleCar}</Text>
              <Text style={styles.title}>{titleCarNumber}</Text>
            </View>

            {
              info.map(item => {
                return (
                  <TouchableOpacity key={item.id} onPress={this.onPressBack} style={styles.item}>
                    <ListItemHeader
                      textStyle={styles.itemTitle}
                      radio={true}
                      radioSelected={activeOrderId === item.id}
                      text={`№ ${item.id}`}
                      onPress={() => this.onPressOrder(item.id)}
                    />
                    {this.renderListItem('Мастер-приёмщик', item.name)}
                    {this.renderListItem('Время выдачи', this.processDate(item.date))}
                    {this.renderListItem('Статус', item.status, true)}
                  </TouchableOpacity>
                );
              })
            }

            <ListItemHeader text="СООБЩЕНИЕ МАСТЕРУ"/>

            <MessageForm
              message={message}
              messageFill={actionTvaMessageFill}
            />

            <ButtonFull
              text="ОТПРАВИТЬ"
              arrow={true}
              style={styles.button}
              onPressButton={this.onPressMessageButton}
            />

          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TvaResultsScreen);
