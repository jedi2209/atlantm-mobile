import API from '../utils/api';

import {get} from 'lodash';

import {
  USED_CAR_LIST__REQUEST,
  USED_CAR_LIST__SUCCESS,
  USED_CAR_LIST__FAIL,
  USED_CAR_DETAILS__REQUEST,
  USED_CAR_DETAILS__SUCCESS,
  USED_CAR_DETAILS__FAIL,
  USED_CAR_DETAILS_PHOTO_VIEWER__OPEN,
  USED_CAR_DETAILS_PHOTO_VIEWER__CLOSE,
  USED_CAR_DETAILS_PHOTO_VIEWER_INDEX__UPDATE,
  USED_CAR_DETAILS_PHOTO_VIEWER_ITEMS__SET,
  NEW_CAR_CITY__SELECT,
  NEW_CAR_FILTER_DATA__REQUEST,
  NEW_CAR_FILTER_DATA__SUCCESS,
  NEW_CAR_FILTER_DATA__FAIL,
  USED_CAR_FILTER_DATA__REQUEST,
  USED_CAR_FILTER_DATA__SUCCESS,
  USED_CAR_FILTER_DATA__FAIL,
  NEW_CAR_BY_FILTER__REQUEST,
  NEW_CAR_BY_FILTER__SUCCESS,
  NEW_CAR_BY_FILTER__FAIL,
  NEW_CAR_DETAILS__REQUEST,
  NEW_CAR_DETAILS__SUCCESS,
  NEW_CAR_DETAILS__FAIL,
  TD_CAR_DETAILS__REQUEST,
  TD_CAR_DETAILS__SUCCESS,
  TD_CAR_DETAILS__FAIL,
  NEW_CAR_DETAILS_PHOTO_VIEWER__OPEN,
  NEW_CAR_DETAILS_PHOTO_VIEWER__CLOSE,
  NEW_CAR_DETAILS_PHOTO_VIEWER_INDEX__UPDATE,
  NEW_CAR_DETAILS_PHOTO_VIEWER_ITEMS__SET,
  CATALOG_DEALER__REQUEST,
  CATALOG_DEALER__SUCCESS,
  CATALOG_DEALER__FAIL,
  CATALOG_ORDER__REQUEST,
  CATALOG_ORDER__SUCCESS,
  CATALOG_ORDER__FAIL,
  CATALOG_ORDER_COMMENT__FILL,
  TESTDRIVE_LEAD__REQUEST,
  TESTDRIVE_LEAD__SUCCESS,
  TESTDRIVE_LEAD__FAIL,
  TESTDRIVE_ORDER__REQUEST,
  TESTDRIVE_ORDER__SUCCESS,
  TESTDRIVE_ORDER__FAIL,
  CREDIT_ORDER__REQUEST,
  CREDIT_ORDER__SUCCESS,
  CREDIT_ORDER__FAIL,
  MYPRICE_ORDER__REQUEST,
  MYPRICE_ORDER__SUCCESS,
  MYPRICE_ORDER__FAIL,

  // comment
  CAR_COST__REQUEST,
  CAR_COST__SUCCESS,
  CAR_COST__FAIL,

  // filters
  SAVE_USEDCAR_FILTERS,
  SAVE_NEWCAR_FILTERS,
} from './actionTypes';

import {EVENT_LOAD_MORE} from '../core/actionTypes';

