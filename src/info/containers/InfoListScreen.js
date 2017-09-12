import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { Container, Content, Text, List, StyleProvider } from 'native-base';
import { OptimizedFlatList } from 'react-native-optimized-flatlist';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchInfoList } from '../actions';

// helpers
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import { verticalScale } from '../../utils/scale';

// components
import InfoListItem from '../components/InfoListItem';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  message: {
    fontFamily: styleConst.font.regular,
    fontSize: 14,
    alignSelf: 'center',
    marginTop: verticalScale(60),
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

const mapStateToProps = ({ dealer, info }) => {
  return {
    list: info.list,
    visited: info.visited,
    dealerSelected: dealer.selected,
    isFetchInfoList: info.meta.isFetchInfoList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchInfoList,
  }, dispatch);
};

class InfoListScreen extends Component {
  state = { isRefreshing: false }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Акции',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <View />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    visited: PropTypes.array.isRequired,
    fetchInfoList: PropTypes.func.isRequired,
    isFetchInfoList: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    const { dealerSelected, list, fetchInfoList, isFetchInfoList } = this.props;
    const { region, id: dealer } = dealerSelected;

    if (list.length === 0 && !isFetchInfoList) {
      fetchInfoList(region, dealer);
    }
  }

  onRefresh = () => {
    const { dealerSelected, list, fetchInfoList } = this.props;
    const { region, id: dealer } = dealerSelected;

    this.setState({ isRefreshing: true });
    fetchInfoList(region, dealer).then(() => {
      this.setState({ isRefreshing: false });
    });
  }

  shouldComponentUpdate(nextProps) {
    const {
      list,
      navigation,
      dealerSelected,
    } = this.props;
    const isActiveScreen = navigation.state.routeName === 'InfoListScreen';

    return (dealerSelected.id !== nextProps.dealerSelected.id && isActiveScreen) ||
      (list.length !== nextProps.list.length);
  }

  renderItem = ({ item }) => {
    return (
      <InfoListItem
        info={item}
        visited={this.props.visited}
        navigate={this.props.navigation.navigate}
      />
    );
  }

  renderEmptyComponent = () => {
    return this.props.isFetchInfoList ?
      (
          <View style={styles.spinnerContainer} >
            <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
          </View>
      ) :
      (
          <Text style={styles.message}>В данный момент нет акций</Text>
      );
  }

  renderHeaderComponent = () => {
    return (
      <DealerItemList
        navigation={this.props.navigation}
        city={this.props.dealerSelected.city}
        name={this.props.dealerSelected.name}
        brands={this.props.dealerSelected.brands}
        returnScreen="InfoListScreen"
      />
    );
  }

  render() {
    const {
      list,
      visited,
      navigation,
      dealerSelected,
      isFetchInfoList,
    } = this.props;

    return (
      <StyleProvider style={getTheme()}>
        <View style={styles.container}>
          <OptimizedFlatList
            ListHeaderComponent={this.renderHeaderComponent}
            data={list.length === 0 ? null : list}
            onRefresh={this.onRefresh}
            refreshing={this.state.isRefreshing}
            ListEmptyComponent={this.renderEmptyComponent}
            style={styles.list}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoListScreen);
