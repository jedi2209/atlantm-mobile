import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Animated,
  Keyboard,
  StyleSheet,
  Picker,
  Alert,
  Platform,
} from 'react-native';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../style-const';
import numberWithGap from '../../utils/number-with-gap';

const styles = StyleSheet.create({
});

export default class ColorBox extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
  };

  static defaultProps = {
    height: 259,
    duration: 300,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
    };
  }

  setModalVisible = (visible) => {
    const {height, duration} = this.props;

    // slide animation
    if (visible) {
      this.setState({
        modalVisible: visible,
      });
      return Animated.timing(this.state.animatedHeight, {
        duration,
        toValue: height,
      }).start();
    } else {
      return Animated.timing(this.state.animatedHeight, {
        duration,
        toValue: 0,
      }).start(() => {
        this.setState({
          modalVisible: false,
        });
      });
    }
  };

  onPressCancel = () => {
    this.setModalVisible(false);
    this.props.onCloseModal();
  };

  onPress = () => {
    Keyboard.dismiss();

    this.setModalVisible(true);

    this.props.onPressModal();
  };

  render() {
    const {style, color} = this.props;

    return (
      <View>
        <Modal
          transparent={true}
          animationType="none"
          visible={this.state.modalVisible}
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ]}
          onRequestClose={() => {
            this.props.onCloseModal();
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <TouchableHighlight
              style={styles.datePickerMask}
              activeOpacity={1}
              underlayColor={'#00000077'}
              onPress={this.onPressMask}>
              <TouchableHighlight
                underlayColor={'#fff'}
                style={{
                  flex: 1,
                }}>
                <Animated.View
                  style={[
                    styles.datePickerCon,
                    {
                      height: this.state.animatedHeight,
                    },
                  ]}>
                  <View style={styles.topBar}>
                    <View style={styles.btnText}>
                      <Text
                        style={[styles.btnTextText, styles.btnTextCancel]}
                      />{' '}
                    </View>{' '}
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={this.onPressConfirm}
                      style={[styles.btnText, styles.btnConfirm]}>
                      <View>
                        <Text style={[styles.btnTextText]}> Готово </Text>{' '}
                      </View>{' '}
                    </TouchableHighlight>{' '}
                  </View>
                  <View style={styles.pickersContainer}>
                    <View style={styles.priceContainer}>
                      <View style={styles.priceLabelContainer}>
                        <Text style={styles.priceLabelText}> От </Text>{' '}
                      </View>{' '}
                      <Picker
                        selectedValue={this.state.minPrice}
                        onValueChange={this.onChangeMinPrice}>
                        {' '}
                        {this.renderItems()}{' '}
                      </Picker>{' '}
                    </View>{' '}
                    <View style={styles.priceContainer}>
                      <View style={styles.priceLabelContainer}>
                        <Text style={styles.priceLabelText}> До </Text>{' '}
                      </View>{' '}
                      <Picker
                        selectedValue={this.state.maxPrice}
                        onValueChange={this.onChangeMaxPrice}>
                        {' '}
                        {this.renderItems(true)}{' '}
                      </Picker>{' '}
                    </View>{' '}
                  </View>{' '}
                </Animated.View>{' '}
              </TouchableHighlight>{' '}
            </TouchableHighlight>{' '}
          </View>{' '}
        </Modal>

        <TouchableComponent
          underlayColor={styleConst.color.select}
          style={style}
          onPress={this.onPress}>
          {' '}
          {children}{' '}
        </TouchableComponent>
      </View>
    );
  }
}
