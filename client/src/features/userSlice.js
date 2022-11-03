import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpService from '../helpers/axios';

const initialState = {
  user: null,
  message: '',
  notifications: [],
};

export const meUser = createAsyncThunk('auth/meUser', async (_, thunkAPI) => {
  try {
    const response = await httpService.get('/api/v1/auth/getMe');

    return await response.data;
  } catch (error) {
    if (!error.response) throw error;
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const logOut = createAsyncThunk('auth/logOut', async (_, thunkAPI) => {
  try {
    const response = await httpService.delete('/api/v1/auth/logout');

    return await response.data.message;
  } catch (error) {
    if (!error.response) throw error;
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    try {
      const response = await httpService.post('/api/v1/auth/refresh_token');

      return await response.data.message;
    } catch (error) {
      if (!error.response) throw error;
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    stateUser: (state) => {
      state.user = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    resetNotifications: (state, { payload }) => {
      state.notifications = payload?.user?.notifications.forEach((obj) => {
        obj.status = 'read';
      });
    },
  },
  extraReducers: {
    [meUser.pending]: (state) => {
      state.message = '';
    },
    [meUser.fulfilled]: (state, { payload }) => {
      state.message = payload;
      state.user = payload.user;
    },
    [meUser.rejected]: (state, { payload }) => {
      state.message = payload;
      state.user = null;
    },
    [logOut.fulfilled]: (state, { payload }) => {
      state.message = payload;
      state.user = null;
    },
    [refreshToken.fulfilled]: (state, { payload }) => {
      state.message = payload;
    },
  },
});
export const { stateUser, addNotification, resetNotifications } =
  userSlice.actions;

export default userSlice.reducer;
