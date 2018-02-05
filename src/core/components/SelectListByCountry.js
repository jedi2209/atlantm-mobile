import React, { PureComponent } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

// components
import { Text, Button, Segment, Container, StyleProvider } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import SelectItemByCountry from './SelectItemByCountry';

// helpers
import { RUSSIA, BELARUSSIA, UKRAINE } from '../const';
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import { verticalScale } from '../../utils/scale';

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
  },
  tabs: {
    backgroundColor: styleConst.color.header,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  list: {
    flex: 1,
  },
});

export default class SelectListByCountry extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    region: PropTypes.string,
    listRussia: PropTypes.array,
    listBelarussia: PropTypes.array,
    listUkraine: PropTypes.array,
    isFetchList: PropTypes.bool,
    dataHandler: PropTypes.func,
    selectRegion: PropTypes.func,
    selectItem: PropTypes.func,
    selectedItem: PropTypes.object,
    itemLayout: PropTypes.string,
    onSelect: PropTypes.func,
    goBack: PropTypes.bool,
  }

  static defaultProps = {}

  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,
    };
  }

  componentDidMount() {
    const { dataHandler, itemLayout } = this.props;

    if (itemLayout === 'dealer') {
      dataHandler();
    }
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.props.dataHandler().then(() => {
      this.setState({ isRefreshing: false });
    });
  }

  selectRegionRussia = () => this.props.selectRegion(RUSSIA)
  selectRegionUkraine = () => this.props.selectRegion(UKRAINE)
  selectRegionBelarussia = () => this.props.selectRegion(BELARUSSIA)

  renderEmptyComponent = () => (
    <View style={styles.spinnerContainer} >
      <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
    </View>
  )

  renderItem = ({ item }) => {
    const { navigation, selectedItem, selectItem, itemLayout, goBack, onSelect } = this.props;
    const returnScreen = get(navigation, 'state.params.returnScreen');

    return <SelectItemByCountry
      item={item}
      goBack={goBack}
      itemLayout={itemLayout}
      selectItem={selectItem}
      navigation={navigation}
      selectedItem={selectedItem}
      returnScreen={returnScreen}
      onSelect={onSelect}
    />;
  }

  render() {
    const {
      region,
      itemLayout,
      isFetchList,
      listRussia,
      listUkraine,
      listBelarussia,
    } = this.props;

    console.log('isFetchList', isFetchList);

    let list = [];

    switch (region) {
      case RUSSIA:
        list = listRussia;
        break;
      case BELARUSSIA:
        list = listBelarussia;
        break;
      case UKRAINE:
        list = listUkraine;
        break;
      default:
        list = listRussia;
    }

    return (
      <StyleProvider style={getTheme()}>
        <Container style={styles.content}>
          <Spinner visible={isFetchList} color={styleConst.color.blue} />
          <View style={styles.tabs}>
            <Segment>
                <Button
                  first
                  active={region === RUSSIA}
                  onPress={this.selectRegionRussia}
                >
                  <Text>Россия</Text>
                </Button>
                <Button
                  active={region === BELARUSSIA}
                  onPress={this.selectRegionBelarussia}
                >
                  <Text>Беларусь</Text>
                </Button>
                <Button
                  last
                  active={region === UKRAINE}
                  onPress={this.selectRegionUkraine}
                >
                  <Text>Украина</Text>
                </Button>
            </Segment>
          </View>

          <FlatList
            style={styles.list}
            data={list}
            onRefresh={itemLayout === 'dealer' && this.onRefresh}
            refreshing={this.state.isRefreshing}
            ListEmptyComponent={this.renderEmptyComponent}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
          />
        </Container>
      </StyleProvider>
    );
  }
}
