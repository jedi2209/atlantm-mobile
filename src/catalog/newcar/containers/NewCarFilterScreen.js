import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Container, Content, StyleProvider, Button, Footer } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionFetchNewCarFilterData } from '../../actions';

// components
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// helpers
import { get } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';
import { verticalScale } from '../../../utils/scale';

const { width } = Dimensions.get('window');
const FOOTER_HEIGHT = 50;
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
  spinnerContainer: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  button: {
    flex: 1,
    height: FOOTER_HEIGHT,
    flexDirection: 'row',
    backgroundColor: styleConst.color.lightBlue,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: styleConst.font.medium,
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

const mapStateToProps = ({ catalog, dealer, nav }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    city: catalog.newCar.city,
    region: catalog.newCar.region,
    priceRange: catalog.newCar.priceRange,
    filterData: catalog.newCar.filterData,
    isFetchingFilterData: catalog.newCar.meta.isFetchingFilterData,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionFetchNewCarFilterData,
  }, dispatch);
};

class NewCarFilterScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Новые автомобили',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
  }

  componentDidMount() {
    const { actionFetchNewCarFilterData, city } = this.props;

    actionFetchNewCarFilterData({ city: city.id });
  }

  shouldComponentUpdate(nextProps) {
    const { dealerSelected, filterData, isFetchingFilterData } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'NewCarFilterScreen';

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (isFetchingFilterData !== nextProps.isFetchingFilterData) ||
      (get(filterData, 'pages.next') !== get(nextProps, 'filterData.pages.next'));
  }

  render() {
    const {
      filterData,
      navigation,
      dealerSelected,
      isFetchingFilterData,
    } = this.props;

    console.log('== NewCarFilterScreen ==');

    if (!filterData || isFetchingFilterData) {
      return (
        <View style={styles.spinnerContainer} >
          <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
        </View>
      );
    }

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>



          </Content>
          <Footer style={styles.footer}>
            <Button onPress={this.onPressOrder} full style={styles.button}>
              <Text style={styles.buttonText}>{`НАЙДЕНО ${filterData.total.count}`}</Text>
              <Image
                source={require('../../../core/components/CustomIcon/assets/arrow-right.png')}
                style={styles.buttonIcon}
              />
            </Button>
          </Footer>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterScreen);
