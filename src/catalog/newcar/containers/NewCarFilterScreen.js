import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';
import {
  Body,
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
import {
  actionFetchNewCarByFilter,
  actionFetchNewCarFilterData,
  actionShowNewCarFilterPrice,
  actionHideNewCarFilterPrice,
  actionSelectNewCarFilterPrice,
} from '../../actions';

// components
import EmptyMessage from '../../../core/components/EmptyMessage';
import CityItemList from '../components/CityItemList';
import PricePicker from '../../../core/components/PricePicker';
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
import { TEXT_EMPTY_CAR_LIST } from '../../constants';

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
  spinnerButton: {
    alignSelf: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  hiddenListItemContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

const mapStateToProps = ({ catalog, dealer, nav }) => {
  return {
    nav,
    dealerSelected: dealer.selected,
    listRussiaByCities: dealer.listRussiaByCities,
    listBelarussiaByCities: dealer.listBelarussiaByCities,
    listUkraineByCities: dealer.listUkraineByCities,

    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData,
    filterBrands: catalog.newCar.filterBrands,
    filterModels: catalog.newCar.filterModels,
    filterBody: catalog.newCar.filterBody,
    filterGearbox: catalog.newCar.filterGearbox,
    filterDrive: catalog.newCar.filterDrive,
    filterEngineType: catalog.newCar.filterEngineType,
    filterPrice: catalog.newCar.filterPrice,

    city: catalog.newCar.city,
    region: catalog.newCar.region,
    needFetchFilterData: catalog.newCar.meta.needFetchFilterData,
    needFetchFilterDataAfterCity: catalog.newCar.meta.needFetchFilterDataAfterCity,
    isFetchingFilterData: catalog.newCar.meta.isFetchingFilterData,
    isNewCarFilterPriceShow: catalog.newCar.meta.isNewCarFilterPriceShow,
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionFetchNewCarFilterData,
    actionFetchNewCarByFilter,
    actionShowNewCarFilterPrice,
    actionHideNewCarFilterPrice,
    actionSelectNewCarFilterPrice,
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

  componentDidUpdate() {
    const {
      filterData,
      filterBrands,
      filterModels,
      filterBody,
      filterGearbox,
      filterDrive,
      filterEngineType,
      filterPrice,

      // обновление экрана после выбора фильтров
      city,
      needFetchFilterData,
      actionFetchNewCarByFilter,

      // обновление экрана после выбора города
      needFetchFilterDataAfterCity,
      actionFetchNewCarFilterData
    } = this.props;

    if (needFetchFilterDataAfterCity) {
      return actionFetchNewCarFilterData({ city: city.id });
    }

    if (needFetchFilterData) {
      return actionFetchNewCarByFilter({
        searchUrl: filterData.search_url,
        filterBrands,
        filterModels,
        filterBody,
        filterGearbox,
        filterDrive,
        filterEngineType,
        filterPrice,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const {
      city,
      items,
      filterData,
      filterBrands,
      filterPrice,
      dealerSelected,
      isFetchingFilterData,
      isNewCarFilterPriceShow,
    } = this.props;
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'NewCarFilterScreen';
      }
    }

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (isFetchingFilterData !== nextProps.isFetchingFilterData && isActiveScreen) ||
      (get(filterData, 'pages.next') !== get(nextProps, 'filterData.pages.next') && isActiveScreen) ||
      (get(items, 'pages.next') !== get(nextProps, 'items.pages.next') && isActiveScreen) ||
      (filterBrands.length !== nextProps.filterBrands && isActiveScreen) ||
      (isNewCarFilterPriceShow !== nextProps.isNewCarFilterPriceShow && isActiveScreen) ||
      (city.id !== nextProps.city.id && isActiveScreen) ||
      (get(filterPrice, 'minPrice') !== get(nextProps, 'filterPrice.minPrice') && isActiveScreen) ||
      (get(filterPrice, 'maxPrice') !== get(nextProps, 'filterPrice.maxPrice') && isActiveScreen);
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
    const { navigation, filterBrands } = this.props;

    if (filterBrands.length === 0) {
      setTimeout(() => Alert.alert('Вы не выбрали ни одной марки'), 100);
    } else {
      navigation.navigate('NewCarFilterModelsScreen');
    }
  }

  onPressPrice = () => this.props.actionShowNewCarFilterPrice()

  onClosePrice = (prices) => {
    const { actionHideNewCarFilterPrice, actionSelectNewCarFilterPrice } = this.props;

    actionHideNewCarFilterPrice();

    if (prices) {
      actionSelectNewCarFilterPrice(prices);
    }
  }

  onPressBody = () => this.props.navigation.navigate('NewCarFilterBodyScreen')

  onPressGearbox = () => this.props.navigation.navigate('NewCarFilterGearboxScreen')

  onPressEngineType = () => this.props.navigation.navigate('NewCarFilterEngineTypeScreen')

  onPressDrive = () => this.props.navigation.navigate('NewCarFilterDriveScreen')

  onPressFilterButton = (count) => {
    const { items, navigation, isFetchingNewCarByFilter } = this.props;

    if (!count) {
      return setTimeout(() => Alert.alert('Не найдено ни одного авто'), 100);
    }

    if (!isFetchingNewCarByFilter) {
      const total = get(items, 'total');
      navigation.navigate('NewCarListScreen', { total });
    }
  }

  getCount = () => {
    const {
      items,
      filterBrands,
      filterModels,
      filterBody,
      filterGearbox,
      filterDrive,
      filterEngineType,
      filterPrice,
      filterData,
    } = this.props;
    const filterDataCount = get(filterData, 'total.count');
    const filterCount = get(items, 'total.count');

    let isItemsCount = [
      filterBrands,
      filterModels,
      filterBody,
      filterGearbox,
      filterDrive,
      filterEngineType,
    ].some(filter => filter.length !== 0);

    if (filterPrice) {
      isItemsCount = true;
    }

    return isItemsCount ? filterCount : filterDataCount;
  }

  render() {
    const {
      city,
      items,
      filterBrands,
      filterModels,
      filterBody,
      filterGearbox,
      filterDrive,
      filterEngineType,
      filterPrice,
      filterData,
      navigation,
      dealerSelected,
      isFetchingFilterData,
      isFetchingNewCarByFilter,
    } = this.props;

    console.log('== NewCarFilterScreen ==');

    if (!filterData || isFetchingFilterData) {
      return (
        <View style={styles.spinnerContainer} >
          <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
        </View>
      );
    }

    const minPrice = get(items, 'prices.min') || get(filterData, 'prices.min');
    const maxPrice = get(items, 'prices.max') || get(filterData, 'prices.max');
    const minPriceByFilter = get(filterPrice, 'minPrice');
    const step = get(items, 'prices.step') || get(filterData, 'prices.step');
    const currency = get(filterData, 'prices.curr.name');
    const count = this.getCount();

    if (get(filterData, 'total.count') === 0) {
      return (
        <View style={styles.content}>
          <CityItemList
            navigation={navigation}
            cityName={city.name}
            cityData={this.getCityData()}
            returnScreen="NewCarFilterScreen"
          />
          <EmptyMessage text={TEXT_EMPTY_CAR_LIST} />
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
                  {
                    filterModels.length !== 0 &&
                      <Text style={styleListProfile.listItemValue}>
                        {`Выбрано: ${filterModels.length}`}
                      </Text>
                  }
                  <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                </Right>
              </ListItem>
            </View>

            <PricePicker
              style={styles.icon}
              min={minPrice}
              max={maxPrice}
              step={step}
              currentMinPrice={filterPrice && filterPrice.minPrice}
              currentMaxPrice={filterPrice && filterPrice.maxPrice}
              currency={currency}
              onPressModal={this.onPressPrice}
              onCloseModal={this.onClosePrice}
              TouchableComponent={TouchableHighlight}
            >
              <View style={styleListProfile.listItemContainer}>
                <View style={styles.hiddenListItemContainer} />
                <ListItem button={false} style={styleListProfile.listItemPressable}>
                  <Body style={styles.body} >
                    <Label style={styleListProfile.label}>Цена</Label>
                  </Body>
                  <Right style={styles.right}>
                    {
                      <Text style={styleListProfile.listItemValue}>
                        {`от ${minPriceByFilter || minPrice} ${currency}`}
                      </Text>
                    }
                    <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                  </Right>
                </ListItem>
              </View>
            </PricePicker>

            <View style={[
              styles.listItemContainer,
              styleListProfile.listItemContainer,
            ]}>
              <ListItem style={styleListProfile.listItemPressable} onPress={this.onPressBody}>
                <Body style={styles.body} >
                  <Label style={styleListProfile.label}>Тип кузова</Label>
                </Body>
                <Right style={styles.right}>
                    {
                      filterBody.length !== 0 &&
                        <Text style={styleListProfile.listItemValue}>
                          {`Выбрано: ${filterBody.length}`}
                        </Text>
                    }
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
                  {
                    filterGearbox.length !== 0 &&
                      <Text style={styleListProfile.listItemValue}>
                        {`Выбрано: ${filterGearbox.length}`}
                      </Text>
                  }
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
                  {
                    filterEngineType.length !== 0 &&
                      <Text style={styleListProfile.listItemValue}>
                        {`Выбрано: ${filterEngineType.length}`}
                      </Text>
                  }
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
                  {
                    filterDrive.length !== 0 &&
                      <Text style={styleListProfile.listItemValue}>
                        {`Выбрано: ${filterDrive.length}`}
                      </Text>
                  }
                  <Icon name="arrow-forward" style={styleListProfile.iconArrow} />
                </Right>
              </ListItem>
            </View>
          </Content>
          <Footer style={styles.footer}>
            <Button onPress={() => this.onPressFilterButton(count)} full style={styles.button}>
              {
                isFetchingNewCarByFilter ?
                  (
                    <ActivityIndicator color="#fff" style={styles.spinnerButton} />
                  ) :
                  (
                    <View style={styles.buttonContent} >
                      <Text style={styles.buttonText}>
                        {`НАЙДЕНО ${count}`}
                      </Text>
                      <Image
                        source={require('../../../core/components/CustomIcon/assets/arrow-right.png')}
                        style={styles.buttonIcon}
                      />
                    </View>
                  )
              }
            </Button>
          </Footer>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterScreen);
