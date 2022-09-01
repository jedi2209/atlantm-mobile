import React, {useEffect, useState, useReducer} from 'react';
import {connect} from 'react-redux';
import {ActivityIndicator} from 'react-native';

import {
  List,
  Divider,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {Box, View, Button, Text, ScrollView} from 'native-base';

import API from '../../../utils/api';

import {dayMonthYear} from '../../../utils/date';
import showPrice from '../../../utils/price';
import {strings} from '../../../core/lang/const';
import {get} from 'lodash';

import styleConst from '../../../core/style-const';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: styleConst.color.blue,
  },
};

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
    // return () => {
    // }
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
          if (!price) {
            return false;
          }
          return (
            <>
              <List.Item
                key={'cars' + vin}
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
                left={props => <List.Icon {...props} icon="car-sports" />}
                right={props => {
                  if (price) {
                    return (
                      <View style={{justifyContent: 'center'}}>
                        <Text style={{textAlignVertical: 'center'}}>
                          {showPrice(price.value, price.curr)}
                        </Text>
                      </View>
                    );
                  }
                }}
              />
              <Divider />
            </>
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
            const key =
              'additionalPurchaseData' + get(row, 'val.doc', date + priceTotal);
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
                  id={key}>
                  {row.data.map(valData => {
                    const price = get(valData, 'price.base');
                    return (
                      <>
                        <List.Item
                          key={
                            'additionalPurchaseItem' +
                            get(valData, 'doc', Date.now())
                          }
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
                            <List.Icon {...props} icon="cart-outline" />
                          )}
                          right={props => {
                            if (price) {
                              return (
                                <View style={{justifyContent: 'center'}}>
                                  <Text style={{textAlignVertical: 'center'}}>
                                    {showPrice(price.total, price.curr, true)}
                                  </Text>
                                </View>
                              );
                            }
                          }}
                        />
                        <Divider />
                      </>
                    );
                  })}
                </List.Accordion>
              );
            }
          });
        break;
      case 'insurance':
        render = insurance.map(val => {
          const name = get(val, 'detail[0].name');
          const date = get(val, 'date');
          const VIN = get(val, 'car.vin');
          const manager = get(val, 'manager');
          const dealerName = get(val, 'dealer.name');
          const price = get(
            val,
            'detail[0].price.base',
            get(val, 'price.base'),
          );
          return (
            <>
              <List.Item
                key={'insurance' + val.doc}
                title={name}
                titleNumberOfLines={2}
                descriptionNumberOfLines={4}
                description={[
                  dayMonthYear(date),
                  dealerName,
                  VIN ? 'VIN: ' + VIN : null,
                  manager,
                ]
                  .filter(key => key !== null)
                  .join('\r\n')}
                left={props => (
                  <List.Icon {...props} icon="file-document-outline" />
                )}
                right={props => {
                  if (price) {
                    return (
                      <View style={{justifyContent: 'center'}}>
                        <Text style={{textAlignVertical: 'center'}}>
                          {showPrice(price.total, price.curr, true)}
                        </Text>
                      </View>
                    );
                  }
                }}
              />
              <Divider />
            </>
          );
        });
        break;
      default:
        return <></>;
    }
    return render;
  };

  async function getDataAdditionalPurchase(val, SAPuser) {
    const res = await API.fetchAdditionalPurchaseItem({
      item: val.doc,
      userid: SAPuser.id,
      token: SAPuser.token,
      dealer: val.dealer.id,
    });
    return res;
  }

  return (
    <PaperProvider theme={theme}>
      <View bg="white" flex={1}>
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
                    onPress={() => setActiveTab(val)}
                    isPressed={activeTab === val ? true : false}
                    variant={activeTab === val ? 'solid' : 'outline'}
                    // isLoading={activeTab === val && isLoading ? true : false}
                    // isLoadingText={strings.AdditionalPurchaseScreen.tabs[val]}
                    _spinner={{color: 'white'}}
                    _text={{textTransform: 'uppercase'}}>
                    {strings.AdditionalPurchaseScreen.tabs[val]}
                  </Button>
                );
              })}
            </Button.Group>
          </Box>
        ) : null}
        <ScrollView pb={7} mt={16}>
          {isLoading ? (
            <ActivityIndicator
              color={styleConst.color.blue}
              style={styleConst.spinner}
            />
          ) : (
            renderTab(activeTab)
          )}
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default connect(mapStateToProps)(AdditionalPurchaseScreen);
