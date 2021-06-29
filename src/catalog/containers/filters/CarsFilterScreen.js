/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {
  Container,
  Row,
  Button,
  Icon,
  Segment,
  Content,
  Text,
  Card,
  CardItem,
  Right,
  StyleProvider,
} from 'native-base';
import getTheme from '../../../../native-base-theme/components';
import {verticalScale} from '../../../utils/scale';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import styleConst from '../../../core/style-const';
// redux
import {connect} from 'react-redux';
import API from '../../../utils/api';
import {
  actionFetchNewCarByFilter,
  actionFetchNewCarFilterData,
  actionShowNewCarFilterPrice,
  actionHideNewCarFilterPrice,
  actionSelectNewCarFilterPrice,
  actionSetNewCarFilterPriceSpecial,
  actionSaveCarFilters,
  // actionSelectNewCarFilterModels,
} from '../../actions';

// helpers
import Analytics from '../../../utils/amplitude-analytics';
import {get} from 'lodash';
import showPrice from '../../../utils/price';
import {ScrollView} from 'react-native-gesture-handler';

import {strings} from '../../../core/lang/const';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.accordeonGrey1,
    borderWidth: 0,
  },
  footer: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  row: {
    backgroundColor: styleConst.color.white,
    marginBottom: 2,
    height: 65,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  cardItem: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'space-between',
    flex: 1,
  },
  segmentWrapper: {
    alignItems: 'center',
  },
  segmentTab: {
    justifyContent: 'center',
    alignContent: 'center',
    height: 40,
  },
  segmentTabTwo: {
    width: '50%',
  },
  segmentButtonText: {
    fontFamily: styleConst.font.regular,
    fontSize: 15,
  },
  resultButton: {
    width: '90%',
    marginHorizontal: '5%',
    position: 'absolute',
    bottom: 30,
  },
  resultButtonText: {
    textTransform: 'uppercase',
  },
});

const _animated = {
  SubmitButton: new Animated.Value(1),
  duration: 250,
};

const mapStateToProps = ({catalog, dealer}) => {
  return {
    dealerSelected: dealer.selected,
    listRussiaByCities: dealer.listRussiaByCities,
    listBelarussiaByCities: dealer.listBelarussiaByCities,
    listUkraineByCities: dealer.listUkraineByCities,

    items: catalog.newCar.items,
    filterData: catalog.newCar.filterData || {},
    filterGearbox: catalog.newCar.filterGearbox,
    filterDrive: catalog.newCar.filterDrive,
    filterEngineType: catalog.newCar.filterEngineType,
    filterPriceSpecial: catalog.newCar.filterPriceSpecial,

    city: catalog.newCar.city,
    needFetchFilterData: catalog.newCar.meta.needFetchFilterData,
    needFetchFilterDataAfterCity:
      catalog.newCar.meta.needFetchFilterDataAfterCity,
    isFetchingFilterData: catalog.newCar.meta.isFetchingFilterData,
    isFetchingNewCarByFilter: catalog.newCar.meta.isFetchingNewCarByFilter,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // actionFetchCars: (stockType) => {
    //   return dispatch(actionFetchCars(stockType));
    // },
  };
};

const CarsFilterScreen = ({
  navigation,
  route,
  dealerSelected,
  stockTypeDefault,
}) => {
  const [loading, setLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);
  const [totalCars, setTotalCars] = useState(null);
  const [stockType, setStockType] = useState(
    route?.params?.stockTypeDefault
      ? route.params.stockTypeDefault
      : stockTypeDefault,
  );

  const _showHideSubmitButton = show => {
    if (show) {
      Animated.timing(_animated.SubmitButton, {
        toValue: 1,
        duration: _animated.duration,
        useNativeDriver: true,
      }).start(() => {
        setLoading(false);
        setStockLoading(false);
      });
    } else {
      Animated.timing(_animated.SubmitButton, {
        toValue: 0,
        duration: _animated.duration,
        useNativeDriver: true,
      }).start(() => {
        setLoading(true);
        setStockLoading(true);
      });
    }
  };

  const _fetchCarsAPI = stockType => {
    _showHideSubmitButton(false);
    switch (stockType) {
      case 'New':
        API.fetchNewCarFilterData({
          city: dealerSelected.city.id,
        }).then(res => {
          setTotalCars(res.total.count);
          _showHideSubmitButton(true);
        });
        break;
      case 'Used':
        API.fetchUsedCar({
          city: dealerSelected.city.id,
        }).then(res => {
          setTotalCars(res.total.count);
          _showHideSubmitButton(true);
        });
        break;
    }
  };

  const updateStock = stockType => {
    setTotalCars(null);
    setStockLoading(true);
    setStockType(stockType);
  };

  const _onSubmitButtonPress = () => {
    switch (stockType) {
      case 'New':
        navigation.navigate('NewCarListScreen');
        break;
      case 'Used':
        navigation.navigate('UsedCarListScreen');
        break;
    }
  };

  useEffect(() => {
    _fetchCarsAPI(stockType);
  }, [stockType]);

  return (
    <Container style={styles.container}>
      <Segment style={[styles.row, styles.segmentWrapper]}>
        <Button
          first
          style={[styles.segmentTab, styles.segmentTabTwo]}
          onPress={() => {
            updateStock('New');
          }}
          active={stockType === 'New' ? true : false}>
          <Text style={styles.segmentButtonText}>
            {strings.NewCarListScreen.titleShort}
          </Text>
        </Button>
        <Button
          last
          style={[styles.segmentTab, styles.segmentTabTwo]}
          onPress={() => {
            updateStock('Used');
          }}
          active={stockType === 'Used' ? true : false}>
          <Text style={styles.segmentButtonText}>
            {strings.UsedCarListScreen.titleShort}
          </Text>
        </Button>
      </Segment>
      <Content>
        <Card noShadow style={[styles.row]}>
          <CardItem
            button
            onPress={() => {
              navigation.navigate('BrandModelsFilterScreen');
            }}
            style={styles.cardItem}>
            <Text>{strings.CarsFilterScreen.chooseBrandModel}</Text>
            <Right>
              <Icon name="chevron-forward" />
            </Right>
          </CardItem>
        </Card>
      </Content>
      {stockLoading ? (
        <ActivityIndicator
          color={styleConst.color.blue}
          style={[styles.resultButton, styleConst.spinner]}
          size="small"
        />
      ) : !loading ? (
        <Animated.View
          style={{
            opacity: _animated.SubmitButton,
          }}>
          <Button
            block
            style={[styles.resultButton]}
            disabled={!totalCars ? true : false}
            active={totalCars ? true : false}
            onPress={() => {
              _onSubmitButtonPress();
            }}>
            <Text style={styles.resultButtonText}>
              {totalCars
                ? `${strings.CarsFilterScreen.resultsButton.show} ${totalCars} авто`
                : `Нет предложений`}
            </Text>
          </Button>
        </Animated.View>
      ) : null}
    </Container>
  );
};

CarsFilterScreen.defaultProps = {
  stockTypeDefault: 'New',
};

export default connect(mapStateToProps, mapDispatchToProps)(CarsFilterScreen);
