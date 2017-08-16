import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Body,
  Right,
  StyleProvider,
  Icon,
} from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';
import DealerItemList from '../../core/components/DealerItemList';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';

// actions
import { fetchInfoList } from '../actions';

import { verticalScale } from '../../utils/scale';
import { dayMonth, dayMonthYear } from '../../utils/date';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  name: {
    fontFamily: styleConst.font.regular,
    fontSize: 17,
  },
  date: {
    color: styleConst.color.greyText2,
    fontFamily: styleConst.font.regular,
    fontSize: 14,
  },
  message: {
    fontFamily: styleConst.font.regular,
    fontSize: 14,
    alignSelf: 'center',
    marginTop: verticalScale(60),
  }
});

const mapStateToProps = ({ dealer, info }) => {
  return {
    dealerSelected: dealer.selected,
    list: info.list,
    visited: info.visited,
    isFetchInfoList: info.meta.isFetchInfoList,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchInfoList,
  }, dispatch);
};

class InfoListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { isRefreshing: false };

    this.onRefresh = this.onRefresh.bind(this);
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Акции',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: null,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    dealerSelected: PropTypes.object.isRequired,
    list: PropTypes.array.isRequired,
    visited: PropTypes.array.isRequired,
    fetchInfoList: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { dealerSelected, list, fetchInfoList } = this.props;
    const { country: region, id: dealer } = dealerSelected;

    if (list.length === 0) {
      fetchInfoList(region, dealer);
    }
  }

  onRefresh() {
    const { dealerSelected, list, fetchInfoList } = this.props;
    const { country: region, id: dealer } = dealerSelected;

    this.setState({ isRefreshing: true });
    fetchInfoList(region, dealer).then(() => {
      this.setState({ isRefreshing: false });
    });
  }

  processDate(date) {
    return `c ${dayMonth(date)} по ${dayMonthYear(date)}`;
  }

  render() {
    const {
      navigation,
      dealerSelected,
      list,
      visited,
      isFetchInfoList,
    } = this.props;

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.onRefresh}
                title="Обновляем список акций"
              />
            }
            style={styles.content}
          >
            <DealerItemList
              navigation={navigation}
              city={dealerSelected.city}
              name={dealerSelected.name}
              brands={dealerSelected.brand}
            />

            {
              list.length === 0 ?
              (
                  isFetchInfoList ?
                  (
                      <View style={styles.spinnerContainer} >
                      <ActivityIndicator color={styleConst.color.blue} style={styles.spinner} />
                      </View>
                  ) :
                  (
                      <Text style={styles.message}>В данный момент нет акций</Text>
                  )
              ) :
              (
                  <List
                  key={visited.length}
                  style={styles.list}
                  dataArray={list}
                  renderRow={info => {
                      {/* const isVisited = visited.includes(info.id); */}
                      const isVisited = false;

                      return (
                      <ListItem
                          onPress={() => {
                          navigation.navigate('InfoPostScreen', { infoID: info.id });
                          }}
                          style={styles.listItem}
                      >
                          <Body
                          style={styles.listItemBody}
                          >
                          {
                              info.name ?
                              <Text style={[
                                  styles.name,
                                  { color: isVisited ? styleConst.color.greyText : '#000' },
                              ]}
                              >
                                  {info.name}
                              </Text> :
                              null
                          }
                          {
                              info.date ?
                              <Text style={styles.date}>{this.processDate(info.date.from)}</Text> :
                              null
                              }
                          </Body>
                          <Right>
                          <Icon
                              name="arrow-forward"
                              style={[
                              styles.icon,
                              { color:
                                  isVisited ?
                                  styleConst.color.systemGrey :
                                  styleConst.color.systemBlue,
                              },
                              ]}
                          />
                          </Right>
                      </ListItem>
                      );
                  }}
                  >
                  </List>
              )
          }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoListScreen);
