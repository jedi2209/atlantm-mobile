import React, {useState} from 'react';
import {StyleSheet, View, Text, SafeAreaView} from 'react-native';
import {Content, Row, Col, Segment, Button} from 'native-base';
import {useHeaderHeight} from '@react-navigation/stack';
import Modal from 'react-native-modal';

import showPrice from '../../utils/price';
import styleConst from '../../core/style-const';
import isIPhoneX from '../../utils/is_iphone_x';
import strings from '../../core/lang/const';

export const ServiceModal = ({visible, onClose, data}) => {
  const headerHeight = useHeaderHeight();
  const [activeTab, setActiveTab] = useState('works');

  const modalStyles = StyleSheet.create({
    host: {
      margin: 0,
      marginTop: headerHeight + (isIPhoneX() ? 32 : 0),
    },
    container: {
      flex: 1,
      backgroundColor: styleConst.color.white,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    wrapper: {
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    tabContainer: {
      backgroundColor: 'transparent',
      borderBottomWidth: 1,
      borderBottomColor: '#d8d8d8',
    },
    tabButton: {
      borderColor: 'transparent',
      width: '50%',
      justifyContent: 'center',
      height: 46,
    },
    tabButtonText: {
      fontSize: 18,
      color: styleConst.color.greyText,
    },
    tabButtonActiveText: {
      color: styleConst.color.lightBlue,
    },
    content: {
      flex: 1,
      marginBottom: 16,
    },
    button: {
      backgroundColor: styleConst.color.lightBlue,
      justifyContent: 'center',
      borderRadius: 5,
    },
    buttonText: {
      color: styleConst.color.white,
      textTransform: 'uppercase',
      fontSize: 16,
    },
  });

  return (
    <Modal
      isVisible={visible}
      useNativeDriver
      onBackdropPress={onClose}
      style={modalStyles.host}>
      <View style={modalStyles.container}>
        <SafeAreaView style={{flex: 1}}>
          {data && (
            <View style={modalStyles.content}>
              <Segment style={modalStyles.tabContainer}>
                <Button
                  onPress={() => setActiveTab('works')}
                  style={modalStyles.tabButton}>
                  <Text
                    selectable={false}
                    style={[
                      modalStyles.tabButtonText,
                      activeTab === 'works' && modalStyles.tabButtonActiveText,
                    ]}>
                    {strings.CarHistoryDetailsScreen.works}
                  </Text>
                </Button>
                <Button
                  onPress={() => setActiveTab('parts')}
                  style={modalStyles.tabButton}>
                  <Text
                    selectable={false}
                    style={[
                      modalStyles.tabButtonText,
                      activeTab === 'parts' && modalStyles.tabButtonActiveText,
                    ]}>
                    {strings.CarHistoryDetailsScreen.materials}
                  </Text>
                </Button>
              </Segment>
              <ServiceTable data={data[activeTab]} />
            </View>
          )}
          <View style={modalStyles.wrapper}>
            <Button full style={modalStyles.button} onPress={onClose}>
              <Text style={modalStyles.buttonText}>OK</Text>
            </Button>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const ServiceTable = ({data}) => {
  return (
    <Content>
      {data
        .filter((el) => {
          if ((el.name === '' || !el.name) && el.summ === 0) {
            return false;
          }
          return true;
        })
        .map(({name, quantity, unit, summ, currency}, cnt) => (
          <View
            style={tableStyles.section}
            key={'ServiceTable' + cnt + quantity + summ}>
            {name ? <Text style={tableStyles.sectionTitle}>{name}</Text> : null}
            {quantity && unit ? (
              <ServiceTableItem label={strings.CarHistoryDetailsScreen.count}>
                {unit === 'сек'
                  ? quantity / 60 / 60 + ' ч.'
                  : [quantity, unit].join(' ')}
              </ServiceTableItem>
            ) : null}
            {summ && currency.name ? (
              <ServiceTableItem label={strings.CarHistoryDetailsScreen.price}>
                {showPrice(summ, currency.name)}
              </ServiceTableItem>
            ) : null}
          </View>
        ))}
    </Content>
  );
};

const ServiceTableItem = ({label, children}) => (
  <Row style={tableStyles.sectionRow}>
    <Col style={tableStyles.sectionProp}>
      <Text selectable={false} style={tableStyles.sectionPropText}>
        {label}:
      </Text>
    </Col>
    <Col style={tableStyles.sectionValue}>
      <Text style={tableStyles.sectionValueText}>{children}</Text>
    </Col>
  </Row>
);

const tableStyles = StyleSheet.create({
  section: {
    paddingTop: styleConst.ui.horizontalGap,
    paddingRight: styleConst.ui.horizontalGap,
    paddingBottom: styleConst.ui.horizontalGap,
    marginLeft: styleConst.ui.horizontalGap,
    borderBottomWidth: styleConst.ui.borderWidth,
    borderBottomColor: styleConst.color.border,
  },
  sectionTitle: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 14,
    color: '#141414',
    fontFamily: styleConst.font.regular,
    marginBottom: 15,
  },
  sectionProp: {
    paddingRight: 5,
    marginTop: 5,
  },
  sectionValue: {
    marginTop: 5,
  },
  sectionPropText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontSize: 14,
    color: '#141414',
  },
  sectionValueText: {
    letterSpacing: styleConst.ui.letterSpacing,
    fontFamily: styleConst.font.regular,
    fontSize: 16,
  },
});
