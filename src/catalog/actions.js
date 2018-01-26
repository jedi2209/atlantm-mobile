import API from '../utils/api';

import {
  USED_CAR_LIST__REQUEST,
  USED_CAR_LIST__SUCCESS,
  USED_CAR_LIST__FAIL,
  USED_CAR_LIST__RESET,
  USED_CAR_LIST_UPDATE__SET,
  USED_CAR_LIST_STOP_UPDATE__SET,
  USED_CAR_CITY__SELECT,
  USED_CAR_PRICE_RANGE__SELECT,
  USED_CAR_REGION__SELECT,
  USED_CAR_PRICE_FILTER__SHOW,
  USED_CAR_PRICE_FILTER__HIDE,
  USED_CAR_DETAILS__REQUEST,
  USED_CAR_DETAILS__SUCCESS,
  USED_CAR_DETAILS__FAIL,

  NEW_CAR_CITY__SELECT,
  NEW_CAR_REGION__SELECT,

  NEW_CAR_FILTER_DATA__REQUEST,
  NEW_CAR_FILTER_DATA__SUCCESS,
  NEW_CAR_FILTER_DATA__FAIL,
  NEW_CAR_BY_FILTER__REQUEST,
  NEW_CAR_BY_FILTER__SUCCESS,
  NEW_CAR_BY_FILTER__FAIL,

  NEW_CAR_FILTER_BRANDS__SELECT,
  NEW_CAR_FILTER_MODELS__SELECT,
  NEW_CAR_FILTER_BODY__SELECT,
  NEW_CAR_FILTER_GEARBOX__SELECT,
  NEW_CAR_FILTER_ENGINE_TYPE__SELECT,
  NEW_CAR_FILTER_DRIVE__SELECT,
  NEW_CAR_FILTER_PRICE__SELECT,
  NEW_CAR_FILTER_PRICE__SHOW,
  NEW_CAR_FILTER_PRICE__HIDE,
  NEW_CAR_DETAILS__REQUEST,
  NEW_CAR_DETAILS__SUCCESS,
  NEW_CAR_DETAILS__FAIL,

  CATALOG_DEALER__REQUEST,
  CATALOG_DEALER__SUCCESS,
  CATALOG_DEALER__FAIL,

  CATALOG_ORDER__REQUEST,
  CATALOG_ORDER__SUCCESS,
  CATALOG_ORDER__FAIL,

  CATALOG_ORDER_COMMENT__FILL,

  // comment
  CAR_COST__REQUEST,
  CAR_COST__SUCCESS,
  CAR_COST__FAIL,
  CAR_COST_PHOTOS__FILL,
  CAR_COST_BRAND__FILL,
  CAR_COST_MODEL__FILL,
  CAR_COST_YEAR__SELECT,
  CAR_COST_MILEAGE__FILL,
  CAR_COST_MILEAGE_UNIT__SELECT,
  CAR_COST_ENGINE_VOLUME__SELECT,
  CAR_COST_ENGINE_TYPE__SELECT,
  CAR_COST_GEARBOX__SELECT,
  CAR_COST_COLOR__FILL,
  CAR_COST_CAR_CONDITION__SELECT,
  CAR_COST_COMMENT__FILL,
  CAR_COST_VIN__FILL,
} from './actionTypes';

import { EVENT_LOAD_MORE } from '../core/actionTypes';

export const actionFetchUsedCar = ({ type, city, nextPage, priceRange }) => {
  return dispatch => {
    dispatch({
      type: USED_CAR_LIST__REQUEST,
      payload: {
        type,
        city,
        nextPage,
        priceRange,
      },
    });

    const nextPageUrl = type === EVENT_LOAD_MORE ? nextPage : null;

    return API.fetchUsedCar({
      city,
      priceRange,
      nextPageUrl,
    })
      .then(res => {
        let { data, error, total, pages, prices } = res;

        if (error) {
          return dispatch({
            type: USED_CAR_LIST__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        if (data.length === 0) {
          data.push({ type: 'empty', id: { api: 1 } });

          // TODO: разобраться, почему перестает работать priceFilter если null
          prices = {};
        }

        return dispatch({
          type: USED_CAR_LIST__SUCCESS,
          payload: {
            type,
            data,
            total,
            pages,
            prices,
          },
        });
      })
      .catch(error => {
        return dispatch({
          type: USED_CAR_LIST__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionSelectUsedCarPriceRange = (prices) => {
  return dispatch => {
    dispatch({
      type: USED_CAR_PRICE_RANGE__SELECT,
      payload: prices,
    });
  };
};

export const actionSelectUsedCarCity = (city) => {
  return dispatch => {
    dispatch({
      type: USED_CAR_CITY__SELECT,
      payload: city,
    });
  };
};

export const actionSelectUsedCarRegion = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_REGION__SELECT,
      payload: region,
    });
  };
};

export const actionResetUsedCarList = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_LIST__RESET,
      payload: region,
    });
  };
};

export const actionShowPriceFilter = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_PRICE_FILTER__SHOW,
      payload: region,
    });
  };
};

