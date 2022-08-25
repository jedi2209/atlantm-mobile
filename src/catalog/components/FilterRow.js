import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Container,
  Button,
  Icon,
  View,
  Text,
  HStack,
  VStack,
  Box,
  Divider,
  Checkbox,
  Pressable,
  Select as SelectPicker,
} from 'native-base';

import styleConst from '../../core/style-const';

import RNBounceable from '@freakycoder/react-native-bounceable';

const WrapperFilterRow = props => {
  if (props.bounceable) {
    return (
      <RNBounceable style={styles.bounceRow} onPress={props.onPress}>
        {props.children}
      </RNBounceable>
    );
  } else {
    return <Pressable onPress={props.onPress}>{props.children}</Pressable>;
  }
};

const SingleCheckboxType = props => {
  return (
    <Box>
      <WrapperFilterRow onPress={props.onPress} bounceable={props.bounceable}>
        <HStack justifyContent={'space-between'}>
          <Text
            style={styles.fieldTitle}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {props.title}
          </Text>
          <Checkbox isChecked={props.isChecked} onChange={props.onPress} />
        </HStack>
      </WrapperFilterRow>
    </Box>
  );
};

const MultipleCheckboxType = props => {
  return (
    <Box>
      <WrapperFilterRow onPress={props.onPress} bounceable={props.bounceable}>
        <View style={styles.fieldCaptionWrapper}>
          <Text
            style={styles.fieldTitle}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {props.title}
          </Text>
          <View mt="2">
            <Text style={styles.fieldValueOne}>{props.values}</Text>
          </View>
        </View>
        <Icon size="lg" {...props.icon} />
      </WrapperFilterRow>
    </Box>
  );
};

const MultiSliderType = props => {
  return (
    <Box>
      <WrapperFilterRow onPress={props.onPress} bounceable={props.bounceable}>
        <View style={styles.fieldCaptionWrapper}>
          <Text
            style={styles.fieldTitle}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {props.title}
          </Text>
          <HStack mt="2">
            <Text style={styles.fieldValues}>{props.values.from}</Text>
            <Text style={styles.fieldValues}>{props.values.to}</Text>
          </HStack>
        </View>
        <Icon size="lg" {...props.icon} />
      </WrapperFilterRow>
    </Box>
  );
};

const FilterRow = props => {
  switch (props.type) {
    case 'singleCheckbox':
      return <SingleCheckboxType {...props} />;
    case 'multipleCheckbox':
      return <MultipleCheckboxType {...props} />;
    case 'multiSlider':
      return <MultiSliderType {...props} />;
  }
};

const styles = StyleSheet.create({
  bounceRow: {
    flexDirection: 'row',
  },
  fieldCaptionWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  fieldTitle: {
    fontSize: 16,
    color: styleConst.color.greyText4,
  },
  fieldValueOne: {
    fontSize: 13,
    color: styleConst.color.greyText5,
  },
  fieldValues: {
    fontSize: 13,
    color: styleConst.color.greyText5,
    width: '50%',
  },
});

FilterRow.propTypes = {
  type: PropTypes.oneOf(['singleCheckbox', 'multipleCheckbox', 'multiSlider']),
  bounceable: PropTypes.bool,
  onPress: PropTypes.func,
  icon: PropTypes.object,
};

FilterRow.defaultProps = {
  type: 'singleCheckbox',
  bounceable: false,
  onPress: () => {},
  icon: {
    name: 'car-convertible',
    size: 'lg',
  },
};

export default FilterRow;
