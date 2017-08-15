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
} from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styleConst from '../../../core/style-const';
import { scale } from '../../../utils/scale';
import styleHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.content,
  },
});

const mapStateToProps = () => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({

  }, dispatch);
};

class HelpDeskScreen extends Component {
  static navigationOptions = () => ({
    headerTitle: 'Справочная',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
  })

  render() {
    return (
      <Container>
        <Content>
          <Text>Контакты справочных служб</Text>
        </Content>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpDeskScreen);
