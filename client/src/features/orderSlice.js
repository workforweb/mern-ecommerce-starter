import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpService from '../helpers/axios';

const initialState = {
  isError: false,
  loading: false,
  orders: [],
  order: {},
  message: '',
};

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const newOrder = createAsyncThunk(
  'order/newOrder',
  async ({ userId, customerDetails, status }, thunkAPI) => {
    try {
      const response = await httpService.post(
        `/api/v1/order/${userId}`,
        { customerDetails, status },
        config
      );
      return await response?.data;
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

export const deleteCart = createAsyncThunk(
  'order/deleteCart',
  async ({ userId }, thunkAPI) => {
    try {
      const response = await httpService.delete(`/api/v1/order/cart/${userId}`);
      return await response?.data;
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

export const deleteOrder = createAsyncThunk(
  'order/deleteOrder',
  async ({ orderId }, thunkAPI) => {
    try {
      const response = await httpService.delete(`/api/v1/order/${orderId}`);
      return await response?.data;
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

export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async ({ userId }, thunkAPI) => {
    try {
      const response = await httpService.get(`/api/v1/order/${userId}`);
      return await response?.data;
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

export const getAdminOrders = createAsyncThunk(
  'order/getAdminOrders',
  async (_, thunkAPI) => {
    try {
      const response = await httpService.get(`/api/v1/order`);
      return await response?.data;
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

export const patchShippedOrder = createAsyncThunk(
  'order/patchShippedOrder',
  async ({ orderId, userId }, thunkAPI) => {
    try {
      const response = await httpService.patch(
        `/api/v1/order/${orderId}/product-shipped`,
        { userId, config }
      );

      return await response?.data;
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

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: {
    [newOrder.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.order = {};
      state.message = '';
    },
    [newOrder.fulfilled]: (state, { payload }) => {
      console.log('orderSliceJs42', payload);
      state.isError = false;
      state.loading = false;
      state.order = payload.order;
      window.sessionStorage.setItem('order', JSON.stringify(payload.order));
      state.message = payload.message;
    },
    [newOrder.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.order = {};
      state.message = payload;
    },
    [deleteOrder.fulfilled]: (state, { payload }) => {
      state.isError = false;
      state.loading = false;
      state.order = payload.order;
      window.sessionStorage.removeItem('order');
      state.message = payload.message;
    },
    [getUserOrders.fulfilled]: (state, { payload }) => {
      state.isError = false;
      state.loading = false;
      state.orders = payload.orders;
      state.message = payload.message;
    },
    [getAdminOrders.fulfilled]: (state, { payload }) => {
      state.isError = false;
      state.loading = false;
      state.orders = payload.orders;
      state.message = payload.message;
    },
    [patchShippedOrder.fulfilled]: (state, { payload }) => {
      state.isError = false;
      state.loading = false;
      state.orders = payload.orders;
      state.message = payload.message;
    },
  },
});

// export const {} = orderSlice.actions;

export default orderSlice.reducer;
