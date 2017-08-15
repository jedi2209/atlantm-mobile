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
} from 'native-base';
import CachedImage from 'react-native-cached-image';
import Spinner from 'react-native-loading-spinner-overlay';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styleConst from '../../core/style-const';
import { scale } from '../../utils/scale';
import styleHeader from '../../core/components/Header/style';

// actions
import { fetchDealers, setDealer } from '../actions';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.content,
  },
  tabs: {
    backgroundColor: 'grey',
  },
  brands: {
    flexDirection: 'row',
  },
});

const mapStateToProps = ({ dealer }) => {
  return {
    list: dealer.list,
    isFetch: dealer.meta.isFetch,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchDealers,
    setDealer,
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
    setDealer: PropTypes.func.isRequired,
  }

  static defaultProps = {}

  componentWillMount() {
    this.props.fetchDealers();
  }

  render() {
    return (
      <Container>
        <Spinner visible={this.props.isFetch} color={styleConst.color.blue} />
        <Content style={styles.content}>
          <View style={styles.tabs} >
            <Segment>
                <Button first><Text>Россия</Text></Button>
                <Button><Text>Беларусь</Text></Button>
                <Button last active><Text>Украина</Text></Button>
            </Segment>
          </View>

          <List style={styles.list} >
            <ListItem style={styles.listItem}>
              <Body>
                <Text style={styles.city} >Смоленск</Text>
                <Text style={styles.name} >Атлант-М Балтика</Text>
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
          </List>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseDealerScreen);
