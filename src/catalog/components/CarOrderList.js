import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// components
import { ListItem, Body, Item, Label } from 'native-base';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  listItemValueDefault: {
    textDecorationLine: 'line-through',
  },
  labelSpecial: {
    color: styleConst.color.red,
  },
});

export default class CarOrderList extends PureComponent {
  static propTypes = {
    brand: PropTypes.string,
    model: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    isSale: PropTypes.bool,
    price: PropTypes.string,
    priceSpecial: PropTypes.string,
    complectation: PropTypes.string,
  }

  static defaultProps = {}

  renderItem = (label, value, isLast, isSale, isDefault) => {
    if (!value) return null;
    console.log('stylesList', stylesList);
    return (
      <View style={stylesList.listItemContainer}>
        <ListItem last={isLast} style={[stylesList.listItem, stylesList.listItemReset]}>
          <Body>
            <Item style={stylesList.inputItem} fixedLabel>
              <Label style={[
                stylesList.label,
                isSale ? styles.labelSpecial : '',
              ]}>{label}</Label>
              <View style={stylesList.listItemValueContainer}>
                <Text style={[
                  stylesList.listItemValue,
                  isDefault ? styles.listItemValueDefault : '',
                ]}>{value}</Text>
              </View>
            </Item>
          </Body>
        </ListItem>
      </View>
    );
  }

  render() {
    const { brand, model, isSale, price, priceSpecial, complectation } = this.props;
    const modelName = get(model, 'name') || model;

    return (
      <View>
        {this.renderItem('Марка', brand)}
        {this.renderItem('Модель', modelName)}
        {this.renderItem('Комплект.', complectation)}
        {this.renderItem('Цена', price, !isSale, false, isSale)}
        {isSale ? this.renderItem('Cпец.цена', priceSpecial, true, true) : null}
      </View>
    );
  }
}
