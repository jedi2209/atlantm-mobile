import API from '../utils/api';
import {
  REVIEWS__REQUEST,
  REVIEWS__SUCCESS,
  REVIEWS__FAIL,
  REVIEWS__RESET,
  REVIEW__VISIT,
  REVIEWS_DATE_TO__FILL,
  REVIEWS_DATE_FROM__FILL,
  REVIEWS_DATE_PERIOD__SELECT,
  REVIEW_DEALER_RATING__REQUEST,
  REVIEW_DEALER_RATING__SUCCESS,
  REVIEW_DEALER_RATING__FAIL,
  REVIEWS_RATING_FROM__SELECT,
  REVIEWS_RATING_TO__SELECT,
  REVIEW_ADD_MESSAGE_PLUS__FILL,
  REVIEW_ADD_MESSAGE_MINUS__FILL,
  REVIEW_ADD_RATING_VALUE__SELECT,
  REVIEW_ADD_RATING_VARIANT__SELECT,
  REVIEW_ADD__REQUEST,
  REVIEW_ADD__SUCCESS,
  REVIEW_ADD__FAIL,
  REVIEW_ADD_PUBLIC_AGREE__SELECT,
} from './actionTypes';

import {EVENT_LOAD_MORE} from '../core/actionTypes';

export const actionSelectAddReviewPublicAgree = (isAgree) => {
  return (dispatch) => {
    dispatch({
      type: REVIEW_ADD_PUBLIC_AGREE__SELECT,
      payload: isAgree,
    });
  };
};

export const actionSelectAddReviewRating = (rating) => {
  return (dispatch) => {
    dispatch({
      type: REVIEW_ADD_RATING_VALUE__SELECT,
      payload: rating,
    });
  };
};

export const actionSelectAddReviewRatingVariant = (rating) => {
  return (dispatch) => {
    dispatch({
      type: REVIEW_ADD_RATING_VARIANT__SELECT,
      payload: rating,
    });
  };
};

export const actionReviewVisit = (reviewId) => {
  return (dispatch) => {
    dispatch({
      type: REVIEW__VISIT,
      payload: reviewId,
    });
  };
};

export const actionDateFromFill = (dateFrom) => {
  return (dispatch) => {
    dispatch({
      type: REVIEWS_DATE_FROM__FILL,
      payload: dateFrom,
    });
  };
};

export const actionDateToFill = (dateTo) => {
  return (dispatch) => {
    dispatch({
      type: REVIEWS_DATE_TO__FILL,
      payload: dateTo,
    });
  };
};

export const actionSelectFilterDatePeriod = (period) => {
  return (dispatch) => {
    dispatch({
      type: REVIEWS_DATE_PERIOD__SELECT,
      payload: period,
    });
  };
};

export const actionSelectFilterRatingFrom = (rating) => {
  return (dispatch) => {
    dispatch({
      type: REVIEWS_RATING_FROM__SELECT,
      payload: rating,
    });
  };
};

export const actionSelectFilterRatingTo = (rating) => {
  return (dispatch) => {
    dispatch({
      type: REVIEWS_RATING_TO__SELECT,
      payload: rating,
    });
  };
};

export const actionAddReviewPlusFill = (message) => {
  return (dispatch) => {
    dispatch({
      type: REVIEW_ADD_MESSAGE_PLUS__FILL,
      payload: message,
    });
  };
};

export const actionAddReviewMinusFill = (message) => {
  return (dispatch) => {
    dispatch({
      type: REVIEW_ADD_MESSAGE_MINUS__FILL,
      payload: message,
    });
  };
};

export const actionReviewsReset = () => {
  return (dispatch) => {
    dispatch({type: REVIEWS__RESET});
  };
};

export const actionFetchReviews = (props) => {
  return (dispatch) => {
    dispatch({
      type: REVIEWS__REQUEST,
      payload: {...props},
    });

    const nextPageUrl = props.type === EVENT_LOAD_MORE ? props.nextPage : null;

    return API.fetchReviews({...props, nextPageUrl})
      .then((res) => {
        if (res.error) {
          return dispatch({
            type: REVIEWS__FAIL,
            payload: {
              code: res.error.code,
              error: res.error.message,
            },
          });
        }

        const result = {...res};

        // в случае если отзывов нет, в data приходит пустой массив
        if (result.data.length === 0) {
          result.data.push({type: 'empty', id: Number(new Date())});
        } else {
          result.data = result.data[props.dealerId];
        }

        return dispatch({
          type: REVIEWS__SUCCESS,
          payload: {
            type: props.type,
            ...result,
          },
        });
      })
      .catch((error) => {
        return dispatch({
          type: REVIEWS__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionFetchDealerRating = ({dealerId}) => {
  return (dispatch) => {
    dispatch({
      type: REVIEW_DEALER_RATING__REQUEST,
      payload: {dealerId},
    });

    return API.fetchDealerRating({dealerId})
      .then((res) => {
        const {data, error} = res;

        if (error || !data) {
          return dispatch({
            type: REVIEW_DEALER_RATING__FAIL,
            payload: {
              code: res.error.code,
              error: res.error.message,
            },
          });
        }

        return dispatch({
          type: REVIEW_DEALER_RATING__SUCCESS,
          payload: {
            dealerId,
            ...data,
          },
        });
      })
      .catch((error) => {
        return dispatch({
          type: REVIEW_DEALER_RATING__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};

export const actionReviewAdd = (props) => {
  return (dispatch) => {
    dispatch({
      type: REVIEW_ADD__REQUEST,
      payload: {...props},
    });

    return API.reviewAdd(props)
      .then((res) => {
        const {error, status} = res;

        if (status !== 'success') {
          return dispatch({
            type: REVIEW_ADD__FAIL,
            payload: {
              code: error.code,
              error: error.message,
            },
          });
        }

        return dispatch({type: REVIEW_ADD__SUCCESS});
      })
      .catch((error) => {
        return dispatch({
          type: REVIEW_ADD__FAIL,
          payload: {
            error: error.message,
            code: error.code,
          },
        });
      });
  };
};
