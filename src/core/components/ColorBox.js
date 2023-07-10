/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  StatusBar,
} from 'react-native';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../style-const';
import {get} from 'lodash';
import ModalView from './ModalView';
import {strings} from '../lang/const';

const styles = StyleSheet.create({
  boxStyle: {
    borderColor: '#afafaf',
    borderWidth: 0.5,
    borderRadius: 5,
    width: 30,
    height: 30,
  },
});

const ColorBox = props => {
  const [isModalVisible, setModalVisible] = useState(false);

  const color = props.color;
  const backgroundColor = get(
    props,
    'color.picker.codes.hex',
    'color.codes.hex',
    null,
  );

  return (
    <>
      <View style={[props?.containerStyle]}>
        <StatusBar hidden />
        <TouchableHighlight
          onPress={() => setModalVisible(true)}
          style={[props?.touchableStyle]}
          underlayColor={'none'}>
          <View
            style={[
              styleConst.shadow.default,
              styles.boxStyle,
              {
                backgroundColor: backgroundColor,
              },
            ]}
            {...props}
          />
        </TouchableHighlight>
      </View>
      <ModalView
        statusBarTranslucent
        isModalVisible={isModalVisible}
        animationIn="slideInRight"
        animationOut="slideOutLeft"
        onHide={() => setModalVisible(false)}
        selfClosed={true}>
        <View style={{padding: 10}}>
          {color?.name?.official ? (
            <Text ellipsizeMode="clip" style={{fontSize: 18, marginBottom: 10, color: styleConst.color.greyText4}}>
              {color?.name?.official}
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
              <Text style={{fontSize: 16, color: styleConst.color.greyText2}} selectable={true}>
                {strings.ColorBox.code} - {color.code}
              </Text>
            ) : null}
          </View>
        </View>
      </ModalView>
    </>
  );
};

ColorBox.propTypes = {
  color: PropTypes.object,
  touchableStyle: PropTypes.object,
  containerStyle: PropTypes.object,
};

export default ColorBox;
