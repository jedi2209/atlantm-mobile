import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {Pressable, View, Box} from 'native-base';
import {connect} from 'react-redux';
import {
  APP_REGION,
  RUSSIA,
  BELARUSSIA,
  UKRAINE,
  DEALERS_SETTINGS,
} from '../../core/const';

import {fetchDealers, selectDealer} from '../../dealer/actions';
import {
  DEALER__SUCCESS,
  DEALER__SUCCESS__LOCAL,
  DEALER__FAIL,
} from '../../dealer/actionTypes';

// helpers
import {get} from 'lodash';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';
import {verticalScale} from '../../utils/scale';

// components
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import PushNotifications from '../../core/components/PushNotifications';
import DealerCard from '../../core/components/DealerCard';
import LogoLoader from '../../core/components/LogoLoader';

const styles = StyleSheet.create({
  tabs: {
    width: '100%',
    backgroundColor: styleConst.color.lightBlue,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.systemGray,
    paddingVertical: verticalScale(5),
  },
  list: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  TabsTextStyle: {
    color: '#000',
  },
  TabsActiveTextStyle: {
    color: styleConst.color.lightBlue,
  },
  TabsActiveTabStyle: {},
});

const mapStateToProps = ({dealer, nav, core}) => {
  return {
    nav,
    isFetchDealersList: dealer.meta.isFetchDealersList,
    isFetchDealer: dealer.meta.isFetchDealer,
    settings: core.settings,
    pushActionSubscribeState: core.pushActionSubscribeState,

    dealerSelected: dealer.selected,
    region: dealer.region,
    listRussia: dealer.listRussia,
    listBelarussia: dealer.listBelarussia,
    listUkraine: dealer.listUkraine,
  };
};

const mapDispatchToProps = {
  fetchDealers,
  selectDealer,
};

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

const _renderItem = ({item, props}) => {
  const {
    isLocal,
    pushActionSubscribeState,
    goBack,
    navigation,
    selectDealer,
    returnScreen,
    returnState,
  } = props;
  if (item.virtual !== false && item.id !== 177) {
    // фикс для НЕ вывода виртуальных КО в списке
    return true;
  }

  return (
    <Pressable
      onPress={() =>
        _onPressDealerItem({
          dealerSelectedItem: item,
          isLocal,
          pushActionSubscribeState,
          goBack,
          navigation,
          selectDealer,
          returnScreen,
          returnState,
        })
      }>
      {({isPressed}) => {
        return (
          <Box
            mt="2"
            mx="2"
            shadow="1"
            backgroundColor="white"
            borderRadius="md"
            style={{
              transform: [
                {
                  scale: isPressed ? 0.98 : 1,
                },
              ],
            }}>
            <DealerCard
              item={item}
              showBrands={
                get(DEALERS_SETTINGS, 'hideBrands', []).includes(item.id)
                  ? false
                  : true
              }
            />
          </Box>
        );
      }}
    </Pressable>
  );
};

const _onRefresh = ({props, setRefreshing}) => {
  setRefreshing(true);
  props.fetchDealers().then(() => {
    // props.dataBrandsHandler();
    setRefreshing(false);
  });
};

const _onPressDealerItem = ({
  dealerSelectedItem,
  isLocal,
  pushActionSubscribeState,
  goBack,
  navigation,
  selectDealer,
  returnScreen,
  returnState,
}) => {
  selectDealer({
    dealerBaseData: dealerSelectedItem,
    dealerSelected: dealerSelectedItem,
    isLocal,
  }).then(action => {
    const newDealer = get(action, 'payload.newDealer');
    if (
      action &&
      [DEALER__SUCCESS, DEALER__SUCCESS__LOCAL].includes(action.type)
    ) {
      if (action.type === DEALER__SUCCESS) {
        if (pushActionSubscribeState) {
          PushNotifications.subscribeToTopic('actions', newDealer.id);
        } else {
          PushNotifications.unsubscribeFromTopic('actions');
        }
      }
      if (returnScreen) {
        if (goBack) {
          navigation.goBack();
        }
        return navigation.navigate(
          returnScreen,
          returnState ? returnState : {},
        );
      } else {
        if (goBack) {
          return navigation.goBack();
        }
        if (!isLocal) {
          return navigation.reset({
            index: 0,
            routes: [{name: 'BottomTabNavigation'}],
          });
        }
      }
    }

    if (action && action.type === DEALER__FAIL) {
      Alert.alert(
        strings.SelectItemByCountry.error.title,
        strings.SelectItemByCountry.error.text,
      );
    }
  });
};

