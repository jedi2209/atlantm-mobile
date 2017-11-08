import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

// components
import { ListItem, Body, Item, Label } from 'native-base';

// styles
import styleListProfile from '../../core/components/Lists/style';

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

  render() {
    const { brand, model, price, complectation } = this.props;
    const modelName = get(model, 'name') || model;


    return (
      <View>
        <View style={styleListProfile.listItemContainer}>
          <ListItem style={[styleListProfile.listItem]}>
            <Body>
              <Item style={[styleListProfile.inputItem, { justifyContent: 'flex-start' }]} fixedLabel>
                <Label style={styleListProfile.label}>Марка</Label>
                <View style={styleListProfile.listItemValueContainer}>
                  <Text style={styleListProfile.listItemValue}>{brand}</Text>
                </View>
              </Item>
            </Body>
          </ListItem>
        </View>

        {
          modelName ?
            (
              <View style={styleListProfile.listItemContainer}>
                <ListItem style={styleListProfile.listItem} >
                  <Body>
                    <Item style={styleListProfile.inputItem} fixedLabel>
                      <Label style={styleListProfile.label}>Модель</Label>
                      <View style={styleListProfile.listItemValueContainer}>
                        <Text style={styleListProfile.listItemValue}>{modelName}</Text>
                      </View>
                    </Item>
                  </Body>
                </ListItem>
              </View>
            ) : null
        }

        {
          complectation ?
            (
              <View style={styleListProfile.listItemContainer}>
                <ListItem style={styleListProfile.listItem} >
                  <Body>
                    <Item style={styleListProfile.inputItem} fixedLabel>
                      <Label style={styleListProfile.label}>Комплект.</Label>
                      <View style={styleListProfile.listItemValueContainer}>
                        <Text style={styleListProfile.listItemValue}>{complectation}</Text>
                      </View>
                    </Item>
                  </Body>
                </ListItem>
              </View>
            ) : null
        }

        <View style={styleListProfile.listItemContainer}>
          <ListItem last style={styleListProfile.listItem} >
            <Body>
              <Item style={styleListProfile.inputItem} fixedLabel>
                <Label style={styleListProfile.label}>Цена</Label>
                <View style={styleListProfile.listItemValueContainer}>
                  <Text style={styleListProfile.listItemValue}>{price}</Text>
                </View>
              </Item>
            </Body>
          </ListItem>
        </View>

      </View>
    );
  }
}
