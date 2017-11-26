import API from '../utils/api';

import {
  REVIEWS__REQUEST,
  REVIEWS__SUCCESS,
  REVIEWS__FAIL,
  REVIEWS__RESET,

  REVIEWS_DATE_TO__FILL,
  REVIEWS_DATE_FROM__FILL,

  REVIEW__VISIT,
} from './actionTypes';

import { EVENT_LOAD_MORE } from '../core/actionTypes';

export const actionReviewVisit = (reviewId) => {
  return dispatch => {
    dispatch({
      type: REVIEW__VISIT,
      payload: reviewId,
    });
  };
};

export const actionReviewsDateFromFill = (dateFrom) => {
  return dispatch => {
    dispatch({
      type: REVIEWS_DATE_FROM__FILL,
      payload: dateFrom,
    });
  };
};

export const actionReviewsDateToFill = (dateTo) => {
  return dispatch => {
    dispatch({
      type: REVIEWS_DATE_TO__FILL,
      payload: dateTo,
    });
  };
};

export const actionReviewsReset = () => {
  return dispatch => {
    dispatch({ type: REVIEWS__RESET });
  };
};

export const actionFetchReviews = ({ type, dealerId, nextPage, dateFrom, dateTo }) => {
  return dispatch => {
    dispatch({
      type: REVIEWS__REQUEST,
      payload: { type, dealerId, nextPage, dateFrom, dateTo },
    });

    const nextPageUrl = type === EVENT_LOAD_MORE ? nextPage : null;

    return API.fetchReviews({ dealerId, dateFrom, dateTo, nextPageUrl })
      .then(res => {
        if (res.error) {
          return dispatch({
            type: REVIEWS__FAIL,
            payload: {
              code: res.error.code,
              error: res.error.message,
            },
          });
        }

        const result = { ...res };
        result.data = result.data[dealerId];

        if (result.data.length === 0) {
          result.data.push({ type: 'empty', id: 1 });
        }

        return dispatch({
          type: REVIEWS__SUCCESS,
          payload: {
            type,
            ...result,
          },
        });
      })
      .catch(error => {
        return dispatch({
          type: REVIEWS__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};
