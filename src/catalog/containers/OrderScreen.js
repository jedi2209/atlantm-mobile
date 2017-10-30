import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Alert, NetInfo, Text, Image } from 'react-native';
import { Container, Content, List, StyleProvider, Footer, Button } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCommentOrderCarFill, actionOrderCar } from '../actions';
import { nameFill, phoneFill, emailFill } from '../../profile/actions';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import CarOrderList from '../components/CarOrderList';
import CommentOrderForm from '../components/CommentOrderForm';
import ProfileForm from '../../profile/components/ProfileForm';
import ListItemHeader from '../../profile/components/ListItemHeader';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';

// helpres
import { get } from 'lodash';
import priceSet from '../../utils/price-set';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import { CATALOG_ORDER__SUCCESS, CATALOG_ORDER__FAIL } from '../actionTypes';

const FOOTER_HEIGHT = 50;
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    paddingBottom: 100,
  },
  button: {
    flex: 1,
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    backgroundColor: styleConst.color.lightBlue,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  buttonIcon: {
    width: 18,
    marginTop: 3,
    marginLeft: 7,
    resizeMode: 'contain',
  },
  footer: {
    height: FOOTER_HEIGHT,
  },
});

const mapStateToProps = ({ catalog, profile }) => {
  return {
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    comment: catalog.orderComment,
    isOrderCarRequest: catalog.meta.isOrderCarRequest,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    nameFill,
    phoneFill,
    emailFill,
    actionOrderCar,
    actionCommentOrderCarFill,
  }, dispatch);
};

class OrderScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Заявка на покупку',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

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
  }

  componentDidMound() {
    this.props.actionCommentOrderCarFill('');
  }

  onPressOrder = () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (!isConnected) {
        setTimeout(() => Alert.alert('Отсутствует интернет соединение'), 100);
        return;
      }

      const {
        name,
        phone,
        email,
        comment,
        navigation,
        actionOrderCar,
        isOrderCarRequest,
      } = this.props;

      // предотвращаем повторную отправку формы
      if (isOrderCarRequest) return;

      const dealerId = get(navigation, 'state.params.dealerId');
      const car = get(navigation, 'state.params.car');
      const { brand, model } = car;

      if (!name || !phone) {
        return setTimeout(() => {
          Alert.alert(
            'Не хватает информации',
            'Для заявки на покупку авто необходимо заполнить ФИО и номер контактного телефона',
          );
        }, 100);
      }

      actionOrderCar({
        name,
        phone,
        dealerId,
        email,
        brand,
        model,
        comment,
      })
        .then(action => {
          if (action.type === CATALOG_ORDER__SUCCESS) {
            setTimeout(() => {
              Alert.alert('Ваша заявка успешно отправлена');
              // navigation.goBack();
            }, 100);
          }

          if (action.type === CATALOG_ORDER__FAIL) {
            setTimeout(() => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'), 100);
          }
        });
    });
  }

  // shouldComponentUpdate(nextProps) {
  //   const { dealerSelected, date, name, phone, email, car, isOrderCarRequest } = this.props;

  //   const nav = nextProps.nav.newState;
  //   const isActiveScreen = nav.routes[nav.index].routeName === 'OrderScreen';

  //   return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
  //       (name !== nextProps.name) ||
  //         (phone !== nextProps.phone) ||
  //           (email !== nextProps.email) ||
  //             (car !== nextProps.car) ||
  //               (date.date !== nextProps.date.date) ||
  //                 (isOrderCarRequest !== nextProps.isOrderCarRequest);
  // }

  render() {
    const {
      navigation,
      name,
      phone,
      email,
      comment,
      nameFill,
      emailFill,
      phoneFill,
      actionCommentOrderCarFill,
      isOrderCarRequest,
    } = this.props;

    const car = get(navigation, 'state.params.car');
    const currency = get(navigation, 'state.params.currency');
    const { brand, model, price } = car;
    const processedPrice = `${priceSet(price)} ${currency}`;

    console.log('== Order ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <List style={styles.list}>
              <Spinner visible={isOrderCarRequest} color={styleConst.color.blue} />

              <ListItemHeader text="АВТОМОБИЛЬ" />

              <CarOrderList
                brand={brand}
                model={model}
                price={processedPrice}
              />

              <ListItemHeader text="КОНТАКТНАЯ ИНФОРМАЦИЯ" />

              <ProfileForm
                name={name}
                phone={phone}
                email={email}
                nameFill={nameFill}
                phoneFill={phoneFill}
                emailFill={emailFill}
              />

              <ListItemHeader text="КОММЕНТАРИИ" />

              <CommentOrderForm
                comment={comment}
                commentFill={actionCommentOrderCarFill}
              />
            </List>
          </Content>

          <Footer style={styles.footer}>
            <Button onPress={this.onPressOrder} full style={styles.button}>
              <Text style={styles.buttonText}>Отправить</Text>
              <Image
                source={require('../../core/components/CustomIcon/assets/arrow-right.png')}
                style={styles.buttonIcon}
              />
            </Button>
          </Footer>

        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);
