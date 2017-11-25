import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

// components
import { ListItem, Body, Item, Label } from 'native-base';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import { get } from 'lodash';

export default class CarOrderList extends PureComponent {
  static propTypes = {
    brand: PropTypes.string,
    model: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    price: PropTypes.string,
    complectation: PropTypes.string,
  }

  static defaultProps = {}

  renderItem = (label, value, isLast) => {
    if (!value) return null;

    return (
      <View style={stylesList.listItemContainer}>
        <ListItem last={isLast} style={[stylesList.listItem, stylesList.listItemReset]}>
          <Body>
            <Item style={stylesList.inputItem} fixedLabel>
              <Label style={stylesList.label}>{label}</Label>
              <View style={stylesList.listItemValueContainer}>
                <Text style={stylesList.listItemValue}>{value}</Text>
              </View>
            </Item>
          </Body>
        </ListItem>
      </View>
    );
  }

  render() {
    const { brand, model, price, complectation } = this.props;
    const modelName = get(model, 'name') || model;

    return (
      <View>
        {this.renderItem('Марка', brand)}
        {this.renderItem('Модель', modelName)}
        {this.renderItem('Комплект.', complectation)}
        {this.renderItem('Цена', price, true)}
      </View>
    );
  }
}
