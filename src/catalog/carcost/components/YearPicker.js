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
} from 'react-native';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../../core/style-const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  },
  priceContainer: {
    flex: 1,
  },
});

export default class YearPicker extends PureComponent {
  static propTypes = {
    duration: PropTypes.number,
    period: PropTypes.number,
    height: PropTypes.number,
    onCloseModal: PropTypes.func,
  }

  static defaultProps = {
    period: 30,
    duration: 300,
    height: 259,
    TouchableComponent: TouchableOpacity,
  }

  constructor(props) {
    super(props);

    this.state = {
      year: new Date().getFullYear(),
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
    const { year } = this.state;
    this.props.onCloseModal(year);
    this.setModalVisible(false);
  }

  onPress = () => {
    Keyboard.dismiss();

    this.setModalVisible(true);
  }

  onChangeYear = year => this.setState({ year })

  renderYears = () => {
    const yearNow = new Date().getFullYear();

    return new Array(this.props.period).fill(0).map((item, idx) => {
      const year = yearNow - idx;
      return <Picker.Item key={idx} label={String(year)} value={year} />;
    });
  }

  render() {
    const {
      style,
      children,
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
          <View style={styles.container}>
            <TouchableHighlight
              style={styles.datePickerMask}
              activeOpacity={1}
              underlayColor="#00000077"
              onPress={this.onPressMask}
            >
              <TouchableHighlight
                underlayColor="red"
                style={styles.container}
              >
                <Animated.View style={[styles.datePickerCon, { height: this.state.animatedHeight }]}>
                  <View style={styles.topBar}>
                    <View style={styles.btnText}>
                      <Text style={[styles.btnTextText, styles.btnTextCancel]}>Год выпуска</Text>
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
                    <View style={styles.priceContainer}>
                      <Picker selectedValue={this.state.year} onValueChange={this.onChangeYear}>
                        {this.renderYears()}
                      </Picker>
                    </View>
                  </View>
                </Animated.View>
              </TouchableHighlight>
            </TouchableHighlight>
          </View>
        </Modal>

        <TouchableHighlight underlayColor={styleConst.color.select} style={style} onPress={this.onPress}>
          {children}
        </TouchableHighlight>
      </View>
    );
  }
}