export const actionHidePriceFilter = (region) => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_PRICE_FILTER__HIDE,
      payload: region,
    });
  };
};

export const actionFetchDealer = dealerBaseData => {
  return dispatch => {
    dispatch({
      type: CATALOG_DEALER__REQUEST,
      payload: dealerBaseData,
    });

    return API.fetchDealer(dealerBaseData.id)
      .then(response => {

        if (response.error) {
          return dispatch({
            type: CATALOG_DEALER__FAIL,
            payload: {
              error: response.error.message,
            },
          });
        }

        const dealer = { ...response.data };

        dealer.id = dealerBaseData.id;
        dealer.region = dealerBaseData.region;
        dealer.brands = dealerBaseData.brands;

        return dispatch({
          type: CATALOG_DEALER__SUCCESS,
          payload: dealer,
        });
      })
      .catch(error => {
        return dispatch({
          type: CATALOG_DEALER__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionCommentOrderCarFill = (comment) => {
  return dispatch => {
    return dispatch({
      type: CATALOG_ORDER_COMMENT__FILL,
      payload: comment,
    });
  };
};

export const actionOrderCar = (props) => {
  return dispatch => {
    dispatch({
      type: CATALOG_ORDER__REQUEST,
      payload: { ...props },
    });

    return API.orderCar(props)
      .then(res => {
        const { error, status } = res;

        if (status !== 'success') {
          return dispatch({
            type: CATALOG_ORDER__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({ type: CATALOG_ORDER__SUCCESS });
      })
      .catch(error => {
        return dispatch({
          type: CATALOG_ORDER__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};

export const actionFetchUsedCarDetails = carId => {
  return dispatch => {
    dispatch({
      type: USED_CAR_DETAILS__REQUEST,
      payload: carId,
    });

    return API.fetchUsedCarDetails(carId)
      .then(response => {
        if (response.error) {
          return dispatch({
            type: USED_CAR_DETAILS__FAIL,
            payload: {
              error: response.error.message,
            },
          });
        }

        const details = { ...response.data };

        return dispatch({
          type: USED_CAR_DETAILS__SUCCESS,
          payload: details,
        });
      })
      .catch(error => {
        return dispatch({
          type: USED_CAR_DETAILS__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionSetNeedUpdateUsedCarList = () => {
  return dispatch => {
    dispatch({
      type: USED_CAR_LIST_UPDATE__SET,
    });
  };
};

export const actionSetStopNeedUpdateUsedCarList = () => {
  return dispatch => {
    dispatch({
      type: USED_CAR_LIST_STOP_UPDATE__SET,
    });
  };
};

// newcar
export const actionSelectNewCarCity = (city) => {
  return dispatch => {
    dispatch({
      type: NEW_CAR_CITY__SELECT,
      payload: city,
    });
  };
};

export const actionSelectNewCarRegion = (region) => {
  return dispatch => {
    return dispatch({
      type: NEW_CAR_REGION__SELECT,
      payload: region,
    });
  };
};

export const actionFetchNewCarFilterData = props => {
  return dispatch => {
    dispatch({
      type: NEW_CAR_FILTER_DATA__REQUEST,
      payload: props,
    });

    return API.fetchNewCarFilterData(props)
      .then(res => {
        if (res.error) {
          return dispatch({
            type: NEW_CAR_FILTER_DATA__FAIL,
            payload: {
              error: res.error.message,
            },
          });
        }

        return dispatch({
          type: NEW_CAR_FILTER_DATA__SUCCESS,
          payload: { ...res },
        });
      })
      .catch(error => {
        return dispatch({
          type: NEW_CAR_FILTER_DATA__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionFetchNewCarByFilter = props => {
  return dispatch => {
    dispatch({
      type: NEW_CAR_BY_FILTER__REQUEST,
      payload: props,
    });

    const newProps = { ...props };

    if (props.type === EVENT_LOAD_MORE) {
      newProps.searchUrl = props.nextPage;
    }

    return API.fetchNewCarByFilter(newProps)
      .then(response => {
        if (response.error) {
          return dispatch({
            type: NEW_CAR_BY_FILTER__FAIL,
            payload: {
              error: response.error.message,
            },
          });
        }

        return dispatch({
          type: NEW_CAR_BY_FILTER__SUCCESS,
          payload: {
            ...response,
            type: props.type,
          },
        });
      })
      .catch(error => {
        return dispatch({
          type: NEW_CAR_BY_FILTER__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionSelectNewCarFilterBrands = (brands) => {
  return dispatch => {
    return dispatch({
      type: NEW_CAR_FILTER_BRANDS__SELECT,
      payload: brands,
    });
  };
};

export const actionSelectNewCarFilterModels = (models) => {
  return dispatch => {
    return dispatch({
      type: NEW_CAR_FILTER_MODELS__SELECT,
      payload: models,
    });
  };
};

export const actionSelectNewCarFilterBody = (body) => {
  return dispatch => {
    return dispatch({
      type: NEW_CAR_FILTER_BODY__SELECT,
      payload: body,
    });
  };
};

export const actionSelectNewCarFilterGearbox = (gearbox) => {
  return dispatch => {
    dispatch({
      type: NEW_CAR_FILTER_GEARBOX__SELECT,
      payload: gearbox,
    });
  };
};

export const actionSelectNewCarFilterDrive = (drive) => {
  return dispatch => {
    dispatch({
      type: NEW_CAR_FILTER_DRIVE__SELECT,
      payload: drive,
    });
  };
};

export const actionSelectNewCarFilterEngineType = (engineType) => {
  return dispatch => {
    dispatch({
      type: NEW_CAR_FILTER_ENGINE_TYPE__SELECT,
      payload: engineType,
    });
  };
};

export const actionSelectNewCarFilterPrice = (prices) => {
  return dispatch => {
    dispatch({
      type: NEW_CAR_FILTER_PRICE__SELECT,
      payload: prices,
    });
  };
};

export const actionShowNewCarFilterPrice = () => {
  return dispatch => {
    return dispatch({ type: NEW_CAR_FILTER_PRICE__SHOW });
  };
};

export const actionHideNewCarFilterPrice = () => {
  return dispatch => {
    return dispatch({ type: NEW_CAR_FILTER_PRICE__HIDE });
  };
};

export const actionFetchNewCarDetails = carId => {
  return dispatch => {
    dispatch({
      type: NEW_CAR_DETAILS__REQUEST,
      payload: carId,
    });

    return API.fetchNewCarDetails(carId)
      .then(response => {
        if (response.error) {
          return dispatch({
            type: NEW_CAR_DETAILS__FAIL,
            payload: {
              error: response.error.message,
            },
          });
        }

        const details = { ...response.data };

        return dispatch({
          type: NEW_CAR_DETAILS__SUCCESS,
          payload: details,
        });
      })
      .catch(error => {
        return dispatch({
          type: NEW_CAR_DETAILS__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

// carcost
export const actionFillPhotosCarCost = (photos) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_PHOTOS__FILL,
      payload: photos,
    });
  };
};

export const actionFillBrandCarCost = (brand) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_BRAND__FILL,
      payload: brand,
    });
  };
};

export const actionFillModelCarCost = (model) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_MODEL__FILL,
      payload: model,
    });
  };
};

export const actionFillColorCarCost = (color) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_COLOR__FILL,
      payload: color,
    });
  };
};

export const actionSelectYearCarCost = (year) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_YEAR__SELECT,
      payload: year,
    });
  };
};

export const actionFillMileageCarCost = (mileage) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_MILEAGE__FILL,
      payload: mileage,
    });
  };
};

export const actionSelectMileageUnitCarCost = (mileageUnit) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_MILEAGE_UNIT__SELECT,
      payload: mileageUnit,
    });
  };
};

export const actionSelectEngineVolumeCarCost = (engine) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_ENGINE_VOLUME__SELECT,
      payload: engine,
    });
  };
};

export const actionSelectEngineTypeCarCost = (engine) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_ENGINE_TYPE__SELECT,
      payload: engine,
    });
  };
};

export const actionFillVinCarCost = (engine) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_VIN__FILL,
      payload: engine,
    });
  };
};

