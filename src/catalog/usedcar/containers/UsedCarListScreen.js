import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { Container, Content, StyleProvider, Button } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import {} from '../actions';

// components
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// helpres
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    justifyContent: 'center',
    flex: 1,
  },
});

const mapStateToProps = ({ dealer, nav }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({

  }, dispatch);
};

class UserCarListScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Автомобили с пробегом',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    const { dealerSelected } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'UserCarListScreen';

    // console.log('Catalog this.props.navigation', this.props.navigation);
    // console.log('Catalog nextProps.navigation', nextProps.navigation);

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen);
  }

  render() {
    const {
      dealerSelected,
      navigation,
    } = this.props;

    console.log('== UsedCarListScreen ==');

    return (
      <View style={styles.content}></View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCarListScreen);
