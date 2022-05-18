import React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {Button} from 'native-base';
import Modal from 'react-native-modal';
import styleConst from '../style-const';
import {strings} from '../../core/lang/const';

const isAndroid = Platform.OS === 'android';

const ModalView = props => {
  if (!props.selfClosed) {
    // модалка с кнопкой закрытия
    return (
      <Modal
        style={[
          styles.modalView,
          props.type === 'bottom' ? styles.ModalViewBottom : null,
          props?.stylesModal,
        ]}
        useNativeDriver={true}
        isVisible={props.isModalVisible}
        onSwipeComplete={props.onHide}
        onBackButtonPress={props.onHide}
        swipeDirection={['up', 'down']}
        {...props}>
        <View
          style={[
            props.type !== 'bottom'
              ? styles.modalWindow
              : styles.modalWindowBottom,
            styleConst.shadow.default,
            props?.stylesWrapper,
          ]}>
          <View
            style={[
              props.type === 'bottom' ? {padding: 10} : null,
              props?.stylesWrapperContent,
            ]}>
            {props.title ? (
              <Text style={[styles.titleText, props?.titleTextStyle]}>
                {props.title}
              </Text>
            ) : null}
            {props.content ? props.content : props.children}
          </View>
          <Button
            size="full"
            full
            onPress={props.onHide}
            style={[
              props.type !== 'bottom'
                ? styles.modalButton
                : styles.modalButtonBottom,
            ]}>
            <Text style={[styles.modalButtonText, props.modalButtonTextStyle]}>
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
                  : strings.Base.cancel.toLowerCase()
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
          style={[
            styles.modalView,
            props.type === 'bottom' ? styles.ModalViewBottom : null,
            props?.stylesModal,
          ]}
          useNativeDriver={true}
          isVisible={props.isModalVisible}
          onBackButtonPress={props.onHide}
          onBackdropPress={props.onHide}
          swipeDirection={['up', 'down']}
          onSwipeComplete={props.onHide}
          {...props}>
          <View
            style={[
              props.type !== 'bottom'
                ? styles.modalWindow
                : styles.modalWindowBottom,
              styleConst.shadow.default,
              props?.stylesWrapper,
            ]}>
            <View style={[props.type === 'bottom' ? {padding: 10} : null]}>
              {props.title ? (
                <Text style={[styles.titleText, props?.titleTextStyle]}>
                  {props.title}
                </Text>
              ) : null}
              {props.content ? props.content : props.children}
            </View>
            {props.confirmBtnText ? (
              <Button
                size="full"
                full
                onPress={props.onHide}
                style={[
                  props.type !== 'bottom'
                    ? styles.modalButton
                    : styles.modalButtonBottom,
                ]}>
                <Text
                  style={[styles.modalButtonText, props.modalButtonTextStyle]}>
                  {props.confirmBtnText
                    ? props.confirmBtnText
                    : strings.ModalView.close}
                </Text>
              </Button>
            ) : null}
          </View>
        </Modal>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
  },
  ModalViewBottom: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalWindow: {
    backgroundColor: styleConst.color.white,
    borderRadius: 5,
  },
  modalWindowBottom: {
    borderRadius: 0,
    backgroundColor: styleConst.color.white,
    justifyContent: 'flex-end',
  },
  titleText: {
    fontSize: 20,
    fontFamily: styleConst.font.medium,
    color: styleConst.color.darkBg,
    marginBottom: 25,
  },
  modalButton: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  modalButtonBottom: {
    marginVertical: 15,
    height: isAndroid ? 50 : 60,
    borderRadius: 0,
  },
  modalButtonText: {
    color: styleConst.color.white,
    textTransform: 'uppercase',
  },
});

export default ModalView;
