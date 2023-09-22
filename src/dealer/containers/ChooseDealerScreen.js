import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, Alert, useWindowDimensions} from 'react-native';
import {Pressable, View, Box, Text} from 'native-base';
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

const filterList = (list = [], filter = null) => {
  const filterType = get(filter, 'type', null);
  if (!filterType) {
    return true;
  }
  let res = [];
  list.map(el => {
    get(el, 'locations', []).map(location => {
      get(location, 'divisions', []).map(type => {
        if (get(type, 'types', []).includes(filterType.toUpperCase())) {
          res.push(el);
        }
      });
    });
  });
  return res;
};

const filterDealer = (dealer, filter) => {
  const filterType = get(filter, 'type', null);
  if (!filterType) {
    return true;
  }
  let res = false;
  get(dealer, 'locations', []).map(location => {
    get(location, 'divisions', []).map(type => {
      if (get(type, 'types', []).includes(filterType.toUpperCase())) {
        res = true;
      }
    });
  });
  return res;
};

const _renderItem = ({item, props}) => {
  const {
    isLocal,
    pushActionSubscribeState,
    goBack,
    navigation,
    selectDealer,
    returnScreen,
    returnState,
    dealerFilter,
  } = props;
  if (item.virtual !== false && item.id !== 177) {
    // фикс для НЕ вывода виртуальных КО в списке
    return true;
  }

  const isAvailable = filterDealer(item, dealerFilter);

  return (
    <Pressable
      onPress={() => {
        if (!isAvailable) {
          return Alert.alert(
            strings.SelectItemByCountry.error.title,
            strings.DealerItemList.notAvailable,
          );
        } else {
          return _onPressDealerItem({
            dealerSelectedItem: item,
            isLocal,
            pushActionSubscribeState,
            goBack,
            navigation,
            selectDealer,
            returnScreen,
            returnState,
          });
        }
      }}>
      {({isPressed}) => {
        return (
          <Box
            mt="2"
            mx="2"
            shadow="1"
            backgroundColor={styleConst.color.white}
            borderRadius="md"
            style={
              isAvailable
                ? {
                    transform: [
                      {
                        scale: isPressed ? 0.98 : 1,
                      },
                    ],
                  }
                : null
            }>
            <DealerCard
              item={item}
              isAvailable={isAvailable}
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

const _onPressDealerItem = async ({
  dealerSelectedItem,
  isLocal,
  pushActionSubscribeState,
  goBack,
  navigation,
  selectDealer,
  returnScreen,
  returnState,
}) => {
  let action = null;
  if (!returnState) {
    returnState = {};
  }
  if (!isLocal) {
    action = await selectDealer({
      dealerBaseData: dealerSelectedItem,
      dealerSelected: dealerSelectedItem,
      isLocal,
    });
  } else {
    action = selectDealer({
      dealerBaseData: dealerSelectedItem,
      dealerSelected: dealerSelectedItem,
      isLocal,
    });
  }
  if (
    action &&
    [DEALER__SUCCESS, DEALER__SUCCESS__LOCAL].includes(action.type)
  ) {
    // if (action.type === DEALER__SUCCESS) {
    //   PushNotifications.unsubscribeFromTopic('actions');
    //   if (pushActionSubscribeState) {
    //     PushNotifications.subscribeToTopic('actionsRegion', regionXXX);
    //   } else {
    //     PushNotifications.unsubscribeFromTopic('actionsRegion');
    //   }
    // }
    if (returnScreen) {
      if (goBack) {
        navigation.goBack();
      }
      returnState.prevScreen = 'ChooseDealerScreen';
      return navigation.navigate(returnScreen, returnState);
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
};

const _EmptyComponent = () => <LogoLoader />;

const makeLists = props => {
  const {
    settings,
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

  let listAll = props.listAll;

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
  const {
    isFetchDealer,
    region,
    route,
    fetchDealers,
    listRussia,
    listBelarussia,
    listUkraine,
  } = props;

  const [isRefreshing, setRefreshing] = useState(false);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const needToUpdate = get(route, 'params.updateDealers', false);
  const goBack = get(route, 'params.goBack', true);
  const isLocal = get(route, 'params.isLocal', false);
  const returnScreen = get(route, 'params.returnScreen', null);
  const returnState = get(route, 'params.returnState', null);
  const listAll = get(route, 'params.listAll', null);
  const regions = get(route, 'params.regions', [region]);
  const dealerFilter = get(route, 'params.dealerFilter', null);

  const [tabsData, setTabsData] = useState(null);
  const [renderSceneData, setRenderScene] = useState({});

  useEffect(() => {
    if (needToUpdate) {
      setRefreshing(true);
      fetchDealers()
        .then(res => {
          if (res.type === 'DEALERS__SUCCESS') {
            const tabsDataLocal = makeLists({
              ...props,
              listUkraine: get(res, 'payload.ua', []),
              listRussia: get(res, 'payload.ru', []),
              listBelarussia: get(res, 'payload.by', []),
              listAll,
              regions,
              isRefreshing,
              setRefreshing,
              _renderItem,
              goBack,
              isLocal,
              returnScreen,
              returnState,
              dealerFilter,
            });

            setTabsData(tabsDataLocal);

            let sceneMap = {};

            switch (APP_REGION) {
              case BELARUSSIA:
                if (tabsDataLocal.TabBY) {
                  sceneMap.by = tabsDataLocal.TabBY;
                }
                if (tabsDataLocal.TabRU) {
                  sceneMap.ru = tabsDataLocal.TabRU;
                }
                break;
              case UKRAINE:
                if (tabsDataLocal.TabUA) {
                  sceneMap.ua = tabsDataLocal.TabUA;
                }
                break;
            }

            setRenderScene(sceneMap);
            setRefreshing(false);
          }
        })
        .catch(err => {
          console.error('ChooseDealerScreen error', err);
          setRefreshing(false);
        });
    } else {
      const tabsDataLocal = makeLists({
        ...props,
        listUkraine,
        listRussia,
        listBelarussia,
        listAll,
        regions,
        isRefreshing,
        setRefreshing,
        _renderItem,
        goBack,
        isLocal,
        returnScreen,
        returnState,
        dealerFilter,
      });

      setTabsData(tabsDataLocal);

      let sceneMap = {};

      switch (APP_REGION) {
        case BELARUSSIA:
          if (tabsDataLocal.TabBY) {
            sceneMap.by = tabsDataLocal.TabBY;
          }
          if (tabsDataLocal.TabRU) {
            sceneMap.ru = tabsDataLocal.TabRU;
          }
          break;
        case UKRAINE:
          if (tabsDataLocal.TabUA) {
            sceneMap.ua = tabsDataLocal.TabUA;
          }
          break;
      }

      setRenderScene(sceneMap);
      setRefreshing(false);
    }
  }, [needToUpdate]);

  if (!tabsData || !renderSceneData || isRefreshing) {
    return _EmptyComponent();
  }

  const renderScene = SceneMap(renderSceneData);

  return (
    <>
      {isFetchDealer ? (
        <View
          zIndex={10000}
          position={'absolute'}
          height={layout.height}
          w={layout.width}
          opacity={0.9}>
          {_EmptyComponent()}
        </View>
      ) : null}
      <TabView
        navigationState={{index, routes: tabsData.routesHead}}
        renderTabBar={
          tabsData?.routesHead.length === 1 ? () => {} : renderTabBar
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
