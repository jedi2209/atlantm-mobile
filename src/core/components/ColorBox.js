/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../style-const';
import ModalView from './ModalView';
import strings from '../lang/const';

const styles = StyleSheet.create({
  boxStyle: {
    borderColor: '#afafaf',
    borderWidth: 0.5,
    borderRadius: 5,
    width: 30,
    height: 30,
  },
});

export default class ColorBox extends PureComponent {
  static propTypes = {
    color: PropTypes.object,
    touchableStyle: PropTypes.object,
    containerStyle: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
    };
  }

  click() {
    this.setState({
      isModalVisible: true,
    });
  }

  render() {
    const {color} = this.props;
    const backgroundColor =
      color && color.picker && color.picker.codes && color.picker.codes.hex
        ? color.picker.codes.hex
        : 'none';
    return (
      <View style={[this.props.containerStyle]}>
        <ModalView
          isModalVisible={this.state.isModalVisible}
          animationIn="slideInRight"
          animationOut="slideOutLeft"
          onHide={() => {
            this.setState({
              isModalVisible: false,
            });
          }}
          selfClosed={true}>
          <View style={{padding: 10}}>
            {color.name.official ? (
              <Text
                ellipsizeMode="clip"
                style={{fontSize: 18, marginBottom: 10}}>
                {color.name.official}
              </Text>
            ) : null}
            <View style={{flexDirection: 'row'}}>
              <View
                style={[
                  styleConst.shadow.default,
                  styles.boxStyle,
                  {
                    backgroundColor: backgroundColor,
                    width: 100,
                    height: 100,
                    marginRight: 10,
                  },
                ]}
              />
              {color.code ? (
                <Text style={{fontSize: 16}} selectable={true}>
                  {strings.ColorBox.code} - {color.code}
                </Text>
              ) : null}
            </View>
          </View>
        </ModalView>
        <TouchableHighlight
          onPress={() => {
            this.setState({
              isModalVisible: true,
            });
          }}
          style={[this.props.touchableStyle]}
          underlayColor={'none'}>
          <View
            style={[
              styleConst.shadow.default,
              styles.boxStyle,
              {
                backgroundColor: backgroundColor,
              },
            ]}
            {...this.props}
          />
        </TouchableHighlight>
      </View>
    );
  }
}
