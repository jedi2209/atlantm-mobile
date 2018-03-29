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
import { actionSelectNewCarFilterEngineType } from '../../actions';

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
    filterEngineType: catalog.newCar.filterEngineType,
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = {
  actionSelectNewCarFilterEngineType,
};

class NewCarFilterGearboxScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Тип двигателя',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    navigation: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.filterEngineType.length !== nextProps.filterEngineType.length;
  }

  onPressItem = (selectedEngineType) => {
    requestAnimationFrame(() => {
      const { filterEngineType } = this.props;
      let newEngineType = [];

      if (this.isEngineTypeSelected(selectedEngineType)) {
        newEngineType = filterEngineType.filter(engineType => engineType !== selectedEngineType);
      } else {
        newEngineType = [].concat(filterEngineType, selectedEngineType);
      }

      this.props.actionSelectNewCarFilterEngineType(newEngineType);
    });
  }

  isEngineTypeSelected = engineTypeId => this.props.filterEngineType.includes(engineTypeId)

  render() {
    const {
      filterData,
      filterEngineType,
    } = this.props;

    if (!filterData) return null;

    console.log('== NewCarFilterGearboxScreen ==');

    const engineType = get(filterData, 'data.enginetype');
    const engineTypeKeys = Object.keys(engineType);

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            {
              engineTypeKeys.map((engineTypeId, idx) => {
                const item = engineType[engineTypeId];
                const handler = () => this.onPressItem(engineTypeId);

                return (
                  <View key={engineTypeId} style={stylesList.listItemContainer}>
                    <ListItem
                      icon
                      onPress={handler}
                      last={(engineTypeKeys.length - 1) === idx}
                      style={stylesList.listItemPressable}
                    >
                      <CheckBox onPress={handler} checked={this.isEngineTypeSelected(engineTypeId)} />
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
