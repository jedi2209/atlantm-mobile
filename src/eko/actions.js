import API from '../utils/api';
import { get } from 'lodash';
import {
  REVIEWS__REQUEST,
  REVIEWS__SUCCESS,
  REVIEWS__FAIL,
  REVIEWS__RESET,

  REVIEWS_DATE_TO__FILL,
  REVIEWS_DATE_FROM__FILL,

  REVIEW__VISIT,

  REVIEW_DEALER_RATING__REQUEST,
  REVIEW_DEALER_RATING__SUCCESS,
  REVIEW_DEALER_RATING__FAIL,
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
        const { data, pages, total, error } = res;

        if (error) {
          return dispatch({
            type: REVIEWS__FAIL,
            payload: {
              code: res.error.code,
              error: res.error.message,
            },
          });
        }

        const result = { ...res };

        // в случае если отзывов нет, в data приходит пустой массив
        if (result.data.length === 0) {
          result.data.push({ type: 'empty', id: Number(new Date()) });
        } else {
          result.data = result.data[dealerId];
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

export const actionFetchDealerRating = ({ dealerId }) => {
  return dispatch => {
    dispatch({
      type: REVIEW_DEALER_RATING__REQUEST,
      payload: { dealerId },
    });

    return API.fetchDealerRating({ dealerId })
      .then(res => {
        const { data, error } = res;

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
      .catch(error => {
        return dispatch({
          type: REVIEW_DEALER_RATING__FAIL,
          payload: {
            error: error.message,
          },
        });
      });
  };
};
