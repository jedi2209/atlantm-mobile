import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Body,
  Item,
  Icon,
  Label,
  Right,
  Footer,
  Button,
  Content,
  ListItem,
  Container,
  StyleProvider,
} from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionFetchNewCarFilterData } from '../../actions';

// components
import CityItemList from '../components/CityItemList';
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import ListItemHeader from '../../../profile/components/ListItemHeader';

// styles
import styleListProfile from '../../../core/components/Lists/style';

// helpers
import { get, find } from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';
import { verticalScale } from '../../../utils/scale';

const FOOTER_HEIGHT = 50;
const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
    paddingBottom: 100,
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
  body: {
    flex: 1.5,
  },
  right: {
    flex: 2,
  },
});

const mapStateToProps = ({ catalog, dealer, nav }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    listRussiaByCities: dealer.listRussiaByCities,
    listBelarussiaByCities: dealer.listBelarussiaByCities,
    listUkraineByCities: dealer.listUkraineByCities,

    filterBrands: catalog.newCar.filterBrands,
    filterModels: catalog.newCar.filterModels,
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
    const { dealerSelected, filterData, isFetchingFilterData, filterBrands } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'NewCarFilterScreen';

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (isFetchingFilterData !== nextProps.isFetchingFilterData) ||
      (get(filterData, 'pages.next') !== get(nextProps, 'filterData.pages.next')) ||
      (filterBrands.length !== nextProps.filterBrands);
  }

  getCityData = () => {
    const {
      city,
      listRussiaByCities,
      listUkraineByCities,
      listBelarussiaByCities,
    } = this.props;

    const list = [].concat(
      listRussiaByCities,
      listUkraineByCities,
      listBelarussiaByCities,
    );

    return find(list, { id: city.id });
  }

  onPressBrands = () => this.props.navigation.navigate('NewCarFilterBrandsScreen')

  onPressModels = () => {

  }

  onPressPrice = () => {

  }

  onPressBody = () => {

  }

  onPressGearbox = () => {

  }

  onPressEngineType = () => {

  }

  onPressDrive = () => {

  }

  render() {
    const {
      city,
      filterBrands,
      filterModels,
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

            <CityItemList
              navigation={navigation}
              cityName={city.name}
              cityData={this.getCityData()}
              returnScreen="NewCarFilterScreen"
            />

            <ListItemHeader text="ПАРАМЕТРЫ ПОИСКА" />

            <View style={styleListProfile.listItemContainer}>
              <ListItem style={styleListProfile.listItemPressable} onPress={this.onPressBrands}>
                <Body style={styles.body} >
                  <Label style={styleListProfile.label}>Марка</Label>
                </Body>
                <Right style={styles.right}>
                  {
                    filterBrands.length !== 0 &&
                      <Text style={styleListProfile.listItemValue}>
                        {`Выбрано: ${filterBrands.length}`}
                      </Text>
                  }
                  <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                </Right>
              </ListItem>
            </View>

            <View style={styleListProfile.listItemContainer}>
              <ListItem style={styleListProfile.listItemPressable} onPress={this.onPressModels}>
                <Body style={styles.body} >
                  <Label style={styleListProfile.label}>Модель</Label>
                </Body>
                <Right style={styles.right}>
                  <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                </Right>
              </ListItem>
            </View>

            <View style={styleListProfile.listItemContainer}>
              <ListItem style={styleListProfile.listItemPressable} onPress={this.onPressPrice}>
                <Body style={styles.body} >
                  <Label style={styleListProfile.label}>Цена</Label>
                </Body>
                <Right style={styles.right}>
                  <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                </Right>
              </ListItem>
            </View>

            <View style={styleListProfile.listItemContainer}>
              <ListItem style={styleListProfile.listItemPressable} onPress={this.onPressBody}>
                <Body style={styles.body} >
                  <Label style={styleListProfile.label}>Тип кузова</Label>
                </Body>
                <Right style={styles.right}>
                  <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                </Right>
              </ListItem>
            </View>

            <View style={styleListProfile.listItemContainer}>
              <ListItem style={styleListProfile.listItemPressable} onPress={this.onPressGearbox}>
                <Body style={styles.body} >
                  <Label style={styleListProfile.label}>КПП</Label>
                </Body>
                <Right style={styles.right}>
                  <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                </Right>
              </ListItem>
            </View>

            <View style={styleListProfile.listItemContainer}>
              <ListItem style={styleListProfile.listItemPressable} onPress={this.onPressEngineType}>
                <Body style={styles.body}>
                  <Label style={styleListProfile.label}>Тип двигателя</Label>
                </Body>
                <Right style={styles.right}>
                  <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                </Right>
              </ListItem>
            </View>

            <View style={styleListProfile.listItemContainer}>
              <ListItem last style={styleListProfile.listItemPressable} onPress={this.onPressDrive}>
                <Body style={styles.body}>
                  <Label style={styleListProfile.label}>Привод</Label>
                </Body>
                <Right style={styles.right}>
                  <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                </Right>
              </ListItem>
            </View>
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
