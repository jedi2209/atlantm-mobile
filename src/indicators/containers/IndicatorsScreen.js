import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, View, StyleSheet, NetInfo } from 'react-native';
import { Content, Container, StyleProvider } from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionSetActiveIndicator, actionFetchIndicators } from '../actions';

// components
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import SpinnerView from '../../core/components/SpinnerView';
import EmptyMessage from '../../core/components/EmptyMessage';
import IndicatorsRow from '../components/IndicatorsRow';

// helpers
import { get } from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import styleHeader from '../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
});

const mapStateToProps = ({ nav, indicators }) => {
  return {
    nav,
    items: indicators.items,
    activeItem: indicators.activeItem,
    isRequest: indicators.meta.isRequest,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionSetActiveIndicator,
    actionFetchIndicators,
  }, dispatch);
};

class IndicatorsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Индикаторы',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <View />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  })

  static propTypes = {
    navigation: PropTypes.object,
    items: PropTypes.array,
    activeItem: PropTypes.object,
    isRequest: PropTypes.bool,
    actionSetActiveIndicator: PropTypes.func,
    actionFetchIndicators: PropTypes.func,
  }

  componentDidMount() {
    const { items, actionFetchIndicators, actionSetActiveIndicator } = this.props;

    // NetInfo.isConnected.fetch().then(isConnected => {
    //   if (!isConnected) {
    //     if (items.length === 0) {
    //       setTimeout(() => Alert.alert('Отсутствует интернет соединение'), 100);
    //     }

    //     return false;
    //   }


    // });

    actionSetActiveIndicator({});
    actionFetchIndicators();
  }

  shouldComponentUpdate(nextProps) {
    const { items, activeItem, isRequest } = this.props;
    const nav = nextProps.nav.newState;
    const isActiveScreen = nav.routes[nav.index].routeName === 'IndicatorsScreen';

    return (items.length !== nextProps.items.length && isActiveScreen) ||
      (activeItem.id !== nextProps.activeItem.id && isActiveScreen) ||
      (isRequest !== nextProps.isRequest && isActiveScreen);
  }

  onPressIndicator = (indicator) => {
    console.log('on press indicator');
    this.props.actionSetActiveIndicator(indicator);
  }

  render() {
    const { items, activeItem, isRequest } = this.props;

    if (isRequest) {
      return <SpinnerView />;
    }

    if (items.length === 0) {
      return <EmptyMessage text="Нет индикаторов для отображения" />;
    }

    console.log('== IndicatorsScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>

          {
            items.map((indicators, idx) => {
              console.log('indicators', indicators);

              return (
                <IndicatorsRow
                  key={`indicator-row-${idx}`}
                  items={indicators}
                  activeItem={activeItem}
                  onPressItem={this.onPressIndicator}
                />
              );
            })
          }

          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorsScreen);