export const actionFetchNewCarByFilter = props => {
  props.url = `/stock/new/cars/get/city/${props.city}/`;
  let urlParams = [];
  let filtersRaw = {};
  let sortingRaw = {};

  console.log('actionFetchNewCarByFilter props', props);

  if (props.filters) {
    for (const [key, value] of Object.entries(props.filters)) {
      if (value) {
        if (typeof value === 'object') {
          continue;
        }
        if (value === true) {
          urlParams.push(`${key}=1`);
          filtersRaw[key] = 1;
        } else {
          if (value !== false && value !== 'false') {
            urlParams.push(`${key}=${value}`);
            filtersRaw[key] = value;
          }
        }
      }
    }
  }

  return dispatch => {
    dispatch({
      type: NEW_CAR_BY_FILTER__REQUEST,
      payload: props,
    });

    if (props.sortBy) {
      sortingRaw.sortBy = props.sortBy;
    }

    if (props.sortDirection) {
      sortingRaw.sortDirection = props.sortDirection;
    }

    if (props.type !== EVENT_LOAD_MORE) {
      dispatch({
        type: SAVE_NEWCAR_FILTERS,
        payload: {
          filters: filtersRaw,
          sorting: sortingRaw,
          url: props.url + '?' + urlParams.join('&'),
        },
      });
    }

    if (props.sortBy) {
      urlParams.push(`sortBy=${props.sortBy}`);
    }

    if (props.sortDirection) {
      urlParams.push(`sortDirection=${props.sortDirection}`);
    }

    if (props.type !== EVENT_LOAD_MORE) {
      props.url = props.url + '?' + urlParams.join('&');
    }

    const newProps = {...props};

    if (props.type === EVENT_LOAD_MORE) {
      newProps.nextPageUrl = props.nextPage;
    }

    return API.fetchStock(newProps)
      .then(response => {
        console.log('API fetchStock url responce', response);
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
export const actionFetchUsedCarByFilter = props => {
  props.url = `/stock/trade-in/cars/get/city/${props.city}/`;
  let urlParams = [];
  let filtersRaw = {};
  let sortingRaw = {};

  if (props.filters) {
    for (const [key, value] of Object.entries(props.filters)) {
      if (value) {
        if (typeof value === 'object') {
          continue;
        }
        if (value === true) {
          urlParams.push(`${key}=1`);
          filtersRaw[key] = 1;
        } else {
          if (value !== false && value !== 'false') {
            urlParams.push(`${key}=${value}`);
            filtersRaw[key] = value;
          }
        }
      }
    }
  }

  return dispatch => {
    dispatch({
      type: USED_CAR_LIST__REQUEST,
      payload: props,
    });

    if (props.sortBy) {
      sortingRaw.sortBy = props.sortBy;
    }

    if (props.sortDirection) {
      sortingRaw.sortDirection = props.sortDirection;
    }

    if (props.type !== EVENT_LOAD_MORE) {
      dispatch({
        type: SAVE_USEDCAR_FILTERS,
        payload: {
          filters: filtersRaw,
          sorting: sortingRaw,
          url: props.url + '?' + urlParams.join('&'),
        },
      });
    }

    if (props.sortBy) {
      urlParams.push(`sortBy=${props.sortBy}`);
    }

    if (props.sortDirection) {
      urlParams.push(`sortDirection=${props.sortDirection}`);
    }

    if (props.type !== EVENT_LOAD_MORE) {
      props.url = props.url + '?' + urlParams.join('&');
    }

    const newProps = {...props};

    if (props.type === EVENT_LOAD_MORE) {
      newProps.nextPageUrl = props.nextPage;
      newProps.isNextPage = true;
    }

    return API.fetchStock(newProps)
      .then(res => {
        let {data, error, total, pages, prices} = res;

        let type = props.type;

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
          data.push({type: 'empty', id: {api: 1}});

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

        const dealer = {...response.data};

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

export const actionCommentOrderCarFill = comment => {
  return dispatch => {
    return dispatch({
      type: CATALOG_ORDER_COMMENT__FILL,
      payload: comment,
    });
  };
};

export const actionOrderTestDrive = props => {
  return dispatch => {
    dispatch({
      type: TESTDRIVE_ORDER__REQUEST,
      payload: {...props},
    });

    return API.orderTestDrive(props)
      .then(res => {
        console.log('res', res);
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: TESTDRIVE_ORDER__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: TESTDRIVE_ORDER__SUCCESS});
      })
      .catch(error => {
        return dispatch({
          type: TESTDRIVE_ORDER__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};

export const actionOrderCar = props => {
  return dispatch => {
    dispatch({
      type: CATALOG_ORDER__REQUEST,
      payload: {...props},
    });

    return API.orderCar(props)
      .then(res => {
        console.log('res', res);
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: CATALOG_ORDER__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: CATALOG_ORDER__SUCCESS});
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

export const actionOrderCreditCar = props => {
  return dispatch => {
    dispatch({
      type: CREDIT_ORDER__REQUEST,
      payload: {...props},
    });

    return API.orderCreditCar(props)
      .then(res => {
        console.log('res', res);
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: CREDIT_ORDER__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: CREDIT_ORDER__SUCCESS});
      })
      .catch(error => {
        return dispatch({
          type: TESTDRIVE_LEAD__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};
export const actionOrderMyPrice = props => {
  return dispatch => {
    dispatch({
      type: MYPRICE_ORDER__REQUEST,
      payload: {...props},
    });

    return API.orderMyPrice(props)
      .then(res => {
        console.log('res', res);
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: MYPRICE_ORDER__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: MYPRICE_ORDER__SUCCESS});
      })
      .catch(error => {
        return dispatch({
          type: TESTDRIVE_LEAD__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};
export const actionOrderTestDriveLead = props => {
  return dispatch => {
    dispatch({
      type: TESTDRIVE_LEAD__REQUEST,
      payload: {...props},
    });

    return API.orderTestDriveLead(props)
      .then(res => {
        console.log('res', res);
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: TESTDRIVE_LEAD__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: TESTDRIVE_LEAD__SUCCESS});
      })
      .catch(error => {
        return dispatch({
          type: TESTDRIVE_LEAD__FAIL,
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

        const details = {...response.data};

        // если есть фото нужного размера, записываем их в стор в нужной структуре данных
        const photoViewerItems = get(details, 'img.original', []).map(photo => {
          return {source: {uri: photo + '?d=800x600'}};
        });

        photoViewerItems.length &&
          dispatch({
            type: USED_CAR_DETAILS_PHOTO_VIEWER_ITEMS__SET,
            payload: photoViewerItems,
          });

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

export const actionOpenUsedCarPhotoViewer = () => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_DETAILS_PHOTO_VIEWER__OPEN,
    });
  };
};

export const actionCloseUsedCarPhotoViewer = () => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_DETAILS_PHOTO_VIEWER__CLOSE,
    });
  };
};

export const actionUpdateUsedCarPhotoViewerIndex = index => {
  return dispatch => {
    return dispatch({
      type: USED_CAR_DETAILS_PHOTO_VIEWER_INDEX__UPDATE,
      payload: index,
    });
  };
};
// newcar
export const actionSelectNewCarCity = city => {
  return dispatch => {
    dispatch({
      type: NEW_CAR_CITY__SELECT,
      payload: city,
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
          payload: {...res},
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
export const actionFetchUsedCarFilterData = props => {
  return dispatch => {
    dispatch({
      type: USED_CAR_FILTER_DATA__REQUEST,
      payload: props,
    });

    return API.fetchUsedCarFilterData(props)
      .then(res => {
        if (res.error) {
          return dispatch({
            type: USED_CAR_FILTER_DATA__FAIL,
            payload: {
              error: res.error.message,
            },
          });
        }

        return dispatch({
          type: USED_CAR_FILTER_DATA__SUCCESS,
          payload: {...res},
        });
      })
      .catch(error => {
        return dispatch({
          type: USED_CAR_FILTER_DATA__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
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

        const details = {...response.data};

        // если есть фото нужного размера, записываем их в стор в нужной структуре данных
        let photoViewerItems = [];
        if (get(details, 'imgReal.thumb')) {
          photoViewerItems = get(details, 'imgReal.thumb', []).map(photo => {
            return {source: {uri: photo + '?d=1000x1000'}};
          });
        } else {
          photoViewerItems = get(details, 'img.10000x440', []).map(photo => {
            return {source: {uri: photo}};
          });
        }

        photoViewerItems.length &&
          dispatch({
            type: NEW_CAR_DETAILS_PHOTO_VIEWER_ITEMS__SET,
            payload: photoViewerItems,
          });

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

export const actionFetchTestDriveCarDetails = (dealerID, carID) => {
  return dispatch => {
    dispatch({
      type: TD_CAR_DETAILS__REQUEST,
      payload: {dealerID, carID},
    });

    return API.fetchTDCarDetails(dealerID, carID)
      .then(response => {
        if (response.error) {
          return dispatch({
            type: TD_CAR_DETAILS__FAIL,
            payload: {
              error: response.error.message,
            },
          });
        }
        return dispatch({
          type: TD_CAR_DETAILS__SUCCESS,
          payload: {...response.data},
        });
      })
      .catch(error => {
        return dispatch({
          type: TD_CAR_DETAILS__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionOpenNewCarPhotoViewer = () => {
  return dispatch => {
    return dispatch({
      type: NEW_CAR_DETAILS_PHOTO_VIEWER__OPEN,
    });
  };
};

export const actionCloseNewCarPhotoViewer = () => {
  return dispatch => {
    return dispatch({
      type: NEW_CAR_DETAILS_PHOTO_VIEWER__CLOSE,
    });
  };
};

export const actionUpdateNewCarPhotoViewerIndex = index => {
  return dispatch => {
    return dispatch({
      type: NEW_CAR_DETAILS_PHOTO_VIEWER_INDEX__UPDATE,
      payload: index,
    });
  };
};

// carcost

export const actionCarCostOrder = props => {
  return dispatch => {
    dispatch({
      type: CAR_COST__REQUEST,
      payload: {...props},
    });

    return API.carCostOrder(props)
      .then(data => {
        try {
          __DEV__ && console.log('carCostOrder result', data);
          const {status, error} = data;

          if (status !== 'success') {
            return dispatch({
              type: CAR_COST__FAIL,
              payload: {
                code: error.code,
                message: error.message,
              },
            });
          }

          return dispatch({type: CAR_COST__SUCCESS});
        } catch (parseError) {
          __DEV__ && console.log('carCostOrder parse error', parseError);

          return dispatch({type: CAR_COST__FAIL});
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

/**
 * Сохраняет список выбранных фильтров.
 */
export const actionSaveNewCarFilters = ({filters, sorting, url}) => {
  return dispatch => {
    return dispatch({
      type: SAVE_NEWCAR_FILTERS,
      payload: {
        filters,
        sorting,
        url,
      },
    });
  };
};

/**
 * Сохраняет список выбранных фильтров на странице подержанных авто.
 */
export const actionSaveUsedCarFilters = ({filters, sorting, url}) => {
  return dispatch => {
    return dispatch({
      type: SAVE_USEDCAR_FILTERS,
      payload: {
        filters,
        sorting,
        url,
      },
    });
  };
};
