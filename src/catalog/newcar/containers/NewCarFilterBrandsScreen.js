import React, {Component} from 'react';
import {SafeAreaView, View, StyleSheet} from 'react-native';
import {
  Body,
  Label,
  Content,
  CheckBox,
  ListItem,
  StyleProvider,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionSelectNewCarFilterBrands} from '../../actions';

// components
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';

// styles
import stylesList from '../../../core/components/Lists/style';

// helpers
import {get} from 'lodash';
import PropTypes from 'prop-types';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';

const styles = StyleSheet.create({
  safearea: {
    backgroundColor: styleConst.color.bg,
    flex: 1,
  },
});

const mapStateToProps = ({catalog, nav}) => {
  return {
    nav,
    filterBrands: catalog.newCar.filterBrands,
    filterData: catalog.newCar.filterData,
  };
};

const mapDispatchToProps = {
  actionSelectNewCarFilterBrands,
};

class NewCarFilterBrandsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Марка',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <View />,
  });

  static propTypes = {
    navigation: PropTypes.object,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.filterBrands.length !== nextProps.filterBrands.length;
  }

  onPressItem = selectedBrand => {
    requestAnimationFrame(() => {
      const {filterBrands} = this.props;
      let newBrands = [];

      if (this.isBrandSelected(selectedBrand)) {
        newBrands = filterBrands.filter(brand => brand !== selectedBrand);
      } else {
        newBrands = [].concat(filterBrands, selectedBrand);
      }

      this.props.actionSelectNewCarFilterBrands(newBrands);
    });
  };

  isBrandSelected = brandId => this.props.filterBrands.includes(brandId);

  render() {
    const {filterData, filterBrands} = this.props;

    if (!filterData) {
      return null;
    }

    console.log('== NewCarFilterBrandsScreen ==');

    const brands = get(filterData, 'data.brand');
    const brandsKeys = Object.keys(brands);

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content>
            {brandsKeys.map((brandId, idx) => {
              const item = brands[brandId];
              const handler = () => this.onPressItem(brandId);

              return (
                <View key={brandId} style={stylesList.listItemContainer}>
                  <ListItem
                    icon
                    onPress={handler}
                    last={brandsKeys.length - 1 === idx}
                    style={stylesList.listItemPressable}>
                    <CheckBox
                      onPress={handler}
                      checked={this.isBrandSelected(brandId)}
                    />
                    <Body style={stylesList.bodyWithLeftGap}>
                      <Label style={stylesList.label}>{item.name}</Label>
                    </Body>
                  </ListItem>
                </View>
              );
            })}
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCarFilterBrandsScreen);
