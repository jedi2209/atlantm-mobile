import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {View, ActivityIndicator} from 'react-native';

import { List, Divider } from 'react-native-paper';
import { Container, Segment, Content, Button, Text} from 'native-base';

import API from '../../../utils/api';

import {dayMonthYear} from '../../../utils/date';
import showPrice from '../../../utils/price';
import {strings} from '../../../core/lang/const';
import {get} from 'lodash';

import styleConst from '../../../core/style-const';


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

const AdditionalPurchaseScreen = ({SAPuser, cars, additionalPurchase, insurance, allData}) => {
  const allDataFilter = Object.keys(allData).filter(key => allData[key].length);
  const [activeTab, setActiveTab] = useState(allDataFilter[allDataFilter.length / 2 | 0]);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setLoading(true);
    renderTab(activeTab);
    // return () => {
    // }
  }, [activeTab]);

  const renderTab = tab => {
    switch (tab) {
      case 'cars':
        setData(cars.map(val => {
          const vin = get(val, 'vin');
          const date = get(val, 'purchaseData[0].date');
          const dealerName = get(val, 'purchaseData[0].dealer.name');
          const price = get(val, 'purchaseData[0].price.total');
            return ( 
              <>
                <List.Item
                  key={'cars' + vin}
                  title={[get(val, 'brand'), get(val, 'model')].filter(key => key !== null).join(' ')}
                  description={[[dayMonthYear(date), dealerName].filter(key => key !== null).join(', '), vin ? 'VIN: ' + vin : null].filter(key => key !== null).join('\r\n')}
                  left={props => <List.Icon {...props} icon="car-sports" />}
                  right={props => {
                    if (price) {
                      return (<View style={{justifyContent: 'center'}}><Text style={{textAlignVertical: 'center'}}>{showPrice(price.value, price.curr)}</Text></View>); 
                    }}}
                />
                <Divider />
              </>
            );
        }));
        setTimeout(() => setLoading(false), 300);
        break;
      case 'additionalPurchase':
        additionalPurchaseData = [];
        additionalPurchase.map(val => {
          additionalPurchaseData.push(getDataAdditionalPurchase(val, SAPuser).then((res) => {
            return {val, data: res.data};
          }));
        });
        Promise.all(additionalPurchaseData).then(value => {
          return setData(value.map(row => {
            const date = get(row, 'val.date');
            const price = get(row, 'val.price.base');
            const manager = get(row, 'val.manager');
            const dealer = get(row, 'val.dealer');
            return row.data.map(valData => {
              return (
                <>
                  <List.Item
                    key={'additionalPurchase' + get(valData, 'doc', Date.now())}
                    titleNumberOfLines={2}
                    descriptionNumberOfLines={3}
                    title={[get(valData, 'name'), [get(valData, 'count'), get(valData, 'units')].filter(key => key !== null).join(' ')].join(', ')}
                    description={[dayMonthYear(date), dealer.name, '', manager].join('\r\n')}
                    // description={[dayMonthYear(date), dealer.name, '', manager ? 'менеджер: ' + manager : null].join('\r\n')}
                    left={props => <List.Icon {...props} icon="cart-outline" />}
                    right={props => {
                      if (price) {
                        return (<View style={{justifyContent: 'center'}}><Text style={{textAlignVertical: 'center'}}>{showPrice(price.total, price.curr, true)}</Text></View>);
                      }
                    }}
                  />
                  <Divider />
                </>
              );
            });
          }));
        }).then(() => {
          setLoading(false);
        });
        break;
      case 'insurance':
        setData(insurance.map(val => {
          const name = get(val, 'detail[0].name');
          const date = get(val, 'date');
          const VIN = get(val, 'car.vin');
          const dealerName = get(val, 'purchaseData[0].dealer.name');
          const price = get(val, 'detail[0].price.base');
          return (
            <>
              <List.Item
                  key={'insurance' + val.doc}
                  title={name}
                  titleNumberOfLines={2}
                  description={[dayMonthYear(date), VIN ? 'VIN: ' + VIN : null].filter(key => key !== null).join('\r\n')}
                  left={props => <List.Icon {...props} icon="file-document-outline" />}
                  right={props => {
                    if (price) {
                      return (<View style={{justifyContent: 'center'}}><Text style={{textAlignVertical: 'center'}}>{showPrice(price.total, price.curr, true)}</Text></View>);
                  }}}
                />
              <Divider />
            </>
          );
        }));
        setTimeout(() => setLoading(false), 300);
        break;
      default: return <></>;
    }
  };

  async function getDataAdditionalPurchase(val, SAPuser) {
    const res = await API.fetchAdditionalPurchaseItem({item: val.doc, userid: SAPuser.id, token: SAPuser.token, dealer: val.dealer.id});
    return res;
  };

  return (
    <Container>
      <Segment>
        {Object.keys(allData).map((val, index) => {
          if (allData[val] && allData[val].length > 0) {
            return (
              <Button onPress={() => setActiveTab(val)} active={activeTab === val ? true : false} first={index === 0 ? true : false} last={index === Object.keys(allData).length-1 ? true : false}>
                <Text>{strings.AdditionalPurchaseScreen.tabs[val]}</Text>
              </Button>
              );
          }
        })}
      </Segment>
      <Content>
        {isLoading ? (<ActivityIndicator color={styleConst.color.blue} style={styleConst.spinner} />) : data}
      </Content>
    </Container>
  );
};

export default connect(mapStateToProps)(AdditionalPurchaseScreen);