const _EmptyComponent = () => <LogoLoader />;

const makeLists = props => {
  const {
    settings,
    listAll,
    regions,
    listBelarussia,
    listRussia,
    listUkraine,
    itemLayout,
    isRefreshing,
    setRefreshing,
  } = props;

  let customListBYN = [];
  let customListRUS = [];
  let customListUA = [];
  let routesHead = [];
  let TabBY, TabRU, TabUA;
  const countrySettings = get(settings, 'country', []);

  if (listAll && listAll.length) {
    // выводим кастомные автоцентры
    if (countrySettings.includes(BELARUSSIA)) {
      listBelarussia.map(el => {
        if (listAll.includes(el.id)) {
          customListBYN.push(el);
        }
      });
      if (customListBYN.length) {
        routesHead.push({key: BELARUSSIA, title: '🇧🇾 Беларусь'});
        TabBY = () => (
          <View style={{flex: 1}}>
            <FlatList
              style={styles.list}
              data={customListBYN}
              onRefresh={() => {
                if (itemLayout === 'dealer') {
                  return _onRefresh({
                    props,
                    isRefreshing,
                    setRefreshing,
                  });
                }
              }}
              refreshing={isRefreshing}
              ListEmptyComponent={_EmptyComponent}
              renderItem={item => {
                return _renderItem({...item, props});
              }}
              keyExtractor={item => `${item.hash.toString()}`}
            />
          </View>
        );
      }
    }
    if (countrySettings.includes(RUSSIA)) {
      listRussia.map(el => {
        if (listAll.includes(el.id)) {
          customListRUS.push(el);
        }
      });
      if (customListRUS.length) {
        routesHead.push({key: RUSSIA, title: '🇷🇺 Россия'});
        TabRU = () => (
          <View style={{flex: 1}}>
            <FlatList
              style={styles.list}
              data={customListRUS}
              onRefresh={() => {
                if (itemLayout === 'dealer') {
                  return _onRefresh({...props, isRefreshing, setRefreshing});
                }
              }}
              refreshing={isRefreshing}
              ListEmptyComponent={_EmptyComponent}
              renderItem={item => {
                return _renderItem({...item, props});
              }}
              keyExtractor={item => `${item.hash.toString()}`}
            />
          </View>
        );
      }
    }
    if (countrySettings.includes(UKRAINE)) {
      listUkraine.map(el => {
        if (listAll.includes(el.id)) {
          customListUA.push(el);
        }
      });
      if (customListUA.length && APP_REGION === UKRAINE) {
        routesHead.push({key: UKRAINE, title: '🇺🇦 Все буде Україна!'});
        TabUA = () => (
          <View style={{flex: 1}}>
            <FlatList
              style={styles.list}
              data={customListUA}
              onRefresh={() => {
                if (itemLayout === 'dealer') {
                  return _onRefresh({
                    props,
                    isRefreshing,
                    setRefreshing,
                  });
                }
              }}
              refreshing={isRefreshing}
              ListEmptyComponent={_EmptyComponent}
              renderItem={item => {
                return _renderItem({...item, props});
              }}
              keyExtractor={item => `${item.hash.toString()}`}
            />
          </View>
        );
      }
    }
  } else {
    if (
      regions.length &&
      regions.includes(BELARUSSIA) &&
      listBelarussia &&
      listBelarussia.length &&
      countrySettings &&
      countrySettings.includes(BELARUSSIA)
    ) {
      routesHead.push({key: BELARUSSIA, title: '🇧🇾 Беларусь'});
      TabBY = () => (
        <View style={{flex: 1, paddingBottom: 20}}>
          <FlatList
            style={styles.list}
            data={listBelarussia}
            onRefresh={() => {
              if (itemLayout === 'dealer') {
                return _onRefresh({
                  props,
                  isRefreshing,
                  setRefreshing,
                });
              }
            }}
            refreshing={isRefreshing}
            ListEmptyComponent={_EmptyComponent}
            renderItem={item => {
              return _renderItem({...item, props});
            }}
            keyExtractor={item => `${item.hash.toString()}`}
          />
        </View>
      );
    }

    if (
      regions.length &&
      regions.includes(RUSSIA) &&
      listRussia &&
      listRussia.length &&
      countrySettings &&
      countrySettings.includes(RUSSIA)
    ) {
      routesHead.push({key: RUSSIA, title: '🇷🇺 Россия'});
      TabRU = () => (
        <View style={{flex: 1, paddingBottom: 20}}>
          <FlatList
            style={styles.list}
            data={listRussia}
            onRefresh={() => {
              if (itemLayout === 'dealer') {
                return _onRefresh({
                  props,
                  isRefreshing,
                  setRefreshing,
                });
              }
            }}
            refreshing={isRefreshing}
            ListEmptyComponent={_EmptyComponent}
            renderItem={item => {
              return _renderItem({...item, props});
            }}
            keyExtractor={item => `${item.hash.toString()}`}
          />
        </View>
      );
    }

    if (
      regions.length &&
      regions.includes(UKRAINE) &&
      APP_REGION === UKRAINE &&
      listUkraine &&
      listUkraine.length &&
      countrySettings &&
      countrySettings.includes(UKRAINE)
    ) {
      routesHead.push({key: UKRAINE, title: '🇺🇦 Все буде Україна!'});
      TabUA = () => (
        <View style={{flex: 1, paddingBottom: 20}}>
          <FlatList
            style={styles.list}
            data={listUkraine}
            onRefresh={() => {
              if (itemLayout === 'dealer') {
                return _onRefresh({
                  props,
                  isRefreshing,
                  setRefreshing,
                });
              }
            }}
            refreshing={isRefreshing}
            ListEmptyComponent={_EmptyComponent}
            renderItem={item => {
              return _renderItem({...item, props});
            }}
            keyExtractor={item => `${item.hash.toString()}`}
          />
        </View>
      );
    }
  }

  return {TabBY, TabRU, TabUA, routesHead};
};

