import React, { Component } from 'react';
import {
  StyleSheet,
  View,
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
} from 'native-base';
import CachedImage from 'react-native-cached-image';
import Spinner from 'react-native-loading-spinner-overlay';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import { scale } from '../../utils/scale';
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
  },
  brands: {
    flexDirection: 'row',
  },
});

const mapStateToProps = ({ dealer }) => {
  return {
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
  static navigationOptions = () => ({
    headerTitle: 'Мой автоцентр',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
  })

  static propTypes = {
    isFetch: PropTypes.bool.isRequired,
    fetchDealers: PropTypes.func.isRequired,
    selectDealer: PropTypes.func.isRequired,
    selectCountry: PropTypes.func.isRequired,
  }

  static defaultProps = {}

  componentWillMount() {
    this.props.fetchDealers();
  }

  render() {
    const {
      listRussia,
      listBelarussia,
      listUkraine,
      country,
      selectCountry,
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
          <Content style={styles.content}>
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
              key={country}
              style={styles.list}
              dataArray={list}
              renderRow={dealer => {
                return (
                  <ListItem style={styles.listItem}>
                    <Body
                      style={styles.listItemBody}
                    >
                      {dealer.city ? <Text style={styles.city}>{dealer.city}</Text> : null}
                      {dealer.name ? <Text style={styles.name}>{dealer.name}</Text> : null}
                    </Body>
                    <Right>
                      <View style={styles.brands} >
                        {/* <CachedImage
                          style={styles.brandLogo}
                          source=
                        /> */}
                      </View>
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
