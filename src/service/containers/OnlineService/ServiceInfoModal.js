import React, {useState} from 'react';
import {StyleSheet, Text, SafeAreaView} from 'react-native';
import {View, Button, HStack, ScrollView, VStack} from 'native-base';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

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

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: styleConst.color.lightBlue}}
      style={[{backgroundColor: styleConst.color.white}]}
      renderLabel={({route, focused, color}) => {
        return (
          <Text
            style={{
              color: focused ? '#000' : styleConst.color.darkBg,
              margin: 8,
            }}>
            {route.title}
          </Text>
        );
      }}
    />
  );

  let routesHead = [];
  let tabWorks, tabParts;

  if (data.works && data.works.length) {
    routesHead.push({
      key: 'works',
      title: strings.CarHistoryDetailsScreen.works,
    });
    tabWorks = () => <ServiceTable data={data.works} type={type} />;
  }

  if (data.parts && data.parts.length) {
    routesHead.push({
      key: 'parts',
      title: strings.CarHistoryDetailsScreen.materials,
    });
    tabParts = () => <ServiceTable data={data.parts} type={type} />;
  }

  const [routes] = useState(routesHead);
  const [index, setIndex] = useState(0);

  const renderScene = SceneMap({
    works: tabWorks,
    parts: tabParts,
  });

  return (
    <View style={modalStyles.container}>
      <View flex={1}>
        <TabView
          navigationState={{index, routes}}
          renderTabBar={renderTabBar}
          renderScene={renderScene}
          onIndexChange={setIndex}
          // initialLayout={{width: layout.width}}
        />
        <View py={7} px={'5%'} shadow={5}>
          <Button
            style={modalStyles.button}
            onPress={onClose}
            _text={modalStyles.buttonText}>
            OK
          </Button>
        </View>
      </View>
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
    <ScrollView>
      {data.map(({name, quantity, unit, summ, currency, required}, cnt) => (
        <View
          style={tableStyles.section}
          key={'ServiceTable' + cnt + quantity + summ}>
          {name ? <Text style={tableStyles.sectionTitle}>{name}</Text> : null}
          <HStack justifyContent={'space-between'}>
            {quantity && unit ? (
              <ServiceTableItem label={strings.CarHistoryDetailsScreen.count}>
                {unit === 'сек'
                  ? quantity / 60 / 60 + ' ч.'
                  : [quantity, unit].join(' ')}
              </ServiceTableItem>
            ) : null}
            {summ && currency.name ? (
              <ServiceTableItem labelXX={strings.CarHistoryDetailsScreen.price}>
                {showPrice(summ, currency.name)}
              </ServiceTableItem>
            ) : null}
          </HStack>
        </View>
      ))}
      {type && type !== 'required' && type !== 'recommended' ? (
        <Text style={tableStyles.textRequired}>
          * отмечены обязательные работы и з/ч
        </Text>
      ) : null}
    </ScrollView>
  );
};

const ServiceTableItem = ({label, children}) => (
  <HStack style={tableStyles.sectionRow}>
    <View style={tableStyles.sectionProp}>
      {label ? (
        <Text selectable={false} style={tableStyles.sectionPropText}>
          {label}:
        </Text>
      ) : null}
    </View>
    <View style={tableStyles.sectionValue}>
      <Text style={tableStyles.sectionValueText}>{children}</Text>
    </View>
  </HStack>
);

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
    fontSize: 14,
    color: styleConst.color.greyText3,
  },
});

export default ServiceInfoModal;
