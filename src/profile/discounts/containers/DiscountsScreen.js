import React, {Component} from 'react';
import {SafeAreaView, View, FlatList, StyleSheet} from 'react-native';
import {Text, StyleProvider, ListItem, Body} from 'native-base';

// redux
import {connect} from 'react-redux';

// helpers
import {get} from 'lodash';
import PropTypes from 'prop-types';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import Amplitude from '../../../utils/amplitude-analytics';
import strings from '../../../core/lang/const';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  message: {
    textAlign: 'center',
    fontFamily: styleConst.font.regular,
    fontSize: 17,
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percent: {
    color: '#000',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  title: {
    color: '#000',
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  dealer: {
    fontSize: 14,
    color: styleConst.color.greyText2,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  description: {
    fontSize: 16,
    color: styleConst.color.greyText3,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    marginTop: 5,
  },
  body: {
    paddingVertical: 5,
  },
});

const mapStateToProps = ({profile, nav}) => {
  return {
    nav,
    discounts: profile.discounts,
  };
};

class DiscountsScreen extends Component {
  state = {isRefreshing: false};

  static propTypes = {
    discounts: PropTypes.array,
  };

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen =
          get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
          'DiscountsScreen';
      }
    }

    return isActiveScreen;
  }

  renderItem = ({item: discount, index}) => {
    const {discounts} = this.props;

    return (
      <ListItem last={discounts.length - 1 === index}>
        <Body style={styles.body}>
          <View style={styles.header}>
            {discount.value ? (
              <Text style={styles.percent}>{discount.value}%</Text>
            ) : null}
            {discount.dealer && discount.dealer.name ? (
              <Text style={styles.dealer}>{discount.dealer.name}</Text>
            ) : null}
          </View>
          {discount.name ? (
            <Text style={styles.title}>{discount.name}</Text>
          ) : null}
          {discount.additional ? (
            <Text style={styles.description}>{discount.additional}</Text>
          ) : null}
        </Body>
      </ListItem>
    );
  };

  renderEmptyComponent = () => {
    return (
      <Text style={styles.message}>{strings.DiscountsScreen.empty.text}</Text>
    );
  };

  render() {
    console.log('== DiscountsScreen ==');
    Amplitude.logEvent('screen', 'lkk/discounts');

    const {discounts} = this.props;

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <FlatList
            data={discounts}
            style={styles.list}
            ListEmptyComponent={this.renderEmptyComponent}
            renderItem={this.renderItem}
            keyExtractor={(item) => `${item.hash.toString()}`}
          />
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps)(DiscountsScreen);
