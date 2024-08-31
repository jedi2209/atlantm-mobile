import React, {useEffect, useState, useReducer} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import {List, Divider} from 'react-native-paper';
import {Box, View, Button, Text, ScrollView} from 'native-base';

import API from '../../../utils/api';

import {dayMonthYear, getTimestamp} from '../../../utils/date';
import {showPrice} from '../../../utils/price';
import {strings} from '../../../core/lang/const';
import {get} from 'lodash';

import styleConst from '../../../core/style-const';
import LogoLoader from '../../../core/components/LogoLoader';

const initialState = {};

function reducer(state = initialState, item) {
  let res = {};
  if (typeof state[item] === 'undefined') {
    Object.assign(res, state, {
      [item]: false,
    });
  } else {
    Object.assign(res, state, {
      [item]: !state[item],
    });
  }
  return res;
}

const mapStateToProps = ({profile}) => {
  return {
    insurance: profile.insurance || [],
    additionalPurchase: profile.additionalPurchase || [],
    cars: profile.cars || [],
    allData: {
      cars: profile.cars || [],
      additionalPurchase: profile.additionalPurchase || [],
      insurance: profile.insurance || [],
    },
    SAPuser: {
      id: profile.login.SAP.ID,
      token: profile.login.SAP.TOKEN,
    },
  };
};

const styles = StyleSheet.create({
  justifyContent: {
    justifyContent: 'center',
  },
  textAlignVertical: {
    textAlignVertical: 'center',
  },
});

const RightColumn = ({price = null, keyVal = null, float = false}) => {
  if (!price) {
    return;
  }
  return (
    <View style={styles.justifyContent} key={keyVal}>
      <Text style={styles.textAlignVertical}>
        {showPrice(price.value, price.curr, float)}
      </Text>
    </View>
  );
};

