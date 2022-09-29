import React, {useState, useReducer} from 'react';
import {ActivityIndicator, StyleSheet, Platform} from 'react-native';
import {VStack, HStack, View, Button, Icon, Text, Checkbox} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BrandLogo from '../../../core/components/BrandLogo';
import NestedListView, {NestedRow} from 'react-native-nested-listview';
import {connect} from 'react-redux';
import {get} from 'lodash';
import styleConst from '../../../core/style-const';
import {actionSaveBrandModelFilter} from '../../actions';
import {strings} from '../../../core/lang/const';

const isAndroid = Platform.OS === 'android';

const initialStateFilters = {
  modelFilter: {},
  brandFilter: {},
};

const mapStateToProps = ({catalog}) => {
  return {
    activeFilters: {
      New: catalog.newCar.brandModelFilter,
      Used: catalog.usedCar.brandModelFilter,
    },
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveBrandModelFilter: data => {
      return dispatch(actionSaveBrandModelFilter(data));
    },
    clearBrandModelFilters: () => {
      return dispatch(actionSaveBrandModelFilter({stockType: 'clear'}));
    },
  };
};

const reducerBrandFilter = (state = {}, action) => {
  if (action.type && action.type === 'clear') {
    return {};
  }
  if (state[action.id]) {
    delete state[action.id];
  } else {
    state[action.id] = action.id;
  }
  return state;
};

const reducerModelFilter = (state = {}, action) => {
  switch (action.type) {
    case 'delete':
      if (action?.items) {
        action.items.map(val => {
          delete state[val.id];
        });
      } else {
        delete state[action.id];
      }
      break;
    case 'add':
      if (action?.items) {
        action.items.map(val => {
          state[val.id] = val.id;
        });
      } else {
        state[action.id] = action.id;
      }
      break;
    case 'clear':
      state = {};
      break;
  }
  return state;
};

const reducerFilters = (state = initialStateFilters, field) => {
  let res = {};
  if (!field) {
    return res;
  }
  if (typeof field === 'object' && field.length) {
    field.map(val => {
      state[val.name] = val.value;
    });
    Object.assign(res, state);
  } else {
    Object.assign(res, state, {
      [field.name]: field.value,
    });
  }
  return res;
};

