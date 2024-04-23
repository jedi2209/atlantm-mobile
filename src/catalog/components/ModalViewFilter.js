import React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {Button, HStack, Icon, VStack} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';
import {get} from 'lodash';

const isAndroid = Platform.OS === 'android';

const ModalViewFilter = props => {
  const {
    isModalVisible = false,
    selfClosed = true,
    onClose = () => {},
    onHide = () => {},
    onReset = () => {},
  } = props;
  return (
    <View onPress={onHide}>
      <Modal
        statusBarTranslucent={true}
        style={[styles.modalView, props?.stylesModal]}
        useNativeDriver={true}
        isVisible={isModalVisible}
        onBackButtonPress={onHide}
        onBackdropPress={selfClosed ? onHide : null}
        swipeDirection={selfClosed ? ['down'] : []}
        onSwipeComplete={selfClosed ? onHide : null}
        selfClosed={selfClosed}
        {...props}>
        <View
          style={[
            styles.modalWindow,
            styleConst.shadow.default,
            props?.stylesWrapper,
          ]}>
          <HStack
            justifyContent="space-between"
            my="1"
            ml="5"
            style={[props?.titleRowView]}>
            <View style={[styles.titleView]}>
              {props.title ? (
                <Text style={[styles.titleText, props?.titleTextStyle]}>
                  {props.title}
                </Text>
              ) : null}
            </View>
            <Button
              variant="unstyled"
              style={styles.closeButtonWrapper}
              rightIcon={
                <Icon
                  size={12}
                  as={Ionicons}
                  name="close-outline"
                  color="warmGray.50"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  style={styles.closeButton}
                  onPress={onHide ? onHide : onClose}
                />
              }
            />
          </HStack>
          {get(props, 'children', 'content')}
          <HStack justifyContent="space-between" px="1">
            <Button
              variant="unstyled"
              onPress={onReset ? onReset : onHide}
              py="10"
              px="5">
              <Text
                style={[
                  styles.modalButtonText,
                  styles.modalButtonTextCancel,
                  props.modalButtonTextStyle,
                ]}>
                {props.cancelBtnText ? props.cancelBtnText : strings.Base.reset}
              </Text>
            </Button>
            <Button
              variant="unstyled"
              borderRadius="full"
              onPress={onHide}
              py="10"
              px="5">
              <Text
                style={[styles.modalButtonText, props.modalButtonTextStyle]}>
                {props.confirmBtnText
                  ? props.confirmBtnText
                  : strings.MessageForm.done}
              </Text>
            </Button>
          </HStack>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalWindow: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: styleConst.color.white,
    justifyContent: 'flex-end',
    paddingTop: isAndroid ? 0 : 10,
  },
  closeButtonWrapper: {
    marginTop: isAndroid ? 15 : 0,
  },
  titleView: {
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 20,
    fontFamily: styleConst.font.medium,
    color: styleConst.color.greyText4,
  },
  closeButton: {
    color: styleConst.color.greyBlue,
  },
  modalButtonText: {
    color: styleConst.color.blue,
    fontSize: 17,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modalButtonTextCancel: {
    color: styleConst.color.greyText,
    fontWeight: 'normal',
  },
});

export default ModalViewFilter;
