import React, {Component} from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

// components
import {Container, StyleProvider, Tab, Tabs} from 'native-base';
import SelectItemByCountry from './SelectItemByCountry';

// helpers
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import {verticalScale} from '../../utils/scale';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  tabs: {
    width: '100%',
    backgroundColor: styleConst.new.blueHeader,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
    paddingVertical: verticalScale(5),
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  list: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  TabsTextStyle: {
    color: '#000',
  },
  TabsActiveTextStyle: {
    color: styleConst.new.blueHeader,
  },
  TabsActiveTabStyle: {},
});

export default class SelectListByCountry extends Component {
  static propTypes = {
    // navigation: PropTypes.object,
    region: PropTypes.string,
    listRussia: PropTypes.array,
    listBelarussia: PropTypes.array,
    listUkraine: PropTypes.array,
    isFetchList: PropTypes.bool,
    dataHandler: PropTypes.func,
    dataBrandsHandler: PropTypes.func,
    selectRegion: PropTypes.func,
    selectItem: PropTypes.func,
    selectedItem: PropTypes.object,
    itemLayout: PropTypes.string,
    onSelect: PropTypes.func,
    goBack: PropTypes.bool,
    isLocal: PropTypes.bool,
  };

  static defaultProps = {
    isLocal: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,
    };
  }

  componentDidMount() {
    const {dataHandler, dataBrandsHandler, itemLayout} = this.props;

    if (itemLayout === 'dealer') {
      dataHandler();
      //dataBrandsHandler();
    }
  }

  onRefresh = () => {
    this.setState({isRefreshing: true});
    this.props.dataHandler().then(() => {
      //this.props.dataBrandsHandler();
      this.setState({isRefreshing: false});
    });
  };

  renderEmptyComponent = () => (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
    </View>
  );

  renderItem = ({item}) => {
    const {
      navigation,
      selectedItem,
      itemLayout,
      goBack,
      isLocal,
      onSelect,
      returnState,
    } = this.props;
    const returnScreen = get(navigation, 'state.params.returnScreen');

    return (
      <SelectItemByCountry
        item={item}
        goBack={goBack}
        isLocal={isLocal}
        itemLayout={itemLayout}
        selectedItem={selectedItem}
        // navigation={navigation}
        returnScreen={returnScreen}
        returnState={returnState}
        onSelect={onSelect}
      />
    );
  };

  render() {
    const {
      region,
      itemLayout,
      isFetchList,
      listRussia,
      listUkraine,
      listBelarussia,
      listAll,
    } = this.props;

    let customListBYN = [];
    let customListRUS = [];
    let customListUA = [];
    if (listAll && listAll.length) {
      listBelarussia.map((el) => {
        if (listAll.includes(el.id)) {
          customListBYN.push(el);
        }
      });
      listRussia.map((el) => {
        if (listAll.includes(el.id)) {
          customListRUS.push(el);
        }
      });
      listUkraine.map((el) => {
        if (listAll.includes(el.id)) {
          customListUA.push(el);
        }
      });
    }

    if (listAll && listAll.length) {
      // кастомный список дилеров
      return (
        <StyleProvider style={getTheme()}>
          <Container style={styles.safearea}>
            <Tabs
              tabBarUnderlineStyle={{
                backgroundColor: styleConst.new.blueHeader,
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
                    onRefresh={itemLayout === 'dealer' && this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this.renderEmptyComponent}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => `${item.hash.toString()}`}
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
                    onRefresh={itemLayout === 'dealer' && this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this.renderEmptyComponent}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => `${item.hash.toString()}`}
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
                    onRefresh={itemLayout === 'dealer' && this.onRefresh}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this.renderEmptyComponent}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => `${item.hash.toString()}`}
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
              tabBarUnderlineStyle={{
                backgroundColor: styleConst.new.blueHeader,
              }}>
              <Tab
                heading="🇧🇾 Беларусь"
                textStyle={styles.TabsTextStyle}
                activeTextStyle={styles.TabsActiveTextStyle}
                activeTabStyle={styles.TabsActiveTabStyle}>
                <FlatList
                  style={styles.list}
                  data={listBelarussia}
                  onRefresh={itemLayout === 'dealer' && this.onRefresh}
                  refreshing={this.state.isRefreshing}
                  ListEmptyComponent={this.renderEmptyComponent}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => `${item.hash.toString()}`}
                />
              </Tab>
              <Tab
                heading="🇷🇺 Россия"
                textStyle={styles.TabsTextStyle}
                activeTextStyle={styles.TabsActiveTextStyle}
                activeTabStyle={styles.TabsActiveTabStyle}>
                <FlatList
                  style={styles.list}
                  data={listRussia}
                  onRefresh={itemLayout === 'dealer' && this.onRefresh}
                  refreshing={this.state.isRefreshing}
                  ListEmptyComponent={this.renderEmptyComponent}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => `${item.hash.toString()}`}
                />
              </Tab>
              <Tab
                heading="🇺🇦 Україна"
                textStyle={styles.TabsTextStyle}
                activeTextStyle={styles.TabsActiveTextStyle}
                activeTabStyle={styles.TabsActiveTabStyle}>
                <FlatList
                  style={styles.list}
                  data={listUkraine}
                  onRefresh={itemLayout === 'dealer' && this.onRefresh}
                  refreshing={this.state.isRefreshing}
                  ListEmptyComponent={this.renderEmptyComponent}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => `${item.hash.toString()}`}
                />
              </Tab>
            </Tabs>
          </Container>
        </StyleProvider>
      );
    }
  }
}