const ChooseDealerScreen = props => {
  const {route, isFetchDealer, region} = props;

  const [isRefreshing, setRefreshing] = useState(false);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const goBack = get(route, 'params.goBack', true);
  const isLocal = get(route, 'params.isLocal', false);
  const returnScreen = get(route, 'params.returnScreen', null);
  const returnState = get(route, 'params.returnState', null);
  const listAll = get(route, 'params.listAll', null);
  const regions = get(route, 'params.regions', [region]);

  const tabsData = makeLists({
    ...props,
    listAll,
    regions,
    isRefreshing,
    setRefreshing,
    _renderItem,
    goBack,
    isLocal,
    returnScreen,
    returnState,
  });

  const [routes] = useState(tabsData.routesHead);

  let renderScene = null;

  switch (APP_REGION) {
    case BELARUSSIA:
      renderScene = SceneMap({
        by: tabsData.TabBY,
        ru: tabsData.TabRU,
      });
      break;
    case UKRAINE:
      renderScene = SceneMap({
        ua: tabsData.TabUA,
      });
      break;
  }

  return (
    <>
      {isFetchDealer ? (
        <View
          zIndex={10000}
          position={'absolute'}
          height={layout.height}
          w={layout.width}
          opacity={0.9}>
          <LogoLoader />
        </View>
      ) : null}
      <TabView
        navigationState={{index, routes}}
        renderTabBar={
          tabsData.routesHead.length === 1 ? () => {} : renderTabBar
        }
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </>
  );
};

ChooseDealerScreen.defaultProps = {
  itemLayout: 'dealer',
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDealerScreen);
