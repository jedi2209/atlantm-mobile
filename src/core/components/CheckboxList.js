import React, {useReducer} from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {Checkbox, HStack, Pressable} from 'native-base';
import Imager from './Imager';
import {get} from 'lodash';

import PropTypes from 'prop-types';
import styleConst from '../style-const';

const excludeValFromSelect = list => {
  if (!list) {
    return [];
  }
  let tmp = [];
  Object.keys(list).map(val => {
    tmp.push(list[val].value);
  });
  return tmp;
};

const CheckboxList = ({
  items,
  selectedItems,
  type,
  dataExtra,
  onPressCallback,
  checkboxColor,
}) => {
  let def = excludeValFromSelect(selectedItems);
  const forceUpdate = useReducer(bool => !bool)[1];

  let itemsArr = {};
  items.map(item => {
    itemsArr[item.value] = item.label;
  });

  const _onSelect = val => {
    Object.keys(val).map(item => {
      onPressCallback({label: itemsArr[val[item]], value: val[item]});
    });
  };

  return (
    <View>
      {items.map(val => {
        const text = val.label;
        const id = Number(val.value);
        return (
          <TouchableHighlight
            onPress={() => {
              _onSelect({id});
              forceUpdate();
            }}
            key={'checkboxWrapper' + id}
            activeOpacity={0.7}
            underlayColor={styleConst.color.white}>
            <View style={styles.row}>
              {type === 'colors' ? (
                <View style={styles.colorBoxWrapper}>
                  <View
                    style={[
                      styles.colorBox,
                      {
                        backgroundColor: get(
                          dataExtra[text.toString()],
                          'codes.hex',
                        ),
                      },
                      styles[`colorBox_${dataExtra[text.toString()].keyword}`],
                    ]}
                  />
                </View>
              ) : null}
              {type === 'body' ? (
                <View style={styles.bodyTypeBoxWrapper}>
                  <Imager
                    style={styles.bodyTypeBox}
                    source={{
                      uri:
                        'https://cdn.atlantm.com/icons/bodyType/svg/' +
                        dataExtra[text.toString()] +
                        '.svg',
                    }}
                  />
                </View>
              ) : null}
              <View style={{flex: 1}}>
                <Pressable
                  onPress={() => {
                    _onSelect({id});
                    forceUpdate();
                  }}>
                  <HStack justifyContent="space-between">
                    <Text style={styles.text}>{text}</Text>
                    <Checkbox
                      color={checkboxColor}
                      isChecked={def.includes(id) ? true : false}
                      onChange={() => {
                        _onSelect({id});
                        forceUpdate();
                      }}
                    />
                  </HStack>
                </Pressable>
              </View>
            </View>
          </TouchableHighlight>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    flexDirection: 'row',
  },
  wrapper: {
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 17,
    fontFamily: styleConst.font.regular,
    color: styleConst.color.greyText6,
  },
  colorBoxWrapper: {
    marginRight: 15,
  },
  bodyTypeBoxWrapper: {
    marginRight: 15,
    width: 30,
  },
  bodyTypeBox: {
    width: 30,
    height: 30,
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  colorBox_white: {
    borderWidth: 1,
    borderColor: styleConst.color.greyText5,
  },
});

CheckboxList.defaultProps = {};

export default CheckboxList;
