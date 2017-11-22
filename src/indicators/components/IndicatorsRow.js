import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight, Image } from 'react-native';

// components
import IndicatorDescription from '../components/IndicatorDescription';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../core/style-const';

const { width } = Dimensions.get('window');
const itemWidth = ((width - 22) / 4) - 8;
const HEIGHT_TRIANGLE = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: HEIGHT_TRIANGLE,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: styleConst.ui.horizontalGap,
    zIndex: 2,
  },
  iconItemContainer: {
    position: 'relative',
  },
  iconItem: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconItemActive: {
    backgroundColor: styleConst.color.systemBlue,
  },
  iconImage: {
    width: itemWidth,
    height: itemWidth,
  },
  triangle: {
    position: 'absolute',
    left: (itemWidth / 2) - (HEIGHT_TRIANGLE - 1),
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: HEIGHT_TRIANGLE - 1,
    borderRightWidth: HEIGHT_TRIANGLE - 1,
    borderBottomWidth: HEIGHT_TRIANGLE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  triangleWhite: {
    zIndex: 2,
    bottom: -(HEIGHT_TRIANGLE + 1 + styleConst.ui.borderWidth),
    borderBottomColor: '#fff',
  },
  triangleBorder: {
    zIndex: 1,
    bottom: -(HEIGHT_TRIANGLE),
    borderBottomColor: styleConst.color.border,
  },
});

export default class IndicatorRow extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    activeItem: PropTypes.object,
    onPressItem: PropTypes.func,
  }

  isActive = (id) => this.props.activeItem.id === id;

  isActiveRow = () => {
    const { items, activeItem } = this.props;

    return items.some(item => item.id === activeItem.id);
  }

  renderIndicator = (indicator) => {
    const { img, id } = indicator;
    const { onPressItem } = this.props;
    const isActive = this.isActive(id);

    return (
      <View key={`indicator-${id}`} style={styles.iconItemContainer}>
        <TouchableHighlight
          onPress={() => onPressItem(indicator)}
          style={[styles.iconItem, isActive ? styles.iconItemActive : null]}
          underlayColor={styleConst.color.select}
        >
          <View>
            {
              isActive ?
                (
                  <Image
                    style={styles.iconImage}
                    source={{ uri: img.white }}
                  />
                ) :
                (
                  <Image
                    style={styles.iconImage}
                    source={{ uri: img.blue }}
                  />
                )
            }
          </View>
        </TouchableHighlight>

        {
          isActive ?
            (
              <View>
                <View style={[styles.triangle, styles.triangleWhite]} />
                <View style={[styles.triangle, styles.triangleBorder]} />
              </View>
            ) : null
        }
      </View>
    );
  }

  renderDescription = (indicator) => {
    const { id, name, description } = indicator;

    if (!this.isActive(id)) return null;

    return <IndicatorDescription key={id} name={name} description={description} />;
  }

  render() {
    const { items, activeItem } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.iconsContainer}>
          {items.map(indicator => this.renderIndicator(indicator))}
        </View>
        {
          this.isActiveRow() ?
            items.map(indicator => this.renderDescription(indicator)) :
            null
        }
      </View>
    );
  }
}
