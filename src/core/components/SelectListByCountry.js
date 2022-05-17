import React, {useState, useEffect} from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';

// components
import {Container, StyleProvider, Tab, Tabs, DefaultTabBar} from 'native-base';
import SelectItemByCountry from './SelectItemByCountry';

// helpers
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
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

const renderTabBar = props => {
  props.tabStyle = Object.create(props.tabStyle);
  return <DefaultTabBar {...props} />;
};

const _onRefresh = props => {
  const {setRefreshing} = props;
  setRefreshing(true);
  props.props.dataHandler().then(() => {
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
  const {
    itemLayout,
    listRussia,
    listUkraine,
    listBelarussia,
    listAll,
    dataHandler,
    settings,
    // dataBrandsHandler,
  } = props;
  const navigation = useNavigation();

  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (itemLayout === 'dealer') {
      dataHandler();
      //dataBrandsHandler();
    }
  }, [dataHandler, itemLayout]);

  let customListBYN = [];
  let customListRUS = [];
  let customListUA = [];
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
    if (countrySettings.includes('ua')) {
      listUkraine.map(el => {
        if (listAll.includes(el.id)) {
          customListUA.push(el);
        }
      });
    }
  }

  if (listAll && listAll.length) {
    // кастомный список дилеров
    return (
      <StyleProvider style={getTheme()}>
        <Container style={styleConst.safearea.default}>
          <Tabs
            renderTabBar={renderTabBar}
            tabBarUnderlineStyle={{
              backgroundColor: styleConst.color.lightBlue,
            }}>
            {customListBYN && customListBYN.length ? (
              <Tab
                heading="🇧🇾 Беларусь"
                textStyle={styles.TabsTextStyle}
                activeTextStyle={styles.TabsActiveTextStyle}
                activeTabStyle={styles.TabsActiveTabStyle}>
                <FlatList
                  style={styles.list}
                  data={customListBYN}
                  onRefresh={() => {
                    if (itemLayout === 'dealer') {
                      return _onRefresh({props, isRefreshing, setRefreshing});
                    }
                  }}
                  refreshing={isRefreshing}
                  ListEmptyComponent={_EmptyComponent}
                  renderItem={item => {
                    return _renderItem({...props, ...item, navigation});
                  }}
                  keyExtractor={item => `${item.hash.toString()}`}
                />
              </Tab>
            ) : null}
            {customListRUS && customListRUS.length ? (
              <Tab
                heading="🇷🇺 Россия"
                textStyle={styles.TabsTextStyle}
                activeTextStyle={styles.TabsActiveTextStyle}
                activeTabStyle={styles.TabsActiveTabStyle}>
                <FlatList
                  style={styles.list}
                  data={customListRUS}
                  onRefresh={() => {
                    if (itemLayout === 'dealer') {
                      return _onRefresh({props, isRefreshing, setRefreshing});
                    }
                  }}
                  refreshing={isRefreshing}
                  ListEmptyComponent={_EmptyComponent}
                  renderItem={item => {
                    return _renderItem({...props, ...item, navigation});
                  }}
                  keyExtractor={item => `${item.hash.toString()}`}
                />
              </Tab>
            ) : null}
            {customListUA && customListUA.length ? (
              <Tab
                heading="🇺🇦 Україна"
                textStyle={styles.TabsTextStyle}
                activeTextStyle={styles.TabsActiveTextStyle}
                activeTabStyle={styles.TabsActiveTabStyle}>
                <FlatList
                  style={styles.list}
                  data={customListUA}
                  onRefresh={() => {
                    if (itemLayout === 'dealer') {
                      return _onRefresh({props, isRefreshing, setRefreshing});
                    }
                  }}
                  refreshing={isRefreshing}
                  ListEmptyComponent={_EmptyComponent}
                  renderItem={item => {
                    return _renderItem({...props, ...item, navigation});
                  }}
                  keyExtractor={item => `${item.hash.toString()}`}
                />
              </Tab>
            ) : null}
          </Tabs>
        </Container>
      </StyleProvider>
    );
  } else {
    return (
      <StyleProvider style={getTheme()}>
        <Container style={styles.safearea}>
          <Tabs
            renderTabBar={renderTabBar}
            tabBarUnderlineStyle={{
              backgroundColor: styleConst.color.lightBlue,
            }}>
            {listBelarussia &&
            listBelarussia.length &&
            countrySettings &&
            countrySettings.includes('by') ? (
              <Tab
                heading="🇧🇾 Беларусь"
                textStyle={styles.TabsTextStyle}
                activeTextStyle={styles.TabsActiveTextStyle}
                activeTabStyle={styles.TabsActiveTabStyle}>
                <FlatList
                  style={styles.list}
                  data={listBelarussia}
                  onRefresh={() => {
                    if (itemLayout === 'dealer') {
                      return _onRefresh({props, isRefreshing, setRefreshing});
                    }
                  }}
                  refreshing={isRefreshing}
                  ListEmptyComponent={_EmptyComponent}
                  renderItem={item => {
                    return _renderItem({...props, ...item, navigation});
                  }}
                  keyExtractor={item => `${item.hash.toString()}`}
                />
              </Tab>
            ) : null}
            {listRussia &&
            listRussia.length &&
            countrySettings &&
            countrySettings.includes('ru') ? (
              <Tab
                heading="🇷🇺 Россия"
                textStyle={styles.TabsTextStyle}
                activeTextStyle={styles.TabsActiveTextStyle}
                activeTabStyle={styles.TabsActiveTabStyle}>
                <FlatList
                  style={styles.list}
                  data={listRussia}
                  onRefresh={() => {
                    if (itemLayout === 'dealer') {
                      return _onRefresh({props, isRefreshing, setRefreshing});
                    }
                  }}
                  refreshing={isRefreshing}
                  ListEmptyComponent={_EmptyComponent}
                  renderItem={item => {
                    return _renderItem({...props, ...item, navigation});
                  }}
                  keyExtractor={item => `${item.hash.toString()}`}
                />
              </Tab>
            ) : null}
            {listUkraine &&
            listUkraine.length &&
            countrySettings &&
            countrySettings.includes('ua') ? (
              <Tab
                heading="🇺🇦 Україна"
                textStyle={styles.TabsTextStyle}
                activeTextStyle={styles.TabsActiveTextStyle}
                activeTabStyle={styles.TabsActiveTabStyle}>
                <FlatList
                  style={styles.list}
                  data={listUkraine}
                  onRefresh={() => {
                    if (itemLayout === 'dealer') {
                      return _onRefresh({props, isRefreshing, setRefreshing});
                    }
                  }}
                  refreshing={isRefreshing}
                  ListEmptyComponent={_EmptyComponent}
                  renderItem={item => {
                    return _renderItem({...props, ...item, navigation});
                  }}
                  keyExtractor={item => `${item.hash.toString()}`}
                />
              </Tab>
            ) : null}
          </Tabs>
        </Container>
      </StyleProvider>
    );
  }
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

export default SelectListByCountry;
