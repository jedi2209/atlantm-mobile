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

import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import styleConst from '../../../core/style-const';
import { scale } from '../../../utils/scale';
import stylesHeader from '../../../core/components/Header/style';

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

class ReferenceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Справочная',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />, // для выравнивания заголовка по центру на обоих платформах
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

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceScreen);
