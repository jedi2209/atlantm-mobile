import React from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {Checkbox, HStack} from 'native-base';
import Imager from './Imager';
import {get} from 'lodash';

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

const showImages = ({type, dataExtra, text}) => {
  switch (type) {
    case 'body':
      return (
        <View style={styles.bodyTypeBoxWrapper}>
          <Imager
            style={styles.bodyTypeBox}
            source={{
              uri:
                // 'https://storage.yandexcloud.net/cdn.atlantm.com/icons/bodyType/svg/' +
                'https://cdn.atlantm.com/icons/bodyType/svg/' +
                dataExtra[text.toString()] +
                '.svg',
            }}
          />
        </View>
      );
    case 'colors':
      return (
        <View style={styles.colorBoxWrapper}>
          <View
            style={[
              styles.colorBox,
              {
                backgroundColor: get(dataExtra[text.toString()], 'codes.hex'),
              },
              styles[`colorBox_${dataExtra[text.toString()].keyword}`],
            ]}
          />
        </View>
      );
  }
};

const CheckboxList = ({
  items = [],
  selectedItems = {},
  type,
  dataExtra,
  onPressCallback,
  checkboxColor,
}) => {
  let def = excludeValFromSelect(selectedItems);

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
        const ImageBlock = () => showImages({type, dataExtra, text});
        return (
          <TouchableHighlight
            onPress={() => {
              _onSelect({id});
            }}
            key={'checkboxWrapper' + id}
            activeOpacity={0.7}
            underlayColor={styleConst.color.white}>
            <View style={styles.row}>
              <ImageBlock />
              <View style={{flex: 1}}>
                <HStack justifyContent="space-between">
                  <Text style={styles.text}>{text}</Text>
                  <Checkbox
                    aria-label={text}
                    color={checkboxColor}
                    isChecked={def.includes(id) ? true : false}
                    isReadOnly={true}
                    isDisabled={true}
                    _disabled={{
                      style: {
                        opacity: 1,
                      },
                    }}
                    onChange={() => {
                      _onSelect({id});
                    }}
                  />
                </HStack>
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

export default CheckboxList;
