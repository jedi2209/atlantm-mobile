import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Body,
  Label,
  Content,
  CheckBox,
  ListItem,
  Container,
  StyleProvider,
} from 'native-base';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionSelectNewCarFilterDrive } from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import styleListProfile from '../../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
import PropTypes from 'prop-types';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import styleHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  content: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
});

const mapStateToProps = ({ catalog, nav }) => {
  return {
    nav,
    filterDrive: catalog.newCar.filterDrive,
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionSelectNewCarFilterDrive,
  }, dispatch);
};

class NewCarFilterDriveScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Привод',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    navigation: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.filterDrive.length !== nextProps.filterDrive.length;
  }

  onPressItem = (selectedDrive) => {
    const { filterDrive } = this.props;
    let newDrive = [];

    if (this.isDriveSelected(selectedDrive)) {
      newDrive = filterDrive.filter(body => body !== selectedDrive);
    } else {
      newDrive = [].concat(filterDrive, selectedDrive);
    }

    this.props.actionSelectNewCarFilterDrive(newDrive);
  }

  isDriveSelected = driveId => this.props.filterDrive.includes(driveId)

  render() {
    const {
      filterData,
      filterDrive,
    } = this.props;

    if (!filterData) return null;

    console.log('== NewCarFilterDriveScreen ==');

    const drive = get(filterData, 'data.drive');

    const driveKeys = Object.keys(drive);

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            {
              driveKeys.map((driveId, idx) => {
                const item = drive[driveId];

                return (
                  <View key={driveId} style={styleListProfile.listItemContainer}>
                    <ListItem
                      last={(driveKeys.length - 1) === idx}
                      icon
                      style={styleListProfile.listItemPressable}
                      onPress={() => this.onPressItem(driveId)}
                    >
                      <CheckBox checked={this.isDriveSelected(driveId)} />
                      <Body style={styleListProfile.bodyWithLeftGap} >
                        <Label style={styleListProfile.label}>{item}</Label>
                      </Body>
                    </ListItem>
                  </View>
                );
              })
            }
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterDriveScreen);
