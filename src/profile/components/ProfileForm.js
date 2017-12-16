import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

// components
import { ListItem, Body, Item, Label, Input } from 'native-base';
import ListItemHeader from '../components/ListItemHeader';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
// import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  inputItem: {
    paddingRight: 7,
  },
});

export default class ProfileForm extends PureComponent {
  static propTypes = {
    auth: PropTypes.object,

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

  getCarSectionTitle = () => {
    const { auth } = this.props;

    let title = 'МОЙ АВТОМОБИЛЬ';

    if (auth.cars && auth.cars.length >= 2) {
      title = 'МОИ АВТОМОБИЛИ';
    }

    return title;
  }

  renderCars = () => {
    const { auth } = this.props;

    return auth.cars.map((car, idx, carArray) => {
      return (
        <View key={`${car.brand}${idx}`} style={stylesList.listItemContainer}>
          <ListItem last={(carArray.length - 1) === idx} style={[stylesList.listItem, stylesList.listItemReset]} >
            <Body>
              <Item style={stylesList.inputItem} fixedLabel>
                <Label style={stylesList.label}>{car.brand} {car.model}</Label>
              </Item>
            </Body>
          </ListItem>
        </View>
      );
    });
  }

  renderListItem = (label, value, onChangeHandler, inputProps = {}, isLast) => {
    return (
      <View style={stylesList.listItemContainer}>
        <ListItem last={isLast} style={[stylesList.listItem, stylesList.listItemReset]} >
          <Body>
            <Item style={[stylesList.inputItem, styles.inputItem]} fixedLabel>
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
    const { auth, name, phone, email, car, carNumber, carSection } = this.props;

    return (
      <View style={styles.container}>
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
                <ListItemHeader text={this.getCarSectionTitle()} />
                {!auth.cars ? this.renderListItem('Авто', car, this.onChangeCar) : null}
                {!auth.cars ? this.renderListItem('Гос. номер', carNumber, this.onChangeCarNumber, {}, true) : null}

                { auth.cars ? this.renderCars() : null }
              </View>
            ) : null
        }
      </View>
    );
  }
}
