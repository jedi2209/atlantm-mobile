import React, { PureComponent } from 'react';
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
} from 'react-native';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../style-const';
import priceSet from '../../utils/price-set';

const styles = StyleSheet.create({
  datePickerMask: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#00000077',
  },
  datePickerCon: {
    backgroundColor: '#fff',
    height: 0,
    overflow: 'hidden',
  },
  btnText: {
    position: 'absolute',
    top: 0,
    height: 42,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextText: {
    fontSize: 17,
    color: styleConst.color.systemBlue,
    fontFamily: styleConst.font.regular,
  },
  btnTextCancel: {
    color: styleConst.color.greyText,
  },
  btnCancel: {
    left: 0,
  },
  btnConfirm: {
    right: 0,
  },
  topBar: {
    backgroundColor: styleConst.color.header,
    height: 44,
  },
  pickersContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  picker: {
    flex: 1,
  },
});

export default class PricePicker extends PureComponent {
  static propTypes = {
    currency: PropTypes.string,
    height: PropTypes.number,
    duration: PropTypes.number,
    onPressModal: PropTypes.func,
    onCloseModal: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    currentMinPrice: PropTypes.number,
    currentMaxPrice: PropTypes.number,
  }

  static defaultProps = {
    height: 259,
    duration: 300,
    TouchableComponent: TouchableOpacity,
  }

  constructor(props) {
    super(props);

    this.state = {
      minPrice: props.currentMinPrice,
      maxPrice: props.currentMaxPrice,
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
    };
  }

  setModalVisible = (visible) => {
    const { height, duration } = this.props;

    // slide animation
    if (visible) {
      this.setState({ modalVisible: visible });
      return Animated.timing(
        this.state.animatedHeight,
        {
          duration,
          toValue: height,
        },
      ).start();
    } else {
      return Animated.timing(
        this.state.animatedHeight,
        {
          duration,
          toValue: 0,
        },
      ).start(() => {
        this.setState({ modalVisible: false });
      });
    }
  }

  onPressMask = () => {
    this.onPressCancel();
  }

  onPressCancel = () => {
    this.setModalVisible(false);
    this.props.onCloseModal();
  }

  onPressConfirm = () => {
    const { onCloseModal, min, max } = this.props;
    let { minPrice, maxPrice } = this.state;

    if (minPrice > maxPrice) {
      return setTimeout(() => Alert.alert('Цена ОТ должна быть меньше ДО'), 100);
    }

    if (minPrice === 'min') {
      minPrice = min;
    }

    if (maxPrice === 'max') {
      maxPrice = max;
    }

    this.props.onCloseModal({ minPrice, maxPrice });
    this.setModalVisible(false);
  }

  onPress = () => {
    Keyboard.dismiss();

    this.setModalVisible(true);

    this.props.onPressModal();
  }

  onChangeMinPrice = (minPrice) => {
    this.setState({ minPrice });
  }

  onChangeMaxPrice = (maxPrice) => {
    this.setState({ maxPrice });
  }

  renderItems = () => {
    const { min, max, step } = this.props;

    let data = [];
    let i = min;

    for (i; i <= max; i += step) {
      data.push(<Picker.Item key={i} label={`${priceSet(i)}`} value={i} />);
    }

    if (i > max) {
      data.push(<Picker.Item key={max} label={`${priceSet(max)}`} value={max} />);
    }

    return data;
  }

  render() {
    const {
      style,
      children,
      currency,
      TouchableComponent,
    } = this.props;

    return (
      <View>
        <Modal
          transparent={true}
          animationType="none"
          visible={this.state.modalVisible}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
          onRequestClose={() => { this.props.onCloseModal(); }}
        >
          <View style={{ flex: 1 }}>
            <TouchableHighlight
              style={styles.datePickerMask}
              activeOpacity={1}
              underlayColor={'#00000077'}
              onPress={this.onPressMask}
            >
              <TouchableHighlight
                underlayColor={'#fff'}
                style={{ flex: 1 }}
              >
                <Animated.View
                  style={[styles.datePickerCon, { height: this.state.animatedHeight }]}
                >
                  <View style={styles.topBar}>
                    <View style={styles.btnText}>
                      <Text style={[styles.btnTextText, styles.btnTextCancel]}>
                        {`Цена ${currency}`}
                      </Text>
                    </View>
                    <TouchableHighlight
                      underlayColor="transparent"
                      onPress={this.onPressConfirm}
                      style={[styles.btnText, styles.btnConfirm]}
                    >
                      <View>
                        <Text style={[styles.btnTextText]}>Готово</Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                  <View style={styles.pickersContainer}>
                    <Picker style={styles.picker} selectedValue={this.state.minPrice} onValueChange={this.onChangeMinPrice}>
                      <Picker.Item key="key-min" label="От" value="min" />
                      {this.renderItems()}
                    </Picker>
                    <Picker style={styles.picker} selectedValue={this.state.maxPrice} onValueChange={this.onChangeMaxPrice}>
                      <Picker.Item key="key-max" label="До" value="max" />
                      {this.renderItems()}
                    </Picker>
                  </View>
                </Animated.View>
              </TouchableHighlight>
            </TouchableHighlight>
          </View>
        </Modal>

        <TouchableComponent underlayColor={styleConst.color.select} style={style} onPress={this.onPress}>
          {children}
        </TouchableComponent>

      </View>
    );
  }
}
