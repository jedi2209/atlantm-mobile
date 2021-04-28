import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import {ListItem} from 'native-base';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

// components
import * as NavigationService from '../../navigation/NavigationService';
import DealerCard from './DealerCard';

// helpers
import {get} from 'lodash';
import PropTypes from 'prop-types';
import styleConst from '../../core/style-const';
import stylesList from '../../core/components/Lists/style';
import {
  DEALER__SUCCESS,
  DEALER__SUCCESS__LOCAL,
  DEALER__FAIL,
} from '../../dealer/actionTypes';

import {selectDealer} from '../../dealer/actions';

import strings from '../../core/lang/const';

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#F6F6F6',
    marginLeft: 0,
    paddingRight: 0,
    borderBottomWidth: 0,
  },
});

const mapStateToProps = ({core}) => {
  return {
    pushActionSubscribeState: core.pushActionSubscribeState,
  };
};

const mapDispatchToProps = {
  selectDealer,
};

const _onPressDealerItem = (props) => {
  const {
    returnScreen,
    returnState,
    item,
    goBack,
    onSelect,
    selectedItem,
    selectDealer,
    navigation,
    isLocal,
  } = props;
  // console.log('_onPressDealerItem props', props);
  const mainScreen = 'Home';
  selectDealer({
    dealerBaseData: item,
    dealerSelected: selectedItem,
    isLocal,
  }).then((action) => {
    const newDealer = get(action, 'payload.newDealer');
    const prevDealer = get(action, 'payload.prevDealer');
    // console.log('_onPressDealerItem action', action);
    if (
      action &&
      (action.type === DEALER__SUCCESS ||
        action.type === DEALER__SUCCESS__LOCAL)
    ) {
      // console.log('_onPressDealerItem onSelect', onSelect);
      if (onSelect) {
        onSelect({
          newDealer: newDealer,
          prevDealer: prevDealer,
          isLocal: isLocal,
        });
      }
      // console.log('_onPressDealerItem goBack', goBack, Boolean(goBack));
      if (Boolean(goBack)) {
        return navigation.goBack();
      }
      // console.log('NavigationService', NavigationService);
      NavigationService.reset(returnScreen, returnState);
    }

    if (action && action.type === DEALER__FAIL) {
      Alert.alert(
        strings.SelectItemByCountry.error.title,
        strings.SelectItemByCountry.error.text,
      );
    }
  });
};

// const _onPressCityItem = (props) => {
//   const {navigation, selectItem, item} = props;

//   selectItem(item);
//   navigation.goBack();
// };

const _renderDealer = (props) => {
  const {item} = props;
  if (item.virtual !== false && item.id !== 177) {
    // фикс для НЕ вывода виртуальных КО в списке
    return true;
  }

  return (
    <ListItem
      onPress={() => {
        return _onPressDealerItem(props);
      }}
      style={[
        stylesList.listItem,
        styles.listItem,
        {
          paddingTop: 0,
          paddingBottom: 12,
        },
      ]}>
      <DealerCard item={item} />
    </ListItem>
  );
};

// const _renderCity = (props) => {
//   const {item, selectedItem} = props;

//   let existBrands = [];

//   return (
//     <ListItem onPress={() => {return onPressCityItem(props); }} style={stylesList.listItem}>
//       <Body>
//         {item.name ? <Text style={styles.city}>{item.name}</Text> : null}
//         {item.dealers && item.dealers.length !== 0 ? (
//           <View style={styles.brands}>
//             {item.dealers.map((dealer) => {
//               if (dealer.virtual !== false && item.id !== 177) {
//                 // фикс для НЕ вывода виртуальных КО в списке
//                 return true;
//               }
//               return (
//                 <View key={dealer.id} style={styles.brands}>
//                   {dealer.brands &&
//                     dealer.brands.length &&
//                     dealer.brands.map((brand) => {
//                       const name =
//                         brand.name === 'land rover' ? 'landrover' : brand.name;

//                       if (
//                         existBrands.includes(name) ||
//                         dealer.virtual !== false
//                       ) {
//                         return null;
//                       } else {
//                         existBrands.push(name);
//                       }

//                       if (brand.logo) {
//                         return (
//                           <Imager
//                             resizeMode="contain"
//                             key={'brandLogo' + brand.id}
//                             style={styles.brandLogo}
//                             source={{uri: brand.logo}}
//                           />
//                         );
//                       }
//                     })}
//                 </View>
//               );
//             })}
//           </View>
//         ) : null}
//       </Body>
//     </ListItem>
//   );
// };

const SelectItemByCountry = (props) => {
  const navigation = useNavigation();

  // return itemLayout === 'dealer'
  //   ? _renderDealer({...props, navigation})
  //   : _renderCity({...props, navigation});
  return _renderDealer({...props, navigation});
};

SelectItemByCountry.propTypes = {
  item: PropTypes.object,
  selectItem: PropTypes.func,
  itemLayout: PropTypes.string,
  selectedItem: PropTypes.object,
  returnScreen: PropTypes.string,
  onSelect: PropTypes.func,
  goBack: PropTypes.bool,
  isLocal: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectItemByCountry);
