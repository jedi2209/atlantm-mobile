import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
  Text,
  Segment,
  Button,
  List,
  ListItem,
  Body,
  Right,
  StyleProvider,
  Icon,
} from 'native-base';
import CachedImage from 'react-native-cached-image';
import Spinner from 'react-native-loading-spinner-overlay';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
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
  brands: {
    flexDirection: 'row',
  },
  brandLogo: {
    minWidth: 24,
    height: 20,
    marginRight: 4,
  },
  city: {
    fontFamily: styleConst.font.regular,
    fontSize: 17,
  },
  name: {
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    fontSize: 17,
  },
  listItem: {
    minHeight: 44,
  },
  spinner: {
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
});

const mapStateToProps = ({ dealer }) => {
  return {
    selected: dealer.selected,
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
  })

  static propTypes = {
    isFetchDealer: PropTypes.bool.isRequired,
    fetchDealers: PropTypes.func.isRequired,
    selectDealer: PropTypes.func.isRequired,
    selectRegion: PropTypes.func.isRequired,
  }

  static defaultProps = {
    selected: {},
  }

  constructor(props) {
    super(props);

    this.onRefresh = this.onRefresh.bind(this);
  }

  state = {
    isRefreshing: false,
  }

  componentWillMount() {
    const {
      listRussia,
      fetchDealers,
    } = this.props;

    if (listRussia.length === 0) {
      fetchDealers();
    }
  }

  onRefresh() {
    this.setState({ isRefreshing: true });
    this.props.fetchDealers().then(() => {
      this.setState({ isRefreshing: false });
    });
  }

  render() {
    const {
      selected,
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
          <Spinner visible={isFetchDealer} color={styleConst.color.blue} />
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
            <View style={styles.tabs} >
              <Segment>
                  <Button
                    first
                    active={region === RUSSIA}
                    onPress={() => selectRegion(RUSSIA)}
                  >
                    <Text>Россия</Text>
                  </Button>
                  <Button
                    active={region === BELARUSSIA}
                    onPress={() => selectRegion(BELARUSSIA)}
                  >
                    <Text>Беларусь</Text>
                  </Button>
                  <Button
                    last
                    active={region === UKRAINE}
                    onPress={() => selectRegion(UKRAINE)}
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
                    key={region + selected.id}
                    style={styles.list}
                    dataArray={list}
                    renderRow={dealer => {
                      return (
                        <ListItem
                          onPress={() => {
                            selectDealer(dealer)
                              .then(action => {
                                console.log('action', action);
                                if (action.type === 'DEALER__SUCCESS') {
                                  return navigation.navigate('MenuScreen');
                                }

                                if (action.type === 'DEALER__FAIL') {
                                  Alert.alert('Ошибка', 'Не удалось получить данные по выбранному автоцентру, попробуйте снова');
                                }
                              })
                              .catch();
                          }}
                          style={styles.listItem}
                        >
                          <Body
                            style={styles.listItemBody}
                          >
                            {dealer.city ? <Text style={styles.city}>{dealer.city.name}</Text> : null}
                            {dealer.name ? <Text style={styles.name}>{dealer.name}</Text> : null}
                          </Body>
                          <Right>
                            <View style={styles.brands} >
                              {
                                dealer.brands.map(brand => {
                                  return (
                                    <CachedImage
                                      resizeMode="contain"
                                      key={brand.id}
                                      style={styles.brandLogo}
                                      source={{ uri: brand.logo }}
                                    />
                                  );
                                })
                              }
                            </View>
                            {
                              selected.id === dealer.id ?
                                (
                                  <Icon
                                    name="ios-checkmark"
                                    style={{ fontSize: 30, color: styleConst.color.systemBlue }}
                                  />
                                ) : null
                            }
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

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDealerScreen);
