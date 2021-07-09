import React from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import {Button, Icon} from 'native-base';
import Modal from 'react-native-modal';
import styleConst from '../../core/style-const';
import {strings} from '../../core/lang/const';
import {get} from 'lodash';

const isAndroid = Platform.OS === 'android';

const ModalViewFilter = props => {
    return (
    <View onPress={props.onHide}>
        <Modal
        statusBarTranslucent
        style={[styles.modalView, props?.stylesModal]}
        useNativeDriver={true}
        isVisible={props.isModalVisible}
        onBackButtonPress={props.onHide}
        onBackdropPress={props.selfClosed ? props.onHide : null}
        swipeDirection={props.selfClosed ? ['down'] : []}
        onSwipeComplete={props.selfClosed ? props.onHide : null}
        selfClosed={props.selfClosed}
        {...props}>
        <View
            style={[styles.modalWindow, styleConst.shadow.default, props?.stylesWrapper]}>
                <View style={[styles.titleRowView, props?.titleRowView]}>
                    <View style={[styles.titleView]}>
                        {props.title ? (
                            <Text style={[styles.titleText, props?.titleTextStyle]}>{props.title}</Text>
                        ) : null}
                    </View>
                    <Button transparent style={styles.closeButtonWrapper}>
                        <Icon
                            type="Ionicons"
                            style={styles.closeButton}
                            name="close-outline"
                            onPress={props.onHide ? props.onHide : props.onClose}
                        />
                    </Button>
                </View>
            {get(props, 'children', 'content')}
            <View style={styles.buttonsView}>
                <Button
                    transparent
                    onPress={props.onReset ? props.onReset : props.onHide}
                    style={[styles.modalButton]}>
                    <Text style={[styles.modalButtonText, styles.modalButtonTextCancel, props.modalButtonTextStyle]}>
                    {props.cancelBtnText
                        ? props.cancelBtnText
                        : strings.Base.reset}
                    </Text>
                </Button>
                <Button
                    transparent
                    onPress={props.onHide}
                    style={[styles.modalButton]}>
                    <Text style={[styles.modalButtonText, props.modalButtonTextStyle]}>
                    {props.confirmBtnText
                        ? props.confirmBtnText
                        : strings.MessageForm.done}
                    </Text>
                </Button>
            </View>
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
    titleRowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        marginBottom: 20,
        marginLeft: 10,
    },
    titleText: {
        fontSize: 20,
        fontFamily: styleConst.font.medium,
        color: styleConst.color.greyText4,
        marginTop: 15,
    },
    closeButton: {
        color: styleConst.color.greyBlue,
        fontSize: 40,
    },
    buttonsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        marginBottom: 10,
    },
    modalButton: {
        marginVertical: 15,
        height: isAndroid ? 50 : 60,
        borderRadius: 0,
    },
    modalButtonText: {
        color: styleConst.color.blue,
        fontSize: 18,
        fontWeight: '600',
    },
    modalButtonTextCancel: {
        color: styleConst.color.systemGray,
        fontWeight: 'normal',
        textTransform: 'lowercase',
    },
  });

  ModalViewFilter.defaultProps = {
    isModalVisible: false,
    selfClosed: true,
    onClose: () => {},
  }
  
  export default ModalViewFilter;
  