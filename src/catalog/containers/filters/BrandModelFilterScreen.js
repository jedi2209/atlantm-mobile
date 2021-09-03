import React, {useState, useReducer} from 'react';
import PropTypes from 'prop-types';
import {View, ActivityIndicator, StyleSheet, Platform} from 'react-native';
import {Container, Button, Icon, Content, Text, CheckBox} from 'native-base';
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
          <View style={{flexDirection: 'row', flex: 1}}>
            <Icon
              type={'Ionicons'}
              style={styles.brandCaret}
              name={node.opened ? 'caret-down' : 'caret-forward'}
            />
            <View style={styles.colorWrapper}>
              <View style={{flexDirection: 'row'}}>
                {stockType != 'Used' ? (
                  <BrandLogo
                    brand={node.id}
                    width={30}
                    style={styles.brandLogo}
                    key={'brandLogo' + node.id}
                  />
                ) : null}
                <Text style={styles.colorText}>{node.label}</Text>
              </View>
              <CheckBox
                onPress={() => {
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
                checked={brandFilter && brandFilter[node.id] ? true : false}
              />
            </View>
          </View>
        ) : (
          <View style={styles[`nestedRow${level}Inner`]}>
            <Text style={{fontSize: 14}}>{node.label}</Text>
            <CheckBox
              onPress={() => {
                let typeTmp = 'add';
                if (modelFilter[node.id]) {
                  typeTmp = 'delete';
                }
                setModelFilter({id: node.id, type: typeTmp});
                _onChangeFilter('modelFilter', modelFilter);
                setUpdateNestedList(!nestedListUpdate);
              }}
              checked={modelFilter && modelFilter[node.id] ? true : false}
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
    <Container style={styles.container}>
      <Content style={{marginBottom: 50}}>
        <NestedListView
          data={accordionModels}
          onNodePressed={node => _onNestedNodePress(node)}
          renderNode={(node, level, isLastLevel) =>
            _renderNodeNested(node, level, isLastLevel)
          }
        />
      </Content>
      <View style={styles.resultButtonWrapper}>
        <Button
          transparent
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
          style={[styles.modalButton]}>
          <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
            {strings.Base.reset}
          </Text>
        </Button>
        <Button
          style={[
            styles.resultButton,
            styles.resultButtonEnabled,
            styleConst.shadow.default,
          ]}
          block
          disabled={false}
          active={true}
          onPress={() => {
            saveBrandModelFilter({stateFilters, stockType});
            navigation.goBack();
          }}>
          <Text style={styles.resultButtonText}>{strings.Base.choose}</Text>
        </Button>
      </View>
    </Container>
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
    marginTop: 0,
  },
  brandLogoWrapper: {},
  brandCaret: {
    fontSize: 26,
    marginTop: -4,
    marginRight: '5%',
    padding: 0,
    color: styleConst.color.systemGray,
  },
  resultButtonWrapper: {
    zIndex: 100,
    position: 'absolute',
    width: '90%',
    marginHorizontal: '5%',
    bottom: isAndroid ? 10 : 30,
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
