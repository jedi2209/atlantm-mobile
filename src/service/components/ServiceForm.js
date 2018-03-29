import React, { PureComponent } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

// components
import { ListItem, Body, Item, Label, Input } from 'native-base';
import DatePicker from 'react-native-datepicker';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import styleConst from '../../core/style-const';

const styles = StyleSheet.create({
  datePicker: {
    alignSelf: Platform.OS === 'ios' ? 'stretch' : 'flex-start',
    flex: 2.1,
  },
});
const datePickerStyles = {
  dateTouchBody: {
    height: styleConst.ui.listHeight,
  },
  dateInput: {
    borderWidth: 0,
    height: styleConst.ui.listHeight,
    alignItems: 'flex-start',
  },
  placeholderText: {
    alignSelf: 'flex-start',
    fontSize: 17,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
  },
  dateText: {
    fontSize: 17,
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
  },
  datePicker: {
    borderTopColor: 0,
  },
  dateIcon: {
    width: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  btnCancel: {
    padding: 10,
  },
  btnConfirm: {
    padding: 10,
  },
};

export default class ServiceForm extends PureComponent {
  static propTypes = {
    car: PropTypes.string,
    date: PropTypes.object,
    carFill: PropTypes.func,
    dateFill: PropTypes.func,
  }

  static defaultProps = {
    car: '',
    date: {},
  }

  onChangeCar = (value) => this.props.carFill(value)
  onChangeDate = (formatted, date) => this.props.dateFill({
    date,
    formatted,
  })

  render() {
    const { car, date } = this.props;

    const minDate = new Date();

    return (
      <View>
        <View style={[stylesList.listItemContainer, stylesList.listItemContainerFirst]}>
          <ListItem style={[stylesList.listItem, stylesList.listItemReset]} >
            <Body>
              <Item style={stylesList.inputItem} fixedLabel>
                <Label style={stylesList.label}>Авто</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Поле для заполнения"
                  onChangeText={this.onChangeCar}
                  value={car}
                  returnKeyType="done"
                  returnKeyLabel="Готово"
                  underlineColorAndroid="transparent"
                />
              </Item>
            </Body>
          </ListItem>
        </View>

        <View style={stylesList.listItemContainer}>
          <ListItem last style={[stylesList.listItem, stylesList.listItemReset]}>
            <Body>
              <Item style={stylesList.inputItem} fixedLabel last>
                  <Label style={[
                    stylesList.label,
                    { flex: 1 },
                  ]}>Дата</Label>
                  <DatePicker
                    style={styles.datePicker}
                    showIcon={false}
                    date={date.formatted}
                    mode="date"
                    minDate={minDate}
                    placeholder="Выбрать"
                    format="DD MMMM YYYY"
                    confirmBtnText="Выбрать"
                    cancelBtnText="Отмена"
                    customStyles={datePickerStyles}
                    onDateChange={this.onChangeDate}
                  />
                </Item>
            </Body>
          </ListItem>
        </View>

      </View>
    );
  }
}
