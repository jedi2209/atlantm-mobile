import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
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

import styleConst from '../../core/style-const';
import { scale } from '../../utils/scale';
import styleHeader from '../../core/components/Header/style';
import DealerItemList from '../../core/components/DealerItemList';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({ dealer }) => {
  return {
    dealerSelected: dealer.selected,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({

  }, dispatch);
};

class InfoListScreen extends Component {
  static navigationOptions = () => ({
    headerTitle: 'Акции',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: null,
  })

  render() {
    const {
      navigation,
      dealerSelected,
    } = this.props;

    return (
      <Container>
        <Content>

        <DealerItemList
          navigation={navigation}
          city={dealerSelected.city}
          name={dealerSelected.name}
          brands={dealerSelected.brand}
        />

        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoListScreen);
