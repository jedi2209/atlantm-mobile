import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

// Create async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (props, { rejectWithValue }) => {
    try {
      const apiResponse = await API.fetchNotifications(props);
      const { error, status, data } = apiResponse;

      if (status !== 'success') {
        console.error('fetchNotifications error apiResponse', apiResponse);
        return rejectWithValue({ code: error.code, message: error.message });
      }

      return data;
    } catch (e) {
      console.error('fetchNotifications error', e);
      return rejectWithValue({ code: e.code, message: e.message });
    }
  }
);

// Create notifications slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    remote: {
      data: [],
      loading: false,
      error: null,
    },
    local: {
      data: [],
      loading: false,
      error: null,
    },
    all: [],
  },
  reducers: {
    addLocalNotification: (state, action) => {
      state.local.data.push(action.payload.data);
    },
    removeLocalNotification: (state, action) => {
      state.local.data = state.local.data.filter(
        notification => notification.id !== action.payload
      );
    },
    resetNotifications: (state) => {
      state.remote.data = [];
      state.remote.error = null;
      state.local.data = [];
      state.local.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.remote.loading = true;
        state.remote.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.remote.loading = false;
        state.remote.data = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.remote.loading = false;
        state.remote.error = action.payload;
      });
  },
});

// Export actions
export const { addLocalNotification, removeLocalNotification, resetNotifications } = notificationsSlice.actions;

// Thunk action creators
export const actionAddNotification = (props) => (dispatch) => {
  dispatch(addLocalNotification({ data: props }));
};

export const actionRemoveNotification = (id) => (dispatch) => {
  dispatch(removeLocalNotification(parseInt(id, 10)));
};

export const actionGetNotifications = (props) => async (dispatch, getState) => {
  try {
    // Get remote notifications
    await dispatch(fetchNotifications(props));
    // Get current state after fetching remote notifications
    const state = getState();
    // Return combined notifications from both remote and local sources
    let notificationsTmp = [];
    [...state.settings.notifications.remote.data, ...state.settings.notifications.local.data].forEach(el => {
      notificationsTmp.push(el);
    });
    notificationsTmp.sort((a, b) => {
      if (a.date.timestamp > b.date.timestamp) {
        return -1;
      }
      return b.date.timestamp > a.date.timestamp ? 0 : -1;
    });
    return {
      remote: state.settings.notifications.remote.data || [],
      local: state.settings.notifications.local.data || [],
      all: notificationsTmp || [],
      error: state.settings.notifications.remote.error || state.settings.notifications.local.error
    };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return {
      remote: [],
      local: [],
      all: [],
      error,
    };
  }
};

// Export reducer
export default notificationsSlice.reducer;
