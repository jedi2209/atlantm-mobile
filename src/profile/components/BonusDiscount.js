import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';

// components
import ListItemHeader from './ListItemHeader';
import { ListItem, Body, Left, Right, Icon } from 'native-base';

// styles
import stylesList from '../../core/components/Lists/style';

const icons = {
  bonus: require('../assets/bonus.png'),
  discount: require('../assets/discount.png'),
};

export default class Auth extends Component {
  static propTypes = {
    bonus: PropTypes.number,
    discounts: PropTypes.number,
    navigation: PropTypes.object,
  }

  static defaultProps = {
    bonus: null,
    discounts: null,
  }

  onPressBonus = () => this.props.navigation.navigate('BonusScreen')
  onPressDiscount = () => this.props.navigation.navigate('DiscountScreen')

  renderItem = (label, iconName, onPressHandler, badge, isLast) => {
    return (
      <View style={stylesList.listItemContainer}>
        <ListItem
          icon
          last={isLast}
          style={stylesList.listItem}
          onPress={onPressHandler}
        >
          <Left>
            <Image style={stylesList.iconLeft} source={icons[iconName]} />
          </Left>
          <Body>
            <Text style={stylesList.label}>{label}</Text>
          </Body>
          <Right>
            {badge ? <Text style={stylesList.badgeText}>{badge}</Text> : null}
            <Icon name="arrow-forward" style={[stylesList.iconArrow, stylesList.iconArrowWithText]} />
          </Right>
        </ListItem>
      </View>
    );
  }

  render() {
    const { bonus, discounts } = this.props;

    return (
      <View>
         <ListItemHeader text="БОНУСЫ И СКИДКИ" />
         {this.renderItem('Бонусные баллы', 'bonus', this.onPressBonus, bonus)}
         {this.renderItem('Персональные скидки', 'discount', this.onPressDiscount, discounts, true)}
      </View>
    );
  }
}
