import React from 'react';
import {View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {Checkbox, HStack, VStack} from 'native-base';
import Imager from './Imager';
import {get} from 'lodash';

import styleConst from '../style-const';
import Badge from './Badge';

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

const showImages = props => {
  const {type, dataExtra, text} = props;

  const textCheck = get(props, 'text', '').toString();
  if (!textCheck || !get(dataExtra, 'textCheck')) {
    return null;
  }

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
                backgroundColor: get(dataExtra[textCheck], 'codes.hex'),
              },
              styles[`colorBox_${dataExtra[textCheck].keyword}`],
            ]}
          />
        </View>
      );
  }
};

const Heading = props => {
  const {text, type, additionalText, dataExtra, id} = props;

  let additionalTextExt;
  let headingText;

  switch (type) {
    case 'grades':
      if (additionalText) {
        additionalTextExt = ' - ' + additionalText.join('\r\n - ');
        additionalTextExt = (
          <Text style={styles.text}>{additionalTextExt}</Text>
        );
      }
      headingText = (
        <Badge
          id={'badge-' + id}
          key={'gradeItem' + id}
          index={0}
          badgeContainerStyle={{width: 150}}
          textStyle={{fontSize: 17, textAlign: 'center'}}
          bgColor={get(
            dataExtra,
            'color.background',
            styleConst.color.greyText2,
          )}
          name={text}
          textColor={get(dataExtra, 'color.text', styleConst.color.white)}
        />
      );
      break;

    default:
      headingText = <Text style={styles.heading}>{text}</Text>;
      break;
  }

  return (
    <VStack>
      {headingText}
      {additionalTextExt}
    </VStack>
  );
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
        const text = get(val, 'label', '');
        const id = Number(get(val, 'value', 0));
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
                  <Heading
                    text={text}
                    id={id}
                    additionalText={get(dataExtra, `${id}.description`, '')}
                    dataExtra={get(dataExtra, `${id}`, {})}
                    type={type}
                  />
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
  heading: {
    fontSize: 17,
    fontFamily: styleConst.font.regular,
    color: styleConst.color.greyText6,
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
