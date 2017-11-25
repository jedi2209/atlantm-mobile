import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

// components
import { ListItem, Body, Item, Label, Input } from 'native-base';
import ListItemHeader from '../components/ListItemHeader';

// stylesList
import stylesList from '../../core/components/Lists/style';

export default class ProfileForm extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    car: PropTypes.string,
    carNumber: PropTypes.string,

    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    carFill: PropTypes.func,
    carNumberFill: PropTypes.func,
    carSection: PropTypes.bool,
  }

  static defaultProps = {
    name: '',
    phone: '',
    email: '',
    car: '',
    carNumber: '',
    carSection: false,
  }

  onChangeName = (value) => this.props.nameFill(value)
  onChangePhone = (value) => this.props.phoneFill(value)
  onChangeEmail = (value) => this.props.emailFill(value)
  onChangeCar = (value) => this.props.carFill(value)
  onChangeCarNumber = (value) => this.props.carNumberFill(value)

  renderListItem = (label, value, onChangeHandler, inputProps = {}, isLast) => {
    return (
      <View style={stylesList.listItemContainer}>
        <ListItem last={isLast} style={[stylesList.listItem, stylesList.listItemReset]} >
          <Body>
            <Item style={stylesList.inputItem} fixedLabel>
              <Label style={stylesList.label}>{label}</Label>
              <Input
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Поле для заполнения"
                onChangeText={onChangeHandler}
                value={value}
                returnKeyType="done"
                returnKeyLabel="Готово"
                underlineColorAndroid="transparent"
                {...inputProps}
              />
            </Item>
          </Body>
        </ListItem>
      </View>
    );
  }

  render() {
    const { name, phone, email, car, carNumber, carSection } = this.props;

    return (
      <View>
        {this.renderListItem('ФИО', name, this.onChangeName)}
        {this.renderListItem('Телефон', phone, this.onChangePhone, {
          maxLength: 20,
          keyboardType: 'phone-pad',
        })}
        {this.renderListItem('Email', email, this.onChangeEmail, {
          keyboardType: 'email-address',
        }, true)}

        {
          carSection ?
            (
              <View>
                <ListItemHeader text="МОЙ АВТОМОБИЛЬ" />
                {this.renderListItem('Авто', car, this.onChangeCar)}
                {this.renderListItem('Гос. номер', carNumber, this.onChangeCarNumber, {}, true)}
              </View>
            ) : null
        }
      </View>
    );
  }
}
