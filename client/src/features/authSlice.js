import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpService from '../helpers/axios';
import { getCookie } from '../helpers';

const initialState = {
  isError: false,
  isLoggedIn: getCookie('loggedIn') ? true : false,
  isLoading: false,
  message: '',
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await httpService.post(
        '/api/v1/auth/signup',
        credentials
      );
      return await response.data;
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

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await httpService.post(
        '/api/v1/auth/login',
        credentials
      );

      return await response.data;
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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: {
    [registerUser.pending]: (state) => {
      state.isLoading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.loggedIn = true;
      state.isLoading = false;
      state.isLoggedIn = true;
      state.message = payload;
    },
    [registerUser.rejected]: (state, { payload }) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    },
    [loginUser.pending]: (state) => {
      state.isLoading = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.message = payload;
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.loggedIn = false;
      state.isLoading = false;
      state.isError = true;
      state.message = payload;
    },
  },
});
export const { reset } = authSlice.actions;

export default authSlice.reducer;
