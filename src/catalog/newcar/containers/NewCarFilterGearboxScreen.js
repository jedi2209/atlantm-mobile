import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import {
  Body,
  Label,
  Content,
  CheckBox,
  ListItem,
  StyleProvider,
} from 'native-base';

// redux
import { connect } from 'react-redux';
import { actionSelectNewCarFilterGearbox } from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import { get } from 'lodash';
import PropTypes from 'prop-types';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
});

const mapStateToProps = ({ catalog, nav }) => {
  return {
    nav,
    filterGearbox: catalog.newCar.filterGearbox,
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = {
  actionSelectNewCarFilterGearbox,
};

class NewCarFilterGearboxScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'КПП',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
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
        <SafeAreaView style={styles.safearea}>
          <Content>
            {
              gearboxKeys.map((gearboxId, idx) => {
                const item = gearbox[gearboxId];
                const handler = () => this.onPressItem(gearboxId);

                return (
                  <View key={gearboxId} style={stylesList.listItemContainer}>
                    <ListItem
                      icon
                      onPress={handler}
                      last={(gearboxKeys.length - 1) === idx}
                      style={stylesList.listItemPressable}
                    >
                      <CheckBox onPress={handler} checked={this.isGearboxSelected(gearboxId)} />
                      <Body style={stylesList.bodyWithLeftGap} >
                        <Label style={stylesList.label}>{item}</Label>
                      </Body>
                    </ListItem>
                  </View>
                );
              })
            }
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterGearboxScreen);
