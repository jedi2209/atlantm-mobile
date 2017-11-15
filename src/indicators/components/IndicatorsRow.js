import React, { PureComponent } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = ((width - 22) / 4) - 8;

// components
import Imager from '../../core/components/Imager';

// helpers
import PropTypes from 'prop-types';
import styleConst from '../../core/style-const';
import { scale } from '../../utils/scale';

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
    bottom: -(HEIGHT_TRIANGLE + styleConst.ui.borderWidth),
    left: (itemWidth / 2) - (HEIGHT_TRIANGLE / 2),
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: HEIGHT_TRIANGLE / 2,
    borderRightWidth: HEIGHT_TRIANGLE / 2,
    borderBottomWidth: HEIGHT_TRIANGLE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
  },
  descriptionContainer: {
    zIndex: 1,
    backgroundColor: '#fff',
    marginTop: HEIGHT_TRIANGLE,
    paddingVertical: styleConst.ui.horizontalGap,
    paddingHorizontal: styleConst.ui.verticalGap,
    borderColor: styleConst.color.border,
    borderTopWidth: styleConst.ui.borderWidth,
    borderBottomWidth: styleConst.ui.borderWidth,
  },
  descriptionTitle: {
    fontSize: 19,
    fontFamily: styleConst.font.regular,
    letterSpacing: styleConst.ui.letterSpacing,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 17,
    color: styleConst.color.greyText4,
    fontFamily: styleConst.font.light,
    letterSpacing: styleConst.ui.letterSpacing,
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

        {isActive ? <View style={styles.triangle} /> : null}
      </View>
    );
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
            (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>{activeItem.name}</Text>
                <Text style={styles.descriptionText}>{activeItem.description}</Text>
              </View>
            ) : null
        }
      </View>
    );
  }
}
