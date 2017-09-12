import React, { Component } from 'react';
import { StyleSheet, View, RefreshControl, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import {
  List,
  Text,
  Button,
  Content,
  Segment,
  Container,
  StyleProvider,
} from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import DealerItem from '../components/DealerItem';

// helpers
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import { verticalScale } from '../../utils/scale';

// actions
import { fetchDealers, selectDealer, selectRegion } from '../actions';

import {
  RUSSIA,
  BELARUSSIA,
  UKRAINE,
} from '../regionConst';

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
});

const mapStateToProps = ({ dealer }) => {
  return {
    dealerSelected: dealer.selected,
    region: dealer.region,
    listRussia: dealer.listRussia,
    listBelarussia: dealer.listBelarussia,
    listUkraine: dealer.listUkraine,
    isFetchDealersList: dealer.meta.isFetchDealersList,
    isFetchDealer: dealer.meta.isFetchDealer,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchDealers,
    selectDealer,
    selectRegion,
  }, dispatch);
};

class ChooseDealerScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Мой автоцентр',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object,
    isFetchDealer: PropTypes.bool.isRequired,
    fetchDealers: PropTypes.func.isRequired,
    selectDealer: PropTypes.func.isRequired,
    selectRegion: PropTypes.func.isRequired,
  }

  static defaultProps = {}

  state = {
    isRefreshing: false,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.isFetchDealer !== nextProps.isFetchDealer ||
      this.props.region !== nextProps.region ||
        this.props.listRussia.length !== nextProps.listRussia.length ||
          this.props.listBelarussia.length !== nextProps.listBelarussia.length ||
            this.props.listUkraine.length !== nextProps.listUkraine.length;
  }

  componentDidMount() {
    const {
      listRussia,
      fetchDealers,
    } = this.props;

    if (listRussia.length === 0) {
      fetchDealers();
    }
  }

  onRefresh = () => {
    this.setState({ isRefreshing: true });
    this.props.fetchDealers().then(() => {
      this.setState({ isRefreshing: false });
    });
  }

  selectRegionRussia = () => this.props.selectRegion(RUSSIA)
  selectRegionUkraine = () => this.props.selectRegion(UKRAINE)
  selectRegionBelarussia = () => this.props.selectRegion(BELARUSSIA)

  render() {
    const {
      dealerSelected,
      listRussia,
      listBelarussia,
      listUkraine,
      region,
      selectRegion,
      selectDealer,
      navigation,
      isFetchDealersList,
      isFetchDealer,
    } = this.props;

    console.log('== ChooseDealer ==');

    const returnScreen = get(navigation, 'state.params.returnScreen');
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
        <Container>
          <Content
            style={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}
                title="Обновляем автоцентры"
              />
            }
          >
          <Spinner visible={isFetchDealer} color={styleConst.color.blue} />
            <View style={styles.tabs} >
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

            {
              listRussia.length === 0 ?
                (
                  <View style={styles.spinnerContainer} >
                    <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
                  </View>
                ) :
                (
                  <List
                    key={region + dealerSelected.id}
                    style={styles.list}
                    dataArray={list}
                    renderRow={dealer => <DealerItem
                      dealer={dealer}
                      navigate={navigation.navigate}
                      dealerSelected={dealerSelected}
                      returnScreen={returnScreen}
                      selectDealer={selectDealer}
                      region={region}
                    />}
                  />
                )
            }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDealerScreen);
