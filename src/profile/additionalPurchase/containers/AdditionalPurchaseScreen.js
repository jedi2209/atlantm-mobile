import React, {useEffect, useState, useReducer} from 'react';
import {connect} from 'react-redux';
import {View, ActivityIndicator} from 'react-native';

import { List, Divider } from 'react-native-paper';
import { Container, Segment, Content, Button, Text} from 'native-base';

import API from '../../../utils/api';

import {dayMonthYear} from '../../../utils/date';
import showPrice from '../../../utils/price';
import {strings} from '../../../core/lang/const';

import styleConst from '../../../core/style-const';


const mapStateToProps = ({profile}) => {
  return {
    insurance: profile.insurance || [],
    additionalPurchase: profile.additionalPurchase || [],
    cars: profile.cars || [],
    SAPuser: {
      id: profile.login.SAP.ID,
      token: profile.login.SAP.TOKEN,
    },
  };
};

const tabsData = ['cars', 'additionalPurchase', 'insurance'];

const AdditionalPurchaseScreen = ({SAPuser, cars, additionalPurchase, insurance}) => {
  const [activeTab, setActiveTab] = useState(tabsData[tabsData.length / 2 | 0]);
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
            return ( 
              <>
                <List.Item
                  key={'cars' + val.vin}
                  title={[val.brand, val.model].join(' ')}
                  description={[[dayMonthYear(val.purchaseData[0].date), val.purchaseData[0].dealer.name].join(', '), 'VIN: ' + val.vin].join('\r\n')}
                  left={props => <List.Icon {...props} icon="car-sports" />}
                  right={props => <View style={{justifyContent: 'center'}}><Text style={{textAlignVertical: 'center'}}>{showPrice(val.purchaseData[0].price.total.value, val.purchaseData[0].price.total.curr)}</Text></View>}
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
            return row.data.map(valData => {
              return (
                <>
                  <List.Item
                    key={'additionalPurchase' + valData.doc}
                    title={[valData.name, [valData.count, valData.units].join(' ')].join(', ')}
                    description={dayMonthYear(row.val.date)}
                    left={props => <List.Icon {...props} icon="cart-outline" />}
                    right={props => <View style={{justifyContent: 'center'}}><Text style={{textAlignVertical: 'center'}}>{showPrice(row.val.price.base.total, row.val.price.base.curr, true)}</Text></View>}
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
          return (
            <>
              <List.Item
                  key={'insurance' + val.doc}
                  title={val.detail[0].name}
                  description={[dayMonthYear(val.date), 'VIN: ' + val.car.vin].join('\r\n')}
                  left={props => <List.Icon {...props} icon="file-document-outline" />}
                  right={props => <View style={{justifyContent: 'center'}}><Text style={{textAlignVertical: 'center'}}>{showPrice(val.detail[0].price.base.total, val.detail[0].price.base.curr, true)}</Text></View>}
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
        {tabsData.map((val, index) => {
          if (val && val.length) {
            return (
              <Button onPress={() => setActiveTab(val)} active={activeTab === val ? true : false} first={index === 0 ? true : false} last={index === tabsData.length-1 ? true : false}>
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
