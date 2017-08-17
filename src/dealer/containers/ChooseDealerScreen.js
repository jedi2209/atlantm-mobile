import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
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
import {
  RUSSIA,
  BELARUSSIA,
  UKRAINE,
} from '../countryConst';

// actions
import { fetchDealers, selectDealer, selectCountry } from '../actions';

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
});

const mapStateToProps = ({ dealer }) => {
  return {
    selected: dealer.selected,
    country: dealer.country,
    listRussia: dealer.listRussia,
    listBelarussia: dealer.listBelarussia,
    listUkraine: dealer.listUkraine,
    isFetch: dealer.meta.isFetch,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchDealers,
    selectDealer,
    selectCountry,
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
    isFetch: PropTypes.bool.isRequired,
    fetchDealers: PropTypes.func.isRequired,
    selectDealer: PropTypes.func.isRequired,
    selectCountry: PropTypes.func.isRequired,
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
    this.props.listRussia.length === 0 && this.props.fetchDealers();
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
      country,
      selectCountry,
      selectDealer,
      navigation,
    } = this.props;

    let list = [];

    switch (country) {
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
          <Spinner visible={this.props.isFetch} color={styleConst.color.blue} />
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
                    active={country === RUSSIA}
                    onPress={() => selectCountry(RUSSIA)}
                  >
                    <Text>Россия</Text>
                  </Button>
                  <Button
                    active={country === BELARUSSIA}
                    onPress={() => selectCountry(BELARUSSIA)}
                  >
                    <Text>Беларусь</Text>
                  </Button>
                  <Button
                    last
                    active={country === UKRAINE}
                    onPress={() => selectCountry(UKRAINE)}
                  >
                    <Text>Украина</Text>
                  </Button>
              </Segment>
            </View>

            <List
              key={country + selected.id}
              style={styles.list}
              dataArray={list}
              renderRow={dealer => {
                return (
                  <ListItem
                    onPress={() => {
                      selectDealer(dealer);
                      navigation.navigate('MenuScreen');
                    }}
                    style={styles.listItem}
                  >
                    <Body
                      style={styles.listItemBody}
                    >
                      {dealer.city ? <Text style={styles.city}>{dealer.city}</Text> : null}
                      {dealer.name ? <Text style={styles.name}>{dealer.name}</Text> : null}
                    </Body>
                    <Right>
                      <View style={styles.brands} >
                        {
                          dealer.brand.map(brand => {
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
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDealerScreen);
