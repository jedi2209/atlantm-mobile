import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text, ListItem, Body, Right, Icon } from 'native-base';
import PropTypes from 'prop-types';

// components
import { verticalScale } from '../../utils/scale';

// helpers
import styleConst from '../../core/style-const';
import { dayMonth, dayMonthYear } from '../../utils/date';

const styles = StyleSheet.create({
  name: {
    fontFamily: styleConst.font.regular,
    fontSize: 17,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  date: {
    color: styleConst.color.greyText2,
    fontFamily: styleConst.font.regular,
    fontSize: 14,
    letterSpacing: styleConst.ui.letterSpacing,
    marginTop: verticalScale(5),
  },
});

export default class InfoListItem extends Component {
  static propTypes = {
    navigate: PropTypes.func,
    info: PropTypes.object,
    visited: PropTypes.array,
  }

  onPressInfo = () => {
    const { navigate, info } = this.props;

    return navigate('InfoPostScreen', { id: info.id });
  }

  processDate(date = {}) {
    return `c ${dayMonth(date.from)} по ${dayMonthYear(date.to)}`;
  }

  shouldComponentUpdate(nextProps) {
    return this.checkVisited(nextProps);
  }

  checkVisited = (nextProps = {}) => {
    const visited = nextProps.visited || this.props.visited;
    return visited.includes(this.props.info.id);
  };

  render() {
    const { info, visited } = this.props;
    const isVisited = this.checkVisited();

    console.log('== InfoListItem ==');

    return (
      <ListItem onPress={this.onPressInfo}>
        <Body>
        {
            info.name ?
              (
                <Text style={[
                  styles.name,
                  { color: isVisited ? styleConst.color.greyText : '#000' },
                ]}>
                  {info.name}
                </Text>
              ) :
              null
        }
        {
            info.date ?
              <Text style={styles.date}>{this.processDate(info.date)}</Text> :
              null
            }
        </Body>
        <Right>
        <Icon
            name="arrow-forward"
            style={{ color: isVisited ? styleConst.color.systemGray : styleConst.color.systemBlue }}
        />
        </Right>
      </ListItem>
    );
  }
}
