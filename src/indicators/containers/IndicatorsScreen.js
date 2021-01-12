import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, findNodeHandle, Text, StatusBar} from 'react-native';
import {Container, Content, StyleProvider} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionSetActiveIndicator, actionFetchIndicators} from '../actions';

// components
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import SpinnerView from '../../core/components/SpinnerView';
import EmptyMessage from '../../core/components/EmptyMessage';
import IndicatorsRow from '../components/IndicatorsRow';

// helpers
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import strings from '../../core/lang/const';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({nav, indicators}) => {
  return {
    nav,
    items: indicators.items,
    activeItem: indicators.activeItem,
    isRequest: indicators.meta.isRequest,
  };
};

const mapDispatchToProps = {
  actionSetActiveIndicator,
  actionFetchIndicators,
};

class IndicatorsScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const returnScreen =
      navigation.state.params && navigation.state.params.returnScreen;

    return {
      headerTitle: (
        <Text style={stylesHeader.blueHeaderTitle}>
          {strings.IndicatorsScreen.title}
        </Text>
      ),
      headerStyle: stylesHeader.blueHeader,
      headerTitleStyle: stylesHeader.blueHeaderTitle,
      headerLeft: (
        <View>
          <HeaderIconBack
            theme="white"
            navigation={navigation}
            returnScreen={returnScreen}
          />
        </View>
      ),
      headerRight: <View />,
    };
  };

  static propTypes = {
    navigation: PropTypes.object,
    items: PropTypes.array,
    activeItem: PropTypes.object,
    isRequest: PropTypes.bool,
    actionSetActiveIndicator: PropTypes.func,
    actionFetchIndicators: PropTypes.func,
  };

  componentDidMount() {
    const {actionFetchIndicators, actionSetActiveIndicator} = this.props;

    actionSetActiveIndicator({});
    actionFetchIndicators();
  }

  shouldComponentUpdate(nextProps) {
    const {items, activeItem, isRequest} = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen =
      nav.routes[nav.index].routeName === 'IndicatorsScreen';

    return (
      (items.length !== nextProps.items.length && isActiveScreen) ||
      (activeItem.id !== nextProps.activeItem.id && isActiveScreen) ||
      (isRequest !== nextProps.isRequest && isActiveScreen)
    );
  }

  onPressIndicator = (descriptionRef, indicator) => {
    const {activeItem, actionSetActiveIndicator} = this.props;
    const newIndicator = indicator.id === activeItem.id ? {} : indicator;

    actionSetActiveIndicator(newIndicator);
    this.setScrollPosition(descriptionRef);
  };

  setScrollPosition(descriptionRef) {
    const target = findNodeHandle(descriptionRef);
    this.scrollView._root.scrollToFocusedInput(target);
  }

  render() {
    const {items, activeItem, isRequest} = this.props;

    if (isRequest) {
      return <SpinnerView />;
    }

    if (items.length === 0) {
      return <EmptyMessage text={strings.IndicatorsScreen.empty.text} />;
    }

    console.log('== IndicatorsScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container style={styles.safearea}>
          <StatusBar barStyle="light-content" />
          <Content
            ref={(scrollView) => {
              this.scrollView = scrollView;
            }}>
            {items.map((indicators, idx) => {
              return (
                <IndicatorsRow
                  key={`indicator-row-${idx}`}
                  items={indicators}
                  activeItem={activeItem}
                  onPressItem={this.onPressIndicator}
                />
              );
            })}
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorsScreen);
