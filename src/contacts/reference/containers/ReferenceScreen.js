import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Content, Text } from 'native-base';

import { connect } from 'react-redux';

import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import styleConst from '../../../core/style-const';
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

const mapDispatchToProps = {

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
      <SafeAreaView>
        <Content>
          <Text>Контакты справочных служб</Text>
        </Content>
      </SafeAreaView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferenceScreen);
