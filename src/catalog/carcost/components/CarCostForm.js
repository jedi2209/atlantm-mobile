import React, { PureComponent } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';

// components
import { ListItem, Body, Item, Label, Input, Right, Icon, Segment, Button } from 'native-base';
import YearPicker from './YearPicker';
import ActionSheet from '../../../../node_modules/react-native-actionsheet/lib/ActionSheetCustom';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {
  MILEAGE_UNIT_KM,
  MILEAGE_UNIT_MILES,
  ENGINE_TYPES_PETROL,
  ENGINE_TYPES_DIESEL,
  ENGINE_TYPES_HYBRID,
  GEARBOX_AUTO,
  GEARBOX_MECHANIC,
  CAR_CONDITION_GOOD,
  CAR_CONDITION_BROKEN,
  CAR_CONDITION_NOT_GO,
} from '../const';
import styleConst from '../../../core/style-const';

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
  listItemValueContainer: {
    flex: 2.5,
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'red',
  },
  label: {
    ...Platform.select({
      android: {
        flex: 1.8,
      },
      ios: {
        flex: 2,
      },
    }),
  },
  labelSmall: {
    fontSize: 16,
    ...Platform.select({
      android: {
        fontSize: 15,
      },
    }),
  },
  segment: {
    backgroundColor: 'transparent',
    flex: 3,
  },
  actionSheetItemContainer: {
    width: 200,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionSheetItemText: {
    fontSize: 18,
  },
  actionSheetItemTextActive: {
    color: '#007aff',
  },
  actionSheetItemIcon: {
    fontSize: 40,
    color: styleConst.color.systemBlue,
    marginRight: 10,
    marginLeft: -25,
  },
  itemOneLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiddenListItemContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default class CarCostForm extends PureComponent {
  static propTypes = {

  }

  onChangeBrand = value => this.props.brandFill(value)
  onChangeModel = value => this.props.modelFill(value)
  onChangeYear = value => {
    if (value) {
      this.props.yearSelect(value);
    }
  }
  onChangeMileage = value => this.props.mileageFill(value)
  onChangeMileageUnit = value => this.props.mileageUnitSelect(value)
  onChangeEngineVolume = value => this.props.engineVolumeFill(value)
  onChangeVin = value => this.props.vinFill(value)
  onChangeColor = value => this.props.colorFill(value)

  onPressVariantEngineType = (index) => {
    if (index !== 0) {
      const engineType = [ENGINE_TYPES_PETROL, ENGINE_TYPES_DIESEL, ENGINE_TYPES_HYBRID][index - 1];
      this.props.engineTypeSelect(engineType);
    }
  }

  onPressVariantGearbox = (index) => {
    if (index !== 0) {
      const gearbox = [GEARBOX_AUTO, GEARBOX_MECHANIC][index - 1];
      this.props.gearboxSelect(gearbox);
    }
  }

  onPressVariantCarCondition = (index) => {
    if (index !== 0) {
      const carCondition = [CAR_CONDITION_GOOD, CAR_CONDITION_BROKEN, CAR_CONDITION_NOT_GO][index - 1];
      this.props.carConditionSelect(carCondition);
    }
  }

  renderOptionsEngineType = (value) => {
    const isActivePetrol = value === ENGINE_TYPES_PETROL;
    const isActiveDiesel = value === ENGINE_TYPES_DIESEL;
    const isActiveHybrid = value === ENGINE_TYPES_HYBRID;

    return [
      'Отмена',
      <View style={styles.actionSheetItemContainer}>
        {
           isActivePetrol ?
            <Icon name="ios-checkmark" style={styles.actionSheetItemIcon} /> :
            null
        }
        <Text style={[
          styles.actionSheetItemText,
          isActivePetrol ? styles.actionSheetItemTextActive : null,
        ]}>{ENGINE_TYPES_PETROL}</Text>
      </View>,
      <View style={styles.actionSheetItemContainer}>
        {
          isActiveDiesel ?
            <Icon name="ios-checkmark" style={styles.actionSheetItemIcon} /> :
            null
        }
        <Text style={[
          styles.actionSheetItemText,
          isActiveDiesel ? styles.actionSheetItemTextActive : null,
        ]}>{ENGINE_TYPES_DIESEL}</Text>
      </View>,
      <View style={styles.actionSheetItemContainer}>
        {
           isActiveHybrid ?
            <Icon name="ios-checkmark" style={styles.actionSheetItemIcon} /> :
            null
        }
        <Text style={[
          styles.actionSheetItemText,
          isActiveHybrid ? styles.actionSheetItemTextActive : null,
        ]}>{ENGINE_TYPES_HYBRID}</Text>
      </View>,
    ];
  }

  renderOptionsGearbox = (value) => {
    const isActiveAuto = value === GEARBOX_AUTO;
    const isActiveMechanic = value === GEARBOX_MECHANIC;

    return [
      'Отмена',
      <View style={styles.actionSheetItemContainer}>
        {
           isActiveAuto ?
            <Icon name="ios-checkmark" style={styles.actionSheetItemIcon} /> :
            null
        }
        <Text style={[
          styles.actionSheetItemText,
          isActiveAuto ? styles.actionSheetItemTextActive : null,
        ]}>{GEARBOX_AUTO}</Text>
      </View>,
      <View style={styles.actionSheetItemContainer}>
        {
          isActiveMechanic ?
            <Icon name="ios-checkmark" style={styles.actionSheetItemIcon} /> :
            null
        }
        <Text style={[
          styles.actionSheetItemText,
          isActiveMechanic ? styles.actionSheetItemTextActive : null,
        ]}>{GEARBOX_MECHANIC}</Text>
      </View>,
    ];
  }

  renderOptionsCarCondition = (value) => {
    const isActiveGood = value === CAR_CONDITION_GOOD;
    const isActiveBroken = value === CAR_CONDITION_BROKEN;
    const isActiveNotGo = value === CAR_CONDITION_NOT_GO;

    return [
      'Отмена',
      <View style={styles.actionSheetItemContainer}>
        {
           isActiveGood ?
            <Icon name="ios-checkmark" style={styles.actionSheetItemIcon} /> :
            null
        }
        <Text style={[
          styles.actionSheetItemText,
          isActiveGood ? styles.actionSheetItemTextActive : null,
        ]}>{CAR_CONDITION_GOOD}</Text>
      </View>,
      <View style={styles.actionSheetItemContainer}>
        {
          isActiveBroken ?
            <Icon name="ios-checkmark" style={styles.actionSheetItemIcon} /> :
            null
        }
        <Text style={[
          styles.actionSheetItemText,
          isActiveBroken ? styles.actionSheetItemTextActive : null,
        ]}>{CAR_CONDITION_BROKEN}</Text>
      </View>,
      <View style={styles.actionSheetItemContainer}>
        {
           isActiveNotGo ?
            <Icon name="ios-checkmark" style={styles.actionSheetItemIcon} /> :
            null
        }
        <Text style={[
          styles.actionSheetItemText,
          isActiveNotGo ? styles.actionSheetItemTextActive : null,
        ]}>{CAR_CONDITION_NOT_GO}</Text>
      </View>,
    ];
  }

  renderVariansItem = ({ id, label, value, last }) => {
    const onPressHandler = () => this[`actionSheet${id}`].show();
    const options = this[`renderOptions${id}`](value);

    return (
      <View>
        <ActionSheet
          cancelButtonIndex={0}
          ref={component => this[`actionSheet${id}`] = component}
          title={label}
          options={options}
          onPress={this[`onPressVariant${id}`]}
        />

        <View style={stylesList.listItemContainer}>
          <ListItem last={last} style={stylesList.listItemPressable} onPress={onPressHandler}>
            <Body style={styles.body}>
              <View style={styles.itemOneLine}>
                <Label style={[stylesList.label, styles.label, styles.labelSmall]}>{label}</Label>
                <View style={[stylesList.listItemValueContainer, styles.listItemValueContainer]}>
                  <Text style={stylesList.listItemValue}>{value || 'Выбрать'}</Text>
                </View>
              </View>
            </Body>
            <Right style={styles.right}>
              <Icon name="arrow-forward" style={stylesList.iconArrow} />
            </Right>
          </ListItem>
        </View>
      </View>
    );
  }

  renderDateItem = ({ label, value, onChange }) => {
    const getList = (insertPicker) => {
      return (
        <View style={stylesList.listItemContainer}>
          {!insertPicker ? <View style={styles.hiddenListItemContainer} /> : null }
          <ListItem button={false} style={stylesList.listItemPressable}>
            <Body style={styles.body} >
              <View style={styles.itemOneLine}>
                <Label style={[stylesList.label, styles.label, styles.labelSmall]}>{label}</Label>
                <View style={[stylesList.listItemValueContainer, {
                  ...Platform.select({
                    android: {
                      flex: 4.4,
                      marginRight: -(styleConst.ui.horizontalGapInList),
                    },
                  }),
                }]}>
                  {
                    insertPicker ?
                      <YearPicker onCloseModal={onChange} /> :
                      <Text style={stylesList.listItemValue}>{value || 'Выбрать'}</Text>
                  }
                </View>
              </View>
            </Body>
            {
              !insertPicker ?
                (
                  <Right style={styles.right}>
                    <Icon name="arrow-forward" style={stylesList.iconArrow} />
                  </Right>
                ) : null
            }
          </ListItem>
        </View>
      )
    };

    return (
      Platform.OS === 'ios' ?
        (
          <YearPicker onCloseModal={onChange}>
            {getList()}
          </YearPicker>
        ) :
        getList(true)
    );
  }

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
              <Label style={[stylesList.label, styles.labelText, styles.labelSmall]}>{label}</Label>
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

  renderMileageUnitItem = ({ label, value }) => {
    const isKm = value === MILEAGE_UNIT_KM;

    return (
      <View style={stylesList.listItemContainer}>
        <ListItem style={stylesList.listItemPressable}>
          <Body style={styles.body} >
            <Item style={stylesList.inputItem} fixedLabel>
              <Label style={[stylesList.label, styles.labelSmall]}>{label}</Label>
              <View style={[stylesList.listItemValueContainer, styles.listItemValueContainer]}>
                <Segment style={styles.segment}>
                  <Button
                    first
                    active={isKm}
                    onPress={() => this.props.mileageUnitSelect(MILEAGE_UNIT_KM)}
                  >
                    <Text style={{ color: isKm ? '#fff' : styleConst.color.systemBlue }}>км</Text>
                  </Button>
                  <Button
                    last
                    active={!isKm}
                    onPress={() => this.props.mileageUnitSelect(MILEAGE_UNIT_MILES)}
                  >
                    <Text style={{ color: !isKm ? '#fff' : styleConst.color.systemBlue }}>мили</Text>
                  </Button>
                </Segment>
              </View>
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
          label: 'VIN',
          value: vin,
          onChange: this.onChangeVin,
        })}
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
          label: 'Цвет',
          value: color,
          onChange: this.onChangeColor,
        })}
        {this.renderItem({
          label: 'Пробег',
          value: mileage,
          onChange: this.onChangeMileage,
          inputProps: {
            keyboardType: 'numeric',
          },
        })}
        {this.renderMileageUnitItem({
          label: 'Пробег (тип)',
          value: mileageUnit,
          onChange: this.onChangeMileageUnit,
        })}
        {this.renderItem({
          label: 'Объем (см³)',
          value: engineVolume,
          onChange: this.onChangeEngineVolume,
          inputProps: {
            keyboardType: 'numeric',
          },
        })}
        {this.renderVariansItem({
          id: 'EngineType', // для actionSheet
          label: 'Тип двигателя',
          value: engineType,
        })}
        {this.renderVariansItem({
          id: 'Gearbox', // для actionSheet
          label: 'Трансмиссия',
          value: gearbox,
        })}
        {this.renderDateItem({
          label: 'Год выпуска',
          value: year,
          onChange: this.onChangeYear,
        })}
        {this.renderVariansItem({
          id: 'CarCondition', // для actionSheet
          label: 'Состояние',
          value: carCondition,
          last: true,
        })}
      </View>
    );
  }
}
