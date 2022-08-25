import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';

import {fetchDealers} from '../../dealer/actions';

// components
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import SelectItemByCountry from './SelectItemByCountry';

// helpers
import {get} from 'lodash';
import styleConst from '../../core/style-const';
import {verticalScale} from '../../utils/scale';

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

const mapStateToProps = ({dealer}) => {
  return {
    dealerSelected: dealer.selected,
    region: dealer.region,
    listRussia: dealer.listRussia,
    listBrands: dealer.listBrands,
    listBelarussia: dealer.listBelarussia,
  };
};

const mapDispatchToProps = {
  fetchDealers,
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

const _onRefresh = props => {
  const {setRefreshing} = props;
  setRefreshing(true);
  props.props.fetchDealers().then(() => {
    // props.dataBrandsHandler();
    setRefreshing(false);
  });
};

const _EmptyComponent = () => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator
      color={styleConst.color.blue}
      style={styleConst.spinner}
    />
  </View>
);

const _renderItem = props => {
  const {
    selectedItem,
    itemLayout,
    goBack,
    isLocal,
    onSelect,
    returnState,
    item,
    route,
  } = props;
  const returnScreen = get(route, 'params.returnScreen');

  return (
    <SelectItemByCountry
      item={item}
      goBack={goBack}
      isLocal={isLocal}
      itemLayout={itemLayout}
      selectedItem={selectedItem}
      returnScreen={returnScreen}
      returnState={returnState}
      onSelect={onSelect}
    />
  );
};

const SelectListByCountry = props => {
  const {itemLayout, listRussia, listBelarussia, listAll, settings} = props;
  const navigation = useNavigation();

  const [isRefreshing, setRefreshing] = useState(false);

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  // useEffect(() => {
  //   if (itemLayout === 'dealer') {
  //     dataHandler();
  //     //dataBrandsHandler();
  //   }
  // }, [dataHandler, itemLayout]);

  let customListBYN = [];
  let customListRUS = [];
  let routesHead = [];
  const countrySettings = get(settings, 'country', []);

  if (listAll && listAll.length) {
    if (countrySettings.includes('by')) {
      listBelarussia.map(el => {
        if (listAll.includes(el.id)) {
          customListBYN.push(el);
        }
      });
    }
    if (countrySettings.includes('ru')) {
      listRussia.map(el => {
        if (listAll.includes(el.id)) {
          customListRUS.push(el);
        }
      });
    }
  }
  let TabBY, TabRU;

  if (listAll && listAll.length) {
    // кастомный список дилеров
    if (customListBYN && customListBYN.length) {
      routesHead.push({key: 'by', title: '🇧🇾 Беларусь'});
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
              return _renderItem({...props, ...item, navigation});
            }}
            keyExtractor={item => `${item.hash.toString()}`}
          />
        </View>
      );
    }

    if (customListRUS && customListRUS.length) {
      routesHead.push({key: 'ru', title: '🇷🇺 Россия'});
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
              return _renderItem({...props, ...item, navigation});
            }}
            keyExtractor={item => `${item.hash.toString()}`}
          />
        </View>
      );
    }
  } else {
    if (
      listBelarussia &&
      listBelarussia.length &&
      countrySettings &&
      countrySettings.includes('by')
    ) {
      routesHead.push({key: 'by', title: '🇧🇾 Беларусь'});
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
              return _renderItem({...props, ...item, navigation});
            }}
            keyExtractor={item => `${item.hash.toString()}`}
          />
        </View>
      );
    }

    if (
      listRussia &&
      listRussia.length &&
      countrySettings &&
      countrySettings.includes('ru')
    ) {
      routesHead.push({key: 'ru', title: '🇷🇺 Россия'});
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
              return _renderItem({...props, ...item, navigation});
            }}
            keyExtractor={item => `${item.hash.toString()}`}
          />
        </View>
      );
    }
  }

  const [routes] = useState(routesHead);

  const renderScene = SceneMap({
    by: TabBY,
    ru: TabRU,
  });

  return (
    <TabView
      navigationState={{index, routes}}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
};

SelectListByCountry.propTypes = {
  region: PropTypes.string,
  listRussia: PropTypes.array,
  listBelarussia: PropTypes.array,
  listUkraine: PropTypes.array,
  isFetchList: PropTypes.bool,
  dataHandler: PropTypes.func,
  dataBrandsHandler: PropTypes.func,
  selectItem: PropTypes.func,
  selectedItem: PropTypes.object,
  itemLayout: PropTypes.string,
  onSelect: PropTypes.func,
  goBack: PropTypes.bool,
  isLocal: PropTypes.bool,
};

SelectListByCountry.defaultProps = {
  isLocal: false,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectListByCountry);
