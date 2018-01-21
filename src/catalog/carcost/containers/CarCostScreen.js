import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Alert, NetInfo } from 'react-native';
import { Container, Content, List, StyleProvider } from 'native-base';

// redux
import { connect } from 'react-redux';
import { nameFill, phoneFill, emailFill } from '../../../profile/actions';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import ProfileForm from '../../../profile/components/ProfileForm';
import ListItemHeader from '../../../profile/components/ListItemHeader';
import DealerItemList from '../../../core/components/DealerItemList';
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import CarCostPhotos from '../components/CarCostPhotos';

// helpers
import { get } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    paddingBottom: 100,
  },
});

const mapStateToProps = ({ dealer, profile, nav }) => {
  return {
    nav,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = {
  nameFill,
  phoneFill,
  emailFill,
};

class CarCostScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Заявка на оценку',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }

  onPressOrder = () => {
    // NetInfo.isConnected.fetch().then(isConnected => {
    //   if (!isConnected) {
    //     setTimeout(() => Alert.alert('Отсутствует интернет соединение'), 100);
    //     return;
    //   }

    //   const {
    //     car,
    //     date,
    //     name,
    //     phone,
    //     email,
    //     orderService,
    //     dealerSelected,
    //     isOrderServiceRequest,
    //   } = this.props;

    //   // предотвращаем повторную отправку формы
    //   if (isOrderServiceRequest) return;

    //   const dealerID = dealerSelected.id;

    //   if (!name || !phone || !car || !date || !date.date) {
    //     return Alert.alert(
    //       'Не хватает информации',
    //       'Для заявки на СТО необходимо заполнить ФИО, номер контактного телефона, название автомобиля и желаемую дату',
    //     );
    //   }

    //   const orderDate = yearMonthDay(date.date);
    //   const device = `${DeviceInfo.getBrand()} ${DeviceInfo.getSystemVersion()}`;

    //   orderService({
    //     car,
    //     date: orderDate,
    //     name,
    //     email,
    //     phone,
    //     device,
    //     dealerID,
    //   })
    //     .then(action => {
    //       if (action.type === SERVICE_ORDER__SUCCESS) {
    //         setTimeout(() => Alert.alert('Ваша заявка успешно отправлена'), 100);
    //       }

    //       if (action.type === SERVICE_ORDER__FAIL) {
    //         setTimeout(() => Alert.alert('Ошибка', 'Произошла ошибка, попробуйте снова'), 100);
    //       }
    //     });
    // });
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'CarCostScreen';
      }
    }

    return isActiveScreen;
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      name,
      phone,
      email,
      nameFill,
      emailFill,
      phoneFill,
      navigation,
      dealerSelected,
    } = this.props;

    console.log('== CarCost ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <List style={styles.list}>
              {/* <Spinner visible={isOrderServiceRequest} color={styleConst.color.blue} /> */}

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
                view="CarCostScreen"
                name={name}
                phone={phone}
                email={email}
                nameFill={nameFill}
                phoneFill={phoneFill}
                emailFill={emailFill}
              />

              <ListItemHeader text="АВТОМОБИЛЬ" />

              <ListItemHeader text="ДОПОЛНИТЕЛЬНО" />

              <ListItemHeader text="ПРИКРЕПИТЬ ФОТОГРАФИИ" />

              <CarCostPhotos />
            </List>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarCostScreen);
