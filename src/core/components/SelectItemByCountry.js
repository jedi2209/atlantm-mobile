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

import {strings} from '../../core/lang/const';

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: '#F6F6F6',
    marginLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 12,
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

const _onPressDealerItem = props => {
  const {
    returnScreen,
    returnState,
    item,
    goBack,
    onSelect,
    selectedItem,
    navigation,
    isLocal,
  } = props;
  props
    .selectDealer({
      dealerBaseData: item,
      dealerSelected: selectedItem,
      isLocal,
    })
    .then(action => {
      const newDealer = get(action, 'payload.newDealer');
      const prevDealer = get(action, 'payload.prevDealer');
      if (
        action &&
        (action.type === DEALER__SUCCESS ||
          action.type === DEALER__SUCCESS__LOCAL)
      ) {
        if (onSelect) {
          onSelect({
            newDealer: newDealer,
            prevDealer: prevDealer,
            isLocal: isLocal,
          });
        }
        if (goBack) {
          return navigation.goBack();
        }
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

const SelectItemByCountry = props => {
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
      style={[stylesList.listItem, styles.listItem]}>
      <DealerCard item={item} />
    </ListItem>
  );
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
