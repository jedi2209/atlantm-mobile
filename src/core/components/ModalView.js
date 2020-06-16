import React from 'react';
import {Button, Text, View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import styleConst from '../style-const';

const styles = StyleSheet.create({
  modalWindow: {
    backgroundColor: 'white',
    borderRadius: 5,
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
        onBackButtonPress={props.onHide}
        swipeDirection={['up', 'down']}
        {...props}>
        <View style={[styles.modalWindow, styleConst.shadow.default]}>
          {props.content ? props.content : null}
          <Button title="закрыть" onPress={props.onHide} />
        </View>
      </Modal>
    );
  } else {
    // модалка самозакрывающаяся
    return (
      <View onPress={props.onHide}>
        <Modal
          style={{flex: 1}}
          useNativeDriver={false}
          isVisible={props.isModalVisible}
          onBackButtonPress={props.onHide}
          onBackdropPress={props.onHide}
          swipeDirection={['up', 'down']}
          onSwipeComplete={props.onHide}
          {...props}>
          <View style={[styles.modalWindow, styleConst.shadow.default]}>
            {props.children}
          </View>
        </Modal>
      </View>
    );
  }
};

export default ModalView;
