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
import { actionSelectNewCarFilterGearbox } from '../../actions';

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
    filterGearbox: catalog.newCar.filterGearbox,
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionSelectNewCarFilterGearbox,
  }, dispatch);
};

class NewCarFilterGearboxScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'КПП',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    navigation: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.filterGearbox.length !== nextProps.filterGearbox.length;
  }

  onPressItem = (selectedGearbox) => {
    requestAnimationFrame(() => {
      const { filterGearbox } = this.props;
      let newGearbox = [];

      if (this.isGearboxSelected(selectedGearbox)) {
        newGearbox = filterGearbox.filter(gearbox => gearbox !== selectedGearbox);
      } else {
        newGearbox = [].concat(filterGearbox, selectedGearbox);
      }

      this.props.actionSelectNewCarFilterGearbox(newGearbox);
    });
  }

  isGearboxSelected = gearboxId => this.props.filterGearbox.includes(gearboxId)

  render() {
    const {
      filterData,
      filterGearbox,
    } = this.props;

    if (!filterData) return null;

    console.log('== NewCarFilterGearboxScreen ==');

    const gearbox = get(filterData, 'data.gearbox');
    const gearboxKeys = Object.keys(gearbox);

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            {
              gearboxKeys.map((gearboxId, idx) => {
                const item = gearbox[gearboxId];
                const handler = () => this.onPressItem(gearboxId);

                return (
                  <View key={gearboxId} style={styleListProfile.listItemContainer}>
                    <ListItem
                      icon
                      onPress={handler}
                      last={(gearboxKeys.length - 1) === idx}
                      style={styleListProfile.listItemPressable}
                    >
                      <CheckBox onPress={handler} checked={this.isGearboxSelected(gearboxId)} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterGearboxScreen);
