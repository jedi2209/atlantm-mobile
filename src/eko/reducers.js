import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
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
import { DEALER__SUCCESS } from '../dealer/actionTypes';

function isFetchReviews(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case REVIEWS__SUCCESS:
    case REVIEWS__FAIL:
    case REVIEWS__RESET:
      return false;
    case REVIEWS__REQUEST:
      return true;
    default:
      return state;
  }
}

function isFetchDealerRating(state = false, action) {
  switch (action.type) {
    case REHYDRATE:
    case REVIEW_DEALER_RATING__SUCCESS:
    case REVIEW_DEALER_RATING__FAIL:
      return false;
    case REVIEW_DEALER_RATING__REQUEST:
      return true;
    default:
      return state;
  }
}

function reviewsItems(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
    case REVIEWS__RESET:
      return [];
    case REVIEWS__SUCCESS:
      if (action.payload.type === EVENT_LOAD_MORE) {
        return [
          ...state,
          ...action.payload.data,
        ];
      }
      return action.payload.data;
    default:
      return state;
  }
}

function reviewsPages(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
    case REVIEWS__RESET:
      return {};
    case REVIEWS__SUCCESS:
      return action.payload.pages || {}; // на случай если пришел пустой массив
    default:
      return state;
  }
}

function reviewsTotal(state = {}, action) {
  switch (action.type) {
    case REHYDRATE:
    case DEALER__SUCCESS:
    case REVIEWS__RESET:
      return {};
    case REVIEWS__SUCCESS:
      return action.payload.total || {}; // на случай если пришел пустой массив
    default:
      return state;
  }
}

function reviewDateFrom(state = null, action) {
  switch (action.type) {
    case REVIEWS__RESET:
    case DEALER__SUCCESS:
      return null;
    case REVIEWS_DATE_FROM__FILL:
      return action.payload;
    default:
      return state;
  }
}

function reviewDateTo(state = null, action) {
  switch (action.type) {
    case REVIEWS__RESET:
    case DEALER__SUCCESS:
      return null;
    case REVIEWS_DATE_TO__FILL:
      return action.payload;
    default:
      return state;
  }
}

function needFetchReviews(state = false, action) {
  switch (action.type) {
    case DEALER__SUCCESS:
      return true;
    case REVIEWS__SUCCESS:
      return false;
    default:
      return state;
  }
}
function reviewsVisited(state = [], action) {
  switch (action.type) {
    case REVIEWS__RESET:
    case DEALER__SUCCESS:
      return [];
    case REVIEW__VISIT:
      return [
        ...state,
        action.payload,
      ];
    default:
      return state;
  }
}

function reviewDealerRating(state = null, action) {
  switch (action.type) {
    case REVIEWS__SUCCESS:
    case REVIEWS__RESET:
    case DEALER__SUCCESS:
      return null;
    case REVIEW_DEALER_RATING__SUCCESS:
      return action.payload.rating;
    default:
      return state;
  }
}

export default combineReducers({
  reviews: combineReducers({
    items: reviewsItems,
    pages: reviewsPages,
    total: reviewsTotal,
    visited: reviewsVisited,
    dateFrom: reviewDateFrom,
    dateTo: reviewDateTo,
    reviewDealerRating,
    meta: combineReducers({
      isFetchReviews,
      isFetchDealerRating,
      needFetchReviews,
    }),
  }),
});