export const actionSelectGearboxCarCost = (gearbox) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_GEARBOX__SELECT,
      payload: gearbox,
    });
  };
};

export const actionSelectCarConditionCarCost = (carCondition) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_CAR_CONDITION__SELECT,
      payload: carCondition,
    });
  };
};

export const actionFillCommentCarCost = (comment) => {
  return dispatch => {
    return dispatch({
      type: CAR_COST_COMMENT__FILL,
      payload: comment,
    });
  };
};

export const actionCarCostOrder = (props) => {
  return dispatch => {
    dispatch({
      type: CAR_COST__REQUEST,
      payload: { ...props },
    });

    return API.carCostOrder(props)
      .then(rnFetchBlobresult => {
        const { data } = rnFetchBlobresult;
        try {
          const res = JSON.parse(data);
          const { status, error } = res;

          if (status !== 'success') {
            return dispatch({
              type: CAR_COST__FAIL,
              payload: {
                code: error.code,
                message: error.message,
              },
            });
          }

          return dispatch({ type: CAR_COST__SUCCESS });
        } catch (parseError) {
          __DEV__ && console.log('carCostOrder parse error', parseError);

          return dispatch({ type: CAR_COST__FAIL });
        }
      })
      .catch(error => {
        return dispatch({
          type: CAR_COST__FAIL,
          payload: {
            message: error,
          },
        });
      });
  };
};
// END carcost
