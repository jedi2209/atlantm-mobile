import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import { Content, List, StyleProvider } from 'native-base';

// redux
import { connect } from 'react-redux';
import { dateFill, orderService } from '../actions';
import { carFill, nameFill, phoneFill, emailFill } from '../../profile/actions';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import ServiceForm from '../../service/components/ServiceForm';
import FooterButton from '../../core/components/FooterButton';
import ProfileForm from '../../profile/components/ProfileForm';
import ListItemHeader from '../../profile/components/ListItemHeader';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';

// helpers
import isInternet from '../../utils/internet';
import { yearMonthDay } from '../../utils/date';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import { ERROR_NETWORK } from '../../core/const';
import { SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL } from '../actionTypes';

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
});

const mapStateToProps = ({ dealer, profile, service, nav }) => {
  return {
    nav,
    date: service.date,
    car: profile.car,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    dealerSelected: dealer.selected,
    isOrderServiceRequest: service.meta.isOrderServiceRequest,
  };
};

const mapDispatchToProps = {
  carFill,
  dateFill,
  nameFill,
  phoneFill,
  emailFill,
  orderService,
};

class ServiceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Заявка на СТО',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <View />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    carFill: PropTypes.func,
    dateFill: PropTypes.func,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    car: PropTypes.string,
    date: PropTypes.object,
    isOrderServiceRequest: PropTypes.bool,
  }

  onPressOrder = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {
        car,
        date,
        name,
        phone,
        email,
        orderService,
        dealerSelected,
        isOrderServiceRequest,
      } = this.props;

      // предотвращаем повторную отправку формы
      if (isOrderServiceRequest) return;

      const dealerID = dealerSelected.id;

      if (!name || !phone || !car || !date || !date.date) {
        return Alert.alert(
          'Не хватает информации',
          'Для заявки на СТО необходимо заполнить ФИО, номер контактного телефона, название автомобиля и желаемую дату',
        );
      }

      const orderDate = yearMonthDay(date.date);
      const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getSystemVersion()}`;

      orderService({
        car,
        date: orderDate,
        name,
        email,
        phone,
        device,
        dealerID,
      })
        .then(action => {
          if (action.type === SERVICE_ORDER__SUCCESS) {
            setTimeout(() => Alert.alert('Ваша заявка успешно отправлена'), 100);
          }

          if (action.type === SERVICE_ORDER__FAIL) {
            setTimeout(() => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'), 100);
          }
        });
    }
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'ServiceScreen';

    return isActiveScreen;
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      car,
      date,
      name,
      phone,
      email,
      carFill,
      dateFill,
      nameFill,
      emailFill,
      phoneFill,
      navigation,
      dealerSelected,
      isOrderServiceRequest,
    } = this.props;

    console.log('== Service ==');

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            <List style={styles.list}>
              <Spinner visible={isOrderServiceRequest} color={styleConst.color.blue} />

              <ListItemHeader text="МОЙ АВТОЦЕНТР" />

              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brands}
                goBack={true}
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

              <View style={styles.serviceForm}>
                <ServiceForm
                  car={car}
                  date={date}
                  carFill={carFill}
                  dateFill={dateFill}
                />
              </View>
            </List>
          </Content>
          <FooterButton
            text="Отправить"
            onPressButton={this.onPressOrder}
          />
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreen);