const BrandModelFilterScreen = ({
  activeFilters,
  navigation,
  route,
  saveBrandModelFilter,
  clearBrandModelFilters,
}) => {
  const stockType = get(route, 'params.stockType');

  const [brandFilter, setBrandFilter] = useReducer(
    reducerBrandFilter,
    activeFilters[stockType]?.brand || {},
  );
  const [modelFilter, setModelFilter] = useReducer(
    reducerModelFilter,
    activeFilters[stockType]?.model || {},
  );
  const [stateFilters, dispatchFilters] = useReducer(
    reducerFilters,
    initialStateFilters,
  );

  const [nestedListUpdate, setUpdateNestedList] = useState(false);

  const accordionModels = get(route, 'params.data');

  const _onChangeFilter = (field, value) => {
    if (typeof field === 'object') {
      let data = [];
      Object.keys(field).map(val => {
        data.push({name: val, value: field[val]});
      });
      dispatchFilters(data);
    } else {
      dispatchFilters({name: field, value});
    }
  };

  const _onNestedNodePress = node => {
    const id = node.id;
    const isBrand = node.type === 'brand';
    if (!isBrand) {
      let typeTmp = 'add';
      if (modelFilter[id]) {
        typeTmp = 'delete';
      }
      setModelFilter({id: id, type: typeTmp});
      _onChangeFilter('modelFilter', modelFilter);
      setUpdateNestedList(!nestedListUpdate);
    }
  };

  const _renderNodeNested = (node, level, isLastLevel) => {
    return (
      <NestedRow
        level={level}
        style={styles[`nestedRow${level}${node.opened ? 'Opened' : 'Closed'}`]}>
        {level === 1 && node.id ? (
          <VStack>
            <View style={styles.colorWrapper}>
              <HStack>
                <Icon
                  as={Ionicons}
                  size={5}
                  color={'gray.300'}
                  pt={1}
                  name={node.opened ? 'caret-down' : 'caret-forward'}
                />
                {stockType != 'Used' ? (
                  <BrandLogo
                    brand={node.id}
                    width={30}
                    style={styles.brandLogo}
                    key={'brandLogo' + node.id}
                  />
                ) : null}
                <Text style={styles.colorText}>{node.label}</Text>
              </HStack>
              <Checkbox
                onChange={() => {
                  let typeTmp = 'add';
                  if (brandFilter[node.id]) {
                    typeTmp = 'delete';
                  }
                  setModelFilter({items: node?.items, type: typeTmp});
                  setBrandFilter({id: node.id});
                  _onChangeFilter({
                    brandFilter: brandFilter,
                    modelFilter: modelFilter,
                  });
                  setUpdateNestedList(!nestedListUpdate);
                }}
                isChecked={brandFilter && brandFilter[node.id] ? true : false}
              />
            </View>
          </VStack>
        ) : (
          <View style={styles[`nestedRow${level}Inner`]}>
            <Text style={{fontSize: 14}}>{node.label}</Text>
            <Checkbox
              onChange={() => {
                let typeTmp = 'add';
                if (modelFilter[node.id]) {
                  typeTmp = 'delete';
                }
                setModelFilter({id: node.id, type: typeTmp});
                _onChangeFilter('modelFilter', modelFilter);
                setUpdateNestedList(!nestedListUpdate);
              }}
              isChecked={modelFilter && modelFilter[node.id] ? true : false}
            />
          </View>
        )}
      </NestedRow>
    );
  };

  if (!accordionModels) {
    return (
      <ActivityIndicator
        color={styleConst.color.blue}
        style={[
          styles.resultButtonWrapper,
          styleConst.spinner,
          {bottom: isAndroid ? 10 : 40},
        ]}
        size="small"
      />
    );
  }

  return (
    <View flex={1} backgroundColor={'white'}>
      <View style={{paddingBottom: 70}}>
        <NestedListView
          data={accordionModels}
          onNodePressed={node => _onNestedNodePress(node)}
          renderNode={(node, level, isLastLevel) =>
            _renderNodeNested(node, level, isLastLevel)
          }
        />
      </View>
      <Button.Group
        position={'absolute'}
        colorScheme="blue"
        size={'md'}
        px={'5%'}
        justifyContent="space-between"
        width={'100%'}
        bottom={isAndroid ? 10 : 30}
        style={styles.resultButtonWrapper22}>
        <Button
          variant="link"
          w={'30%'}
          onPress={() => {
            setModelFilter({type: 'clear'});
            setBrandFilter({type: 'clear'});
            _onChangeFilter({
              brandFilter: {},
              modelFilter: {},
            });
            setUpdateNestedList(!nestedListUpdate);
            clearBrandModelFilters();
          }}
          _text={[styles.modalButtonText, styles.modalButtonTextCancel]}
          style={[styles.modalButton]}>
          {strings.Base.reset}
        </Button>
        <Button
          shadow={7}
          w={'70%'}
          _text={{textTransform: 'uppercase'}}
          onPress={() => {
            saveBrandModelFilter({stateFilters, stockType});
            navigation.goBack();
          }}>
          {strings.Base.choose}
        </Button>
      </Button.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0,
  },
  nestedRow: {},
  nestedRow1Closed: {
    marginBottom: 2,
    paddingHorizontal: '5%',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: styleConst.color.bg,
  },
  nestedRow1Opened: {
    marginBottom: 2,
    paddingHorizontal: '5%',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: styleConst.color.bg,
  },
  nestedRow2Closed: {
    marginBottom: 2,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  nestedRow2Opened: {
    marginBottom: 2,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  nestedRow1Inner: {
    flexDirection: 'row',
    paddingLeft: '6%',
    flex: 1,
    justifyContent: 'space-between',
  },
  nestedRow2Inner: {
    flexDirection: 'row',
    paddingLeft: '12%',
    flex: 1,
    justifyContent: 'space-between',
  },
  colorWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorText: {
    fontSize: 17,
    fontFamily: styleConst.font.regular,
  },
  brandLogo: {
    width: 40,
    height: 30,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  brandLogoWrapper: {},
  resultButtonWrapper: {
    zIndex: 100,
    width: '90%',
    marginHorizontal: '5%',
    alignItems: 'center',
    alignContent: 'center',
  },
  resultButton: {
    zIndex: 99,
    borderRadius: 5,
    width: '70%',
  },
  resultButtonEnabled: {
    backgroundColor: styleConst.color.blue,
    borderColor: styleConst.color.blue,
  },
  resultButtonText: {
    textTransform: 'uppercase',
  },
  modalButtonText: {
    color: styleConst.color.blue,
    fontSize: 17,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  modalButtonTextCancel: {
    color: styleConst.color.greyText,
    fontWeight: 'normal',
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BrandModelFilterScreen);
