import React, {Component} from 'react';
import {StyleSheet, View, FlatList, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

// components
import {
  Container,
  Text,
  Button,
  Segment,
  StyleProvider,
  Header,
  Tab,
  Tabs,
} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import SelectItemByCountry from './SelectItemByCountry';

// helpers
import {RUSSIA, BELARUSSIA, UKRAINE} from '../const';
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
});

export default class SelectListByCountry extends Component {
  static propTypes = {
    navigation: PropTypes.object,
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

  selectRegionRussia = () => this.props.selectRegion(RUSSIA);
  selectRegionUkraine = () => this.props.selectRegion(UKRAINE);
  selectRegionBelarussia = () => this.props.selectRegion(BELARUSSIA);

  renderEmptyComponent = () => (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
    </View>
  );

  renderItem = ({item}) => {
    const {
      navigation,
      selectedItem,
      selectItem,
      itemLayout,
      goBack,
      isLocal,
      onSelect,
    } = this.props;
    const returnScreen = get(navigation, 'state.params.returnScreen');

    return (
      <SelectItemByCountry
        item={item}
        goBack={goBack}
        isLocal={isLocal}
        itemLayout={itemLayout}
        selectItem={selectItem}
        selectedItem={selectedItem}
        navigation={navigation}
        returnScreen={returnScreen}
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
    } = this.props;

    return (
      <StyleProvider style={getTheme()}>
        <Container style={styles.safearea}>
          <Tabs tabBarUnderlineStyle={{color: styleConst.color.blue}}>
            <Tab heading="🇧🇾Беларусь">
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
            <Tab heading="🇷🇺Россия">
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
            <Tab heading="🇺🇦Украина">
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
