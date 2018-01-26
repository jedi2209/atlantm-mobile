import React, { PureComponent } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';

import PropTypes from 'prop-types';

// components
import { ListItem, Body, Item, Label, Input } from 'native-base';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import { get } from 'lodash';

const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  input: {
    ...Platform.select({
      android: {
        width: 2000,
      },
    }),
  },
  inputContainer: {
    ...Platform.select({
      android: {
        flex: 3,
        justifyContent: 'center',
        overflow: 'hidden',
      },
    }),
  },
});

export default class CarCostForm extends PureComponent {
  static propTypes = {

  }

  onChangeBrand = value => this.props.brandFill(value)
  onChangeModel = value => this.props.modelFill(value)
  onChangeMileage = value => this.props.mileageFill(value)
  onChangeVin = value => this.props.vinFill(value)
  onChangeColor = value => this.props.colorFill(value)

  renderItem = ({ label, value, onChange, inputProps = {}, isLast }) => {
    const renderInput = () => (
      <Input
        multiline={isAndroid}
        numberOfLines={1}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Поле для заполнения"
        onChangeText={onChange}
        value={value}
        returnKeyType="done"
        returnKeyLabel="Готово"
        underlineColorAndroid="transparent"
        {...inputProps}
      />
    );

    return (
      <View style={stylesList.listItemContainer}>
        <ListItem last={isLast} style={[stylesList.listItem, stylesList.listItemReset]} >
          <Body>
            <Item style={[stylesList.inputItem, styles.inputItem]} fixedLabel>
              <Label style={[stylesList.label, styles.label]}>{label}</Label>
              {
                isAndroid ?
                  <View style={styles.inputContainer}>{renderInput()}</View> :
                  renderInput()
              }
            </Item>
          </Body>
        </ListItem>
      </View>
    );
  }

  render() {
    const {
      vin,
      brand,
      model,
      year,
      mileage,
      mileageUnit,
      engineVolume,
      engineType,
      gearbox,
      color,
      carCondition,
    } = this.props;

    return (
      <View>
        {this.renderItem({
          label: 'Марка',
          value: brand,
          onChange: this.onChangeBrand,
        })}
        {this.renderItem({
          label: 'Модель',
          value: model,
          onChange: this.onChangeModel,
        })}
        {this.renderItem({
          label: 'Пробег',
          value: mileage,
          onChange: this.onChangeMileage,
          inputProps: {
            keyboardType: 'numeric',
          },
        })}
        {this.renderItem({
          label: 'VIN',
          value: vin,
          onChange: this.onChangeVin,
        })}
        {this.renderItem({
          label: 'Цвет',
          value: color,
          onChange: this.onChangeColor,
        })}
      </View>
    );
  }
}
