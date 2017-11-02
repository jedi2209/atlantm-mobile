import React, { Component } from 'react';
import { View, StyleSheet, InteractionManager } from 'react-native';
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
import { find } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionSelectNewCarFilterModels } from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import ListItemHeader from '../../../profile/components/ListItemHeader';

// styles
import styleListProfile from '../../../core/components/Lists/style';

// helpers
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
    filterBrands: catalog.newCar.filterBrands,
    filterModels: catalog.newCar.filterModels,
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionSelectNewCarFilterModels,
  }, dispatch);
};

class NewCarFilterBrandsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Модель',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    navigation: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.filterModels.length !== nextProps.filterModels.length;
  }

  onPressItem = (brandId, selectedModelId) => {
    InteractionManager.runAfterInteractions(() => {
      const { filterModels } = this.props;
      let newModels = [];

      if (this.isModelSelected(selectedModelId)) {
        newModels = filterModels.filter(item => item.modelId !== selectedModelId);
      } else {
        newModels = [].concat(filterModels, { brandId, modelId: selectedModelId });
      }

      this.props.actionSelectNewCarFilterModels(newModels);
    });
  }

  isModelSelected = modelId => !!find(this.props.filterModels, { modelId })

  render() {
    const {
      filterData,
      filterBrands,
      filterModels,
    } = this.props;

    console.log('== NewCarFilterBrandsScreen ==');

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            {
              filterBrands.map(brandId => {
                const item = filterData.data.brand[brandId];
                const models = item.model;
                const modelsKeys = Object.keys(models);

                return (
                  <View key={`brand-${brandId}`}>
                    {item.name && <ListItemHeader text={(item.name).toUpperCase()} />}
                    {
                      modelsKeys.map((modelId, idx) => {
                        return (
                          <View key={`model-${modelId}`} style={styleListProfile.listItemContainer}>
                            <ListItem
                              last={(modelsKeys.length - 1) === idx}
                              icon
                              style={styleListProfile.listItemPressable}
                              onPress={() => this.onPressItem(brandId, modelId)}
                            >
                              <CheckBox checked={this.isModelSelected(modelId)} />
                              <Body style={styleListProfile.bodyWithLeftGap} >
                                <Label style={styleListProfile.label}>{models[modelId]}</Label>
                              </Body>
                            </ListItem>
                          </View>
                        );
                      })
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterBrandsScreen);
