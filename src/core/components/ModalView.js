import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Button} from 'native-base';
import Modal from 'react-native-modal';
import styleConst from '../style-const';
import strings from '../../core/lang/const';

const styles = StyleSheet.create({
  modalWindow: {
    backgroundColor: 'white',
    borderRadius: 5,
  },
  modalButton: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    textTransform: 'uppercase',
  },
});

const ModalView = (props) => {
  if (!props.selfClosed) {
    // модалка с кнопкой закрытия
    return (
      <Modal
        style={{flex: 1}}
        useNativeDriver={true}
        isVisible={props.isModalVisible}
        onSwipeComplete={props.onHide}
        onBackButtonPress={props.onHide}
        swipeDirection={['up', 'down']}
        {...props}>
        <View style={[styles.modalWindow, styleConst.shadow.default]}>
          {props.content ? props.content : props.children}
          <Button full onPress={props.onHide} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>
              {props.confirmBtnText
                ? props.confirmBtnText
                : strings.ModalView.close}
            </Text>
          </Button>
          {props.cancelBtnText && (
            <Button
              title={
                props.cancelBtnText
                  ? props.cancelBtnText
                  : strings.ModalView.cancel
              }
              onPress={props.onHide}
            />
          )}
        </View>
      </Modal>
    );
  } else {
    // модалка самозакрывающаяся
    return (
      <View onPress={props.onHide}>
        <Modal
          style={{flex: 1}}
          useNativeDriver={true}
          isVisible={props.isModalVisible}
          onBackButtonPress={props.onHide}
          onBackdropPress={props.onHide}
          swipeDirection={['up', 'down']}
          onSwipeComplete={props.onHide}
          {...props}>
          <View style={[styles.modalWindow, styleConst.shadow.default]}>
            {props.content ? props.content : props.children}
          </View>
        </Modal>
      </View>
    );
  }
};

export default ModalView;
