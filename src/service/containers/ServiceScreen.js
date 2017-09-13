import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Alert } from 'react-native';
import { Container, Content, List, StyleProvider } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { carFill, dateFill, orderService } from '../actions';
import { nameFill, phoneFill, emailFill } from '../../profile/actions';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import DeviceInfo from 'react-native-device-info';
import ServiceForm from '../../service/components/ServiceForm';
import ServiceButton from '../../service/components/ServiceButton';
import ProfileForm from '../../profile/components/ProfileForm';
import ListItemHeader from '../../profile/components/ListItemHeader';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';

// helpres
import { yearMonthDay } from '../../utils/date';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import { SERVICE_ORDER__SUCCESS, SERVICE_ORDER__FAIL } from '../actionTypes';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    paddingBottom: 100,
  },
  serviceForm: {
    marginTop: 40,
  },
});

const mapStateToProps = ({ dealer, profile, service, nav }) => {
  return {
    nav,
    car: service.car,
    date: service.date,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    dealerSelected: dealer.selected,
    isOrderServiceRequest: service.meta.isOrderServiceRequest,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    carFill,
    dateFill,
    nameFill,
    phoneFill,
    emailFill,
    orderService,
  }, dispatch);
};

class ServiceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Заявка на СТО',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
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

  onPressOrder = () => {
    const {
      car,
      date,
      name,
      phone,
      email,
      orderService,
      dealerSelected,
    } = this.props;

    const dealerID = dealerSelected.id;

    if (!name || !phone || !car || !date) {
      return Alert.alert(
        'Не хватает информации',
        `Для заявки на СТО необходимо заполнить ФИО, номер контактного телефона, название автомобиля и желаемую дату`,
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
          setTimeout(() => Alert.alert('Успешно', 'Ваша заявка на СТО принята'), 100);
        }

        if (action.type === SERVICE_ORDER__FAIL) {
          setTimeout(() => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'), 100);
        }
      });
  }

  shouldComponentUpdate(nextProps) {
    const { dealerSelected, date, name, phone, email, car, navigation } = this.props;
    const isActiveRoute = nextProps.nav === 'ServiceScreen';

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveRoute) ||
        (name !== nextProps.name && isActiveRoute) ||
          (phone !== nextProps.phone && isActiveRoute) ||
            (email !== nextProps.email && isActiveRoute) ||
              (car !== nextProps.car && isActiveRoute) ||
                (date.date !== nextProps.date.date && isActiveRoute);
  }

  render() {
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
        <Container>
          <Content style={styles.content} >
            <List style={styles.list}>
              <Spinner visible={isOrderServiceRequest} color={styleConst.color.blue} />

              <ListItemHeader text="МОЙ АВТОЦЕНТР" />

              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brands}
                returnScreen="ServiceScreen"
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
          <ServiceButton onPress={this.onPressOrder}/>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceScreen);
