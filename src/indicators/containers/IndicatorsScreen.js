import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  findNodeHandle,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {
  Container,
  Stack,
  Box,
  Popover,
  Button,
  IconButton,
  StatusBar,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionSetActiveIndicator, actionFetchIndicators} from '../actions';

// components
import SpinnerView from '../../core/components/SpinnerView';
import EmptyMessage from '../../core/components/EmptyMessage';
// import IndicatorsRow from '../components/_old_IndicatorsRow';

// helpers
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';

const {width: screenWidth} = Dimensions.get('window');

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
    const {actionFetchIndicators, actionSetActiveIndicator, region} =
      this.props;

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
    // this.scrollView._root.scrollToFocusedInput(target);
  }

  render() {
    const {items, activeItem, isRequest} = this.props;

    if (isRequest) {
      return (
        <SpinnerView containerStyle={{backgroundColor: styleConst.color.bg}} />
      );
    }

    if (items.length === 0) {
      return <EmptyMessage text={strings.IndicatorsScreen.empty.text} />;
    }

    console.info('== IndicatorsScreen ==');

    return (
      <>
        <StatusBar hidden={false} />
        <ScrollView style={{backgroundColor: styleConst.color.white}}>
          <Text style={styleConst.text.bigHead}>
            {strings.Menu.main.indicators}
          </Text>
          <View
            style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
              marginLeft: 10,
              justifyContent: 'space-between',
            }}>
            {items.map(indicator => {
              return (
                <Popover
                  trigger={triggerProps => {
                    return (
                      <IconButton
                        {...triggerProps}
                        style={{
                          marginBottom: 10,
                          backgroundColor: triggerProps['aria-expanded']
                            ? styleConst.color.systemBlue
                            : styleConst.color.white,
                        }}
                        icon={
                          <Image
                            resizeMode="contain"
                            style={{
                              width: screenWidth / 5,
                              height: screenWidth / 5,
                            }}
                            source={{
                              uri: triggerProps['aria-expanded']
                                ? indicator.img.white
                                : indicator.img.blue,
                            }}
                          />
                        }
                      />
                    );
                  }}>
                  <Popover.Content accessibilityLabel={indicator.name}>
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Header backgroundColor={styleConst.color.white}>
                      {indicator.name}
                    </Popover.Header>
                    <Popover.Body backgroundColor={styleConst.color.white}>
                      {indicator.description}
                    </Popover.Body>
                  </Popover.Content>
                </Popover>
              );
            })}
          </View>
        </ScrollView>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorsScreen);
