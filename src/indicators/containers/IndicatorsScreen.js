import React, {Component} from 'react';
import {findNodeHandle, Image, Dimensions} from 'react-native';
import {
  ScrollView,
  Container,
  Stack,
  Box,
  Popover,
  Button,
  View,
  Text,
  IconButton,
  StatusBar,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionSetActiveIndicator, actionFetchIndicators} from '../actions';

// components
import LogoLoader from '../../core/components/LogoLoader';
import EmptyMessage from '../../core/components/EmptyMessage';
// import IndicatorsRow from '../components/_old_IndicatorsRow';

// helpers
import {get} from 'lodash';
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
      return <LogoLoader />;
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
                  key={'popover-indicator-' + indicator.id}
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
                  <Popover.Content
                    accessibilityLabel={get(indicator, 'name', 'Индикатор')}>
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
