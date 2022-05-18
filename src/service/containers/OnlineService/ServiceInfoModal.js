import React, {useState} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {Content, Row, Col, Tab, Tabs, DefaultTabBar, Button} from 'native-base';

import showPrice from '../../../utils/price';
import styleConst from '../../../core/style-const';
import isIPhoneX from '../../../utils/is_iphone_x';
import {strings} from '../../../core/lang/const';
import style from '../../../core/components/Lists/style';

const ServiceInfoModal = ({onClose, data, route, navigation, type}) => {
  if (!data || typeof data === 'undefined') {
    data = route.params.data;
  }
  if (!type || typeof type === 'undefined') {
    type = route.params.type;
  }
  if (!onClose || typeof onClose === 'undefined') {
    onClose = () => navigation.goBack();
    if (route.params.onClose) {
      onClose = () => route.params.onClose;
    }
  }
  if (data && (!data.works || !data.works.length)) {
    data.works = [];
  }

  const modalStyles = StyleSheet.create({
    host: {
      margin: 0,
      marginTop: isIPhoneX() ? 52 : 0,
    },
    container: {
      flex: 1,
      backgroundColor: styleConst.color.white,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    wrapper: {
      paddingHorizontal: '5%',
      paddingVertical: 10,
    },
    tabContainer: {
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: '#d8d8d8',
    },
    tabButton: {
      borderColor: 'transparent',
      width: '50%',
      justifyContent: 'center',
      height: 46,
    },
    tabButtonText: {
      fontSize: 18,
      color: styleConst.color.greyText,
    },
    tabButtonActiveText: {
      color: styleConst.color.lightBlue,
    },
    content: {
      flex: 1,
      marginBottom: 16,
    },
    button: {
      backgroundColor: styleConst.color.lightBlue,
      justifyContent: 'center',
      borderRadius: 5,
    },
    buttonText: {
      color: styleConst.color.white,
      textTransform: 'uppercase',
      fontSize: 16,
    },
    TabsTextStyle: {
      color: '#000',
    },
    TabsActiveTextStyle: {
      color: styleConst.color.lightBlue,
    },
  });

  const renderTabBar = props => {
    props.tabStyle = Object.create(props.tabStyle);
    return <DefaultTabBar {...props} />;
  };

  return (
    <View style={modalStyles.container}>
      <SafeAreaView style={{flex: 1}}>
        <Tabs
          renderTabBar={renderTabBar}
          tabBarUnderlineStyle={{
            backgroundColor: styleConst.color.lightBlue,
          }}>
          {data.works && data.works.length ? (
            <Tab
              heading={strings.CarHistoryDetailsScreen.works}
              textStyle={modalStyles.TabsTextStyle}
              activeTextStyle={modalStyles.TabsActiveTextStyle}
              activeTabStyle={modalStyles.TabsActiveTabStyle}>
              <ServiceTable data={data.works} type={type} />
            </Tab>
          ) : null}
          {data.parts && data.parts.length ? (
            <Tab
              heading={strings.CarHistoryDetailsScreen.materials}
              textStyle={modalStyles.TabsTextStyle}
              activeTextStyle={modalStyles.TabsActiveTextStyle}
              activeTabStyle={modalStyles.TabsActiveTabStyle}>
              <ServiceTable data={data.parts} type={type} />
            </Tab>
          ) : null}
        </Tabs>
        <View style={modalStyles.wrapper}>
          <Button size="full" full style={modalStyles.button} onPress={onClose}>
            <Text style={modalStyles.buttonText}>OK</Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

const ServiceTable = ({data, type}) => {
  data = data.filter(el => {
    if ((el.name === '' || !el.name) && el.summ === 0) {
      return false;
    }
    return true;
  });
  switch (type) {
    case 'required':
      data = data.filter(el => {
        if (el.required) {
          return true;
        }
        return false;
      });
      break;
    case 'recommended':
      data = data.filter(el => {
        if (el.required) {
          return false;
        }
        return true;
      });
      break;
    default:
      data = data.filter(el => {
        if ((el.name === '' || !el.name) && el.summ === 0) {
          return false;
        }
        return true;
      });
      break;
  }
  return (
    <Content>
      {data.map(({name, quantity, unit, summ, currency, required}, cnt) => (
        <View
          style={tableStyles.section}
          key={'ServiceTable' + cnt + quantity + summ}>
          {name ? <Text style={tableStyles.sectionTitle}>{name}</Text> : null}
          {quantity && unit ? (
            <ServiceTableItem label={strings.CarHistoryDetailsScreen.count}>
              {unit === 'сек'
                ? quantity / 60 / 60 + ' ч.'
                : [quantity, unit].join(' ')}
            </ServiceTableItem>
          ) : null}
          {summ && currency.name ? (
            <ServiceTableItem label={strings.CarHistoryDetailsScreen.price}>
              {showPrice(summ, currency.name)}
            </ServiceTableItem>
          ) : null}
        </View>
      ))}
      {type && type !== 'required' && type !== 'recommended' ? (
        <Text style={tableStyles.textRequired}>
          * отмечены обязательные работы и з/ч
        </Text>
      ) : null}
    </Content>
  );
};

const ServiceTableItem = ({label, children}) => (
  <Row style={tableStyles.sectionRow}>
    <Col style={tableStyles.sectionProp}>
      <Text selectable={false} style={tableStyles.sectionPropText}>
        {label}:
      </Text>
    </Col>
    <Col style={tableStyles.sectionValue}>
      <Text style={tableStyles.sectionValueText}>{children}</Text>
    </Col>
  </Row>
);

const tableStyles = StyleSheet.create({
  section: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    paddingBottom: styleConst.ui.horizontalGap,
    marginLeft: styleConst.ui.horizontalGap,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.systemGray,
  },
  sectionTitle: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 14,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.regular,
    marginBottom: 15,
  },
  sectionTitleRequired: {},
  textRequired: {
    marginHorizontal: '2%',
    marginVertical: 20,
    color: styleConst.color.greyText,
  },
  sectionProp: {
    paddingRight: 5,
    marginTop: 5,
  },
  sectionValue: {
    marginTop: 5,
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 14,
    color: styleConst.color.greyText,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 16,
    color: styleConst.color.greyText3,
  },
});

export default ServiceInfoModal;
