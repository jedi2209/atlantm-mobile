import React, { Component } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { StyleProvider, Container, Content, ListItem, Body, Right, Icon, Row, Col, Item, Label } from 'native-base';

// redux
import { connect } from 'react-redux';
import { CAR_HISTORY_DETAILS__FAIL } from '../../actionTypes';
import {
  actionFetchCarHistory,
  actionSetCarHistoryLevel1,
  actionSetCarHistoryLevel2,
} from '../../actions';

// components
import * as Animatable from 'react-native-animatable';
import SpinnerView from '../../../core/components/SpinnerView';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import { get, isEmpty } from 'lodash';
import { dayMonthYear } from '../../../utils/date';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import numberWithGap from '../../../utils/number-with-gap';
import { MONTH_TEXT } from '../../const';
import { ERROR_NETWORK } from '../../../core/const';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
  },

  // section
  sectionProp: {
    paddingRight: 5,
    marginTop: 5,
  },
  sectionValue: {
    marginTop: 5,
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 17,
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 16,
  },
});

const mapStateToProps = ({ nav, profile }) => {
  return {
    nav,
    isFetchCarHistoryDetails: profile.carHistoryDetails.meta.isFetchCarHistoryDetails,
  };
};

const mapDispatchToProps = {
  actionFetchCarHistoryDetails,
};

class CarHistoryDetailsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerTitle: params.title,
      headerStyle: stylesHeader.common,
      headerTitleStyle: stylesHeader.title,
      headerLeft: <HeaderIconBack navigation={navigation} />,
      headerRight: <View />,
    };
  }

  componentDidMount() {
    const { auth, navigation, actionFetchCarHistoryDetails } = this.props;
    const vin = get(navigation, 'state.params.car.vin');
    const title = get(navigation, 'state.params.title');
    const token = get(auth, 'token.id');

    navigation.setParams({ title });

    actionFetchCarHistoryDetails({ vin, token })
      .then(action => {
        if (action.type === CAR_HISTORY_DETAILS__FAIL) {
          let message = get(action, 'payload.message', 'Произошла ошибка, попробуйте снова');

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(() => Alert.alert(message), 100);
        }
      });
  }

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'CarHistoryDetailsScreen';
      }
    }

    return isActiveScreen;
  }

  render() {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarHistoryDetailsScreen);
