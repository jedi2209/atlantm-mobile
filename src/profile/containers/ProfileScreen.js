import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Container, Content, List, StyleProvider } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { nameFill, phoneFill, emailFill, carFill, carNumberFill } from '../actions';

// components
import ProfileForm from '../components/ProfileForm';
import ListItemHeader from '../components/ListItemHeader';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';

// helpres
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({ dealer, profile, nav }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    car: profile.car,
    carNumber: profile.carNumber,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    nameFill,
    phoneFill,
    emailFill,
    carFill,
    carNumberFill,
  }, dispatch);
};

class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Личный кабинет',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <View />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    carFill: PropTypes.func,
    carNumberFill: PropTypes.func,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    car: PropTypes.string,
    carNumber: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    const {
      name,
      phone,
      email,
      car,
      carNumber,
      dealerSelected,
    } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'ProfileScreen';

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
        (name !== nextProps.name) ||
          (phone !== nextProps.phone) ||
            (email !== nextProps.email) ||
              (car !== nextProps.car) ||
                (carNumber !== nextProps.carNumber);
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    window.atlantmNavigation = this.props.navigation;

    const {
      dealerSelected,
      navigation,
      nameFill,
      phoneFill,
      emailFill,
      carFill,
      carNumberFill,
      name,
      phone,
      email,
      car,
      carNumber,
    } = this.props;

    console.log('== Profile ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content} >
            <List style={styles.list}>
              <ListItemHeader text="МОЙ АВТОЦЕНТР" />

              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brands}
                returnScreen="ProfileScreen"
              />

              <ListItemHeader text="КОНТАКТНАЯ ИНФОРМАЦИЯ" />

              <ProfileForm
                carSection={true}
                name={name}
                phone={phone}
                email={email}
                car={car}
                carNumber={carNumber}
                nameFill={nameFill}
                phoneFill={phoneFill}
                emailFill={emailFill}
                carFill={carFill}
                carNumberFill={carNumberFill}
              />
            </List>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
