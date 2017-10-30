import React, { PureComponent } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

// components
import { ListItem, Body, Item, Label } from 'native-base';

// styles
import styleListProfile from '../../core/components/Lists/style';

// helpers
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  listItemValue: {
    fontSize: 17,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    marginRight: styleConst.ui.horizontalGap,
  },
  listItemValueContainer: {
    flex: 2.5,
  },
  // inputItem: {
  //   height: 44,
  // },
  // listItemContainer: {
  //   height: 44,
  // },
  // listItem: {
  //   height: 44,
  //   paddingVertical: 20,
  // },
});

export default class CarOrderList extends PureComponent {
  static propTypes = {
    brand: PropTypes.string,
    model: PropTypes.string,
    price: PropTypes.string,
  }

  static defaultProps = {}

  render() {
    const { brand, model, price } = this.props;

    return (
      <View>
        <View></View>
        <View style={styleListProfile.listItemContainer}>
          <ListItem style={[styleListProfile.listItem]}>
            <Body>
              <Item style={[styleListProfile.inputItem, { justifyContent: 'flex-start' }]} fixedLabel>
                <Label style={styleListProfile.label}>Марка</Label>
                <View style={styles.listItemValueContainer}>
                  <Text style={styles.listItemValue}>{brand}</Text>
                </View>
              </Item>
            </Body>
          </ListItem>
        </View>

        <View style={styleListProfile.listItemContainer}>
          <ListItem style={styleListProfile.listItem} >
            <Body>
              <Item style={styleListProfile.inputItem} fixedLabel>
                <Label style={styleListProfile.label}>Модель</Label>
                <View style={styles.listItemValueContainer}>
                  <Text style={styles.listItemValue}>{model}</Text>
                </View>
              </Item>
            </Body>
          </ListItem>
        </View>

        <View style={styleListProfile.listItemContainer}>
          <ListItem last style={styleListProfile.listItem} >
            <Body>
              <Item style={styleListProfile.inputItem} fixedLabel>
                <Label style={styleListProfile.label}>Цена</Label>
                <View style={styles.listItemValueContainer}>
                  <Text style={styles.listItemValue}>{price}</Text>
                </View>
              </Item>
            </Body>
          </ListItem>
        </View>

      </View>
    );
  }
}
