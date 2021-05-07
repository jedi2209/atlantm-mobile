import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, findNodeHandle, Text} from 'react-native';
import {Container, Content, StyleProvider} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionSetActiveIndicator, actionFetchIndicators} from '../actions';

// components
import SpinnerView from '../../core/components/SpinnerView';
import EmptyMessage from '../../core/components/EmptyMessage';
import IndicatorsRow from '../components/IndicatorsRow';

// helpers
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.new.mainbg,
  },
});

const mapStateToProps = ({nav, indicators, core}) => {
  return {
    nav,
    items: indicators.items,
    activeItem: indicators.activeItem,
    isRequest: indicators.meta.isRequest,
    region: core.language.selected,
  };
};

const mapDispatchToProps = {
  actionSetActiveIndicator,
  actionFetchIndicators,
};

class IndicatorsScreen extends Component {
  static propTypes = {
    items: PropTypes.array,
    activeItem: PropTypes.object,
    isRequest: PropTypes.bool,
    actionSetActiveIndicator: PropTypes.func,
    actionFetchIndicators: PropTypes.func,
  };

  componentDidMount() {
    const {
      actionFetchIndicators,
      actionSetActiveIndicator,
      region,
    } = this.props;

    actionSetActiveIndicator({});
    actionFetchIndicators(region);
  }

  shouldComponentUpdate(nextProps) {
    const {items, activeItem, isRequest} = this.props;

    return (
      items.length !== nextProps.items.length ||
      activeItem.id !== nextProps.activeItem.id ||
      isRequest !== nextProps.isRequest
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
      return (
        <SpinnerView
          containerStyle={{backgroundColor: styleConst.new.mainbg}}
        />
      );
    }

    if (items.length === 0) {
      return <EmptyMessage text={strings.IndicatorsScreen.empty.text} />;
    }

    console.log('== IndicatorsScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container style={styles.safearea}>
          <Content
            ref={(scrollView) => {
              this.scrollView = scrollView;
            }}>
            <Text style={styleConst.text.bigHead}>
              {strings.Menu.main.indicators}
            </Text>
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
