/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Modal, {ModalContent} from 'react-native-modals';
import {View, Text, TouchableWithoutFeedback} from 'react-native';

import {connect} from 'react-redux';

const mapStateToProps = ({catalog, dealer, nav}) => {
  return {
    nav,
  };
};

class ApplicationModalScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.nav.newState.routes !== this.props.nav.newState.routes) {
      this.setState({visible: true});
    }
  }

  render() {
    return (
      <View>
        <Modal visible={true}>
          <ModalContent>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Отправить заявку
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({visible: false});
                this.props.navigation.navigate('CallMeBackScreen');
              }}>
              <Text style={{fontSize: 18, marginVertical: 15}}>
                На обратный звонок
              </Text>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({visible: false});
                this.props.navigation.navigate('ServiceScreen');
              }}>
              <Text style={{fontSize: 18}}>На СТО</Text>
            </TouchableWithoutFeedback>
          </ModalContent>
        </Modal>
      </View>
    );
  }
}

export default connect(mapStateToProps)(ApplicationModalScreen);