const AdditionalPurchaseScreen = ({
  SAPuser,
  cars,
  additionalPurchase,
  insurance,
  allData,
}) => {
  let res = [];
  const allDataFilter = Object.keys(allData).filter(key => {
    res[key] = allData[key].filter(item => {
      switch (key) {
        case 'cars':
          const price = get(item, 'purchaseData[0].price.total', false);
          if (!price) {
            return false;
          }
          break;
        case 'additionalPurchase':
        case 'insurance':
        default:
          break;
      }
      return true;
    });
    return res[key].length;
  });
  const [activeTab, setActiveTab] = useState(
    allDataFilter[(allDataFilter.length / 2) | 0],
  );
  const [expandedState, expand] = useReducer(reducer, initialState);
  const [isLoading, setLoading] = useState(false);
  const [externalData, setExternalData] = useState([]);

  useEffect(() => {
    if (activeTab === 'additionalPurchase') {
      getPurchase();
    }
  }, [activeTab]);

  const getPurchase = async () => {
    setLoading(true);
    let additionalPurchaseData = [];
    additionalPurchase.map(val => {
      additionalPurchaseData.push(
        getDataAdditionalPurchase(val, SAPuser).then(res => {
          return {val, data: res.data};
        }),
      );
    });
    Promise.all(additionalPurchaseData).then(res => {
      setLoading(false);
      return setExternalData(res);
    });
  };

  const renderTab = tab => {
    let render = <></>;
    switch (tab) {
      case 'cars':
        render = cars.map(val => {
          const vin = get(val, 'vin');
          const date = get(val, 'purchaseData[0].date');
          const dealerName = get(val, 'purchaseData[0].dealer.name');
          const manager = get(val, 'purchaseData[0].manager');
          const price = get(val, 'purchaseData[0].price.total');
          const key = vin + date + price;
          if (!price) {
            return false;
          }
          return (
            <View key={'viewCars' + key}>
              <List.Item
                key={'cars' + key}
                titleNumberOfLines={2}
                descriptionNumberOfLines={4}
                title={[get(val, 'brand'), get(val, 'model')]
                  .filter(key => key !== null)
                  .join(' ')}
                description={[
                  [dayMonthYear(date)].filter(key => key !== null).join(', '),
                  dealerName,
                  vin ? 'VIN: ' + vin : null,
                  manager,
                ]
                  .filter(key => key !== null)
                  .join('\r\n')}
                left={props => (
                  <List.Icon
                    {...props}
                    key={'LeftIconCars' + key}
                    icon="car-sports"
                  />
                )}
                right={props => (
                  <RightColumn price={price} keyVal={'RightColumnCars' + key} />
                )}
              />
              <Divider key={'dividerCars' + key} />
            </View>
          );
        });
        break;
      case 'additionalPurchase':
        render = externalData
          .filter(key => key !== null)
          .map(row => {
            const date = get(row, 'val.date');
            const priceTotal = get(row, 'val.price.base');
            const manager = get(row, 'val.manager');
            const docNumber = get(row, 'val.doc');
            const dealerName = get(row, 'val.dealer.name');
            const key = get(row, 'val.doc', date + priceTotal);
            if (row && row.data) {
              return (
                <List.Accordion
                  title={[
                    docNumber ? '#' + docNumber : null,
                    dayMonthYear(date),
                  ]
                    .filter(key => key !== null)
                    .join(', ')}
                  description={[manager, dealerName]
                    .filter(key => key !== null)
                    .join(', ')}
                  expanded={
                    typeof expandedState[key] === 'undefined'
                      ? true
                      : expandedState[key]
                  }
                  onPress={() => expand(key)}
                  onLongPress={() => expand(key)}
                  key={'additionalPurchaseData' + key}
                  id={key}>
                  {row.data.map(valData => {
                    const price = get(valData, 'price.base');
                    const keyItem = get(valData, 'doc', getTimestamp());
                    return (
                      <View key={'viewAdditionalPurchaseItem' + keyItem}>
                        <List.Item
                          key={'additionalPurchaseItem' + keyItem}
                          titleNumberOfLines={2}
                          descriptionNumberOfLines={3}
                          title={[
                            get(valData, 'name'),
                            [
                              get(valData, 'count'),
                              get(valData, 'units', '').toLowerCase(),
                            ]
                              .filter(key => key !== null)
                              .join(' '),
                          ].join(', ')}
                          // description={[dayMonthYear(date), dealerName, '', manager].join('\r\n')}
                          // description={[dayMonthYear(date), dealerName, '', manager ? 'менеджер: ' + manager : null].join('\r\n')}
                          left={props => (
                            <List.Icon
                              {...props}
                              key={'LeftIconPurch' + key}
                              icon="cart-outline"
                            />
                          )}
                          right={props => (
                            <RightColumn
                              price={price}
                              keyVal={'RightColumnPurhc' + key}
                              float={true}
                            />
                          )}
                        />
                        <Divider key={'dividerPurchase' + key} />
                      </View>
                    );
                  })}
                </List.Accordion>
              );
            }
          });
        break;
      case 'insurance':
        render = insurance.map(val => {
          const name = get(val, 'name', get(val, 'detail[0].name', null));
          const date = get(val, 'date.contract', get(val, 'date.from', 'date'));
          const VIN = get(val, 'car.vin');
          const manager = get(val, 'manager');
          const supplier = get(val, 'supplier');
          const dealerName = get(val, 'dealer.name');
          const price = get(
            val,
            'detail[0].price.base',
            get(val, 'price.base'),
          );
          const key =
            get(val, 'doc', getTimestamp()) +
            get(val, 'number', getTimestamp()) +
            date +
            VIN;
          return (
            <View key={'viewInsurance' + key}>
              <List.Item
                key={'insurance' + key}
                title={name}
                titleNumberOfLines={name ? 2 : 1}
                descriptionNumberOfLines={4}
                description={[
                  dayMonthYear(date),
                  dealerName,
                  VIN ? 'VIN: ' + VIN : null,
                  supplier ? supplier : manager,
                ]
                  .filter(key => key !== null)
                  .join('\r\n')}
                left={props => (
                  <List.Icon
                    {...props}
                    key={'LeftIconIns' + key}
                    icon="file-document-outline"
                  />
                )}
                right={props => (
                  <RightColumn
                    price={price}
                    keyVal={'RightColumnIns' + key}
                    float={true}
                  />
                )}
              />
              <Divider key={'dividerIns' + key} />
            </View>
          );
        });
        break;
      default:
        return <></>;
    }
    return render;
  };

  async function getDataAdditionalPurchase(val, SAPuser) {
    return await API.fetchAdditionalPurchaseItem({
      item: val.doc,
      userid: SAPuser.id,
      token: SAPuser.token,
      dealer: val.dealer.id,
    });
  }

  return (
    <View bg={styleConst.color.white} flex={1}>
      {allDataFilter.length > 1 ? (
        <Box px="3" py="2" position={'absolute'} w="100%" zIndex={1000}>
          <Button.Group
            isAttached
            colorScheme={'blue'}
            mx={{
              base: 'auto',
              md: 0,
            }}
            shadow="5"
            size="md">
            {allDataFilter.map((val, index) => {
              return (
                <Button
                  key={'buttonTab' + index}
                  onPress={() => setActiveTab(val)}
                  isPressed={activeTab === val ? true : false}
                  variant={activeTab === val ? 'solid' : 'outline'}
                  _spinner={{color: styleConst.color.white}}
                  _text={{textTransform: 'uppercase'}}>
                  {strings.AdditionalPurchaseScreen.tabs[val]}
                </Button>
              );
            })}
          </Button.Group>
        </Box>
      ) : null}
      <ScrollView pb={7} mt={allDataFilter.length > 1 ? 16 : 2}>
        {isLoading ? <LogoLoader mode={'relative'} /> : renderTab(activeTab)}
      </ScrollView>
    </View>
  );
};

export default connect(mapStateToProps)(AdditionalPurchaseScreen);
