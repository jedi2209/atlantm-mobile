import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Body,
  Item,
  Left,
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
import { actionSelectNewCarFilterBrands } from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

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
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    actionSelectNewCarFilterBrands,
  }, dispatch);
};

class NewCarFilterBrandsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: 'Марка',
    headerStyle: styleHeader.common,
    headerTitleStyle: styleHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  })

  static propTypes = {
    navigation: PropTypes.object,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.filterBrands.length !== nextProps.filterBrands.length;
  }

  onPressItem = (selectedBrand = 5) => {
    const { filterBrands } = this.props;
    let newBrands = [];

    if (this.isBrandSelected(selectedBrand)) {
      newBrands = filterBrands.filter(brand => brand !== selectedBrand);
    } else {
      newBrands = [].concat(filterBrands, selectedBrand);
    }

    this.props.actionSelectNewCarFilterBrands(newBrands);
  }

  isBrandSelected = brandId => this.props.filterBrands.includes(brandId)

  render() {
    const {
      filterData,
      filterBrands,
      navigation,
    } = this.props;

    console.log('== NewCarFilterBrandsScreen ==');

    const brands = filterData.data.brand;
    const brandsKeys = Object.keys(brands);

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content style={styles.content}>
            {
              brandsKeys.map((brandId, idx) => {
                const item = brands[brandId];

                return (
                  <View key={brandId} style={styleListProfile.listItemContainer}>
                    <ListItem
                      last={(brandsKeys.length - 1) === idx}
                      icon
                      style={styleListProfile.listItemPressable}
                      onPress={() => this.onPressItem(brandId)}
                    >
                      <CheckBox checked={this.isBrandSelected(brandId)} />
                      <Body style={styleListProfile.bodyWithLeftGap} >
                        <Label style={styleListProfile.label}>{item.name}</Label>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewCarFilterBrandsScreen);
