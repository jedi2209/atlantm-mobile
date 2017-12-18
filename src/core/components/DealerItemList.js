import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { ListItem, Body, Right, Icon, StyleProvider, Text } from 'native-base';

// component
import Imager from '../components/Imager';

// helpers
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesList from '../../core/components/Lists/style';

const styles = StyleSheet.create({
  brands: {
    flexDirection: 'row',
  },
  brandLogo: {
    minWidth: 24,
    height: 20,
    marginRight: 4,
  },
  city: {
    fontFamily: styleConst.font.regular,
    fontSize: 17,
    letterSpacing: styleConst.ui.letterSpacing,
  },
  name: {
    color: styleConst.color.greyText,
    fontFamily: styleConst.font.light,
    fontSize: 17,
    letterSpacing: styleConst.ui.letterSpacing,
  },
});

export default class DealerItemList extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    city: PropTypes.shape({
      name: PropTypes.string,
    }),
    name: PropTypes.string,
    brands: PropTypes.array,
    returnScreen: PropTypes.string,
  }

  static defaultProps = {
    city: null,
    name: null,
    brands: [],
    returnScreen: null,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.name !== nextProps.name;
  }

  onPressDealer = () => {
    const {
      navigation,
      returnScreen,
      isGoBack,
    } = this.props;

    return navigation.navigate('ChooseDealerScreen', { returnScreen, isGoBack });
  }

  render() {
    const { city, name, brands } = this.props;

    return (
      <StyleProvider style={getTheme()}>
        <View style={stylesList.listItemContainer}>
          <ListItem
            last
            onPress={this.onPressDealer}
            style={stylesList.listItem}
          >
            <Body>
              {city && city.name ? <Text style={styles.city}>{city.name}</Text> : null}
              {name ? <Text style={styles.name}>{name}</Text> : null}
            </Body>
            <Right>
              <View style={styles.brands} >
                {
                  brands.map(brand => {
                    return (
                      <Imager
                        resizeMode="contain"
                        key={brand.id}
                        style={styles.brandLogo}
                        source={{ uri: brand.logo }}
                      />
                    );
                  })
                }
              </View>
              <Icon
                name="arrow-forward"
                style={stylesList.iconArrow}
              />
            </Right>
          </ListItem>
        </View>
      </StyleProvider>
    );
  }
}
