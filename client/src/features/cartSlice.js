import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpService from '../helpers/axios';

const initialState = {
  isError: false,
  loading: false,
  message: '',
  cart: {},
};

export const getCart = createAsyncThunk(
  'cart/getCart',
  async ({ userId }, thunkAPI) => {
    try {
      const response = await httpService.get(`/api/v1/cart/${userId}`);
      // console.log('getCart', response);
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

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const response = await httpService.post(`/api/v1/cart/${userId}`, {
        productId,
        quantity,
      });
      console.log('add-to-cart', response);
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

export const expandCart = createAsyncThunk(
  'cart/expandCart',
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const response = await httpService.put(`/api/v1/cart/${userId}`, {
        productId,
        quantity,
      });
      console.log('increase-cart', response);
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

export const reduceCart = createAsyncThunk(
  'cart/reduceCart',
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const response = await httpService.put(`/api/v1/cart/${userId}`, {
        productId,
        quantity,
      });
      console.log('decrease-cart', response);
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

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async ({ userId, productId }, thunkAPI) => {
    try {
      const response = await httpService.delete(
        `/api/v1/cart/${userId}/${productId}`
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

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: {
    [getCart.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.message = '';
      state.cart = {};
    },
    [getCart.fulfilled]: (state, { payload }) => {
      // console.log('cartSliceJs118', payload);
      state.isError = false;
      state.loading = false;
      state.cart = payload.cart;
      state.message = payload.success;
    },
    [getCart.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.message = payload;
      state.cart = {};
    },
    [addToCart.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.message = '';
      state.cart = {};
    },
    [addToCart.fulfilled]: (state, { payload }) => {
      console.log('cartSliceJs137', payload);
      state.isError = false;
      state.loading = false;
      state.cart = payload.cart;
      state.message = payload.success;
    },
    [addToCart.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.message = payload;
      state.cart = {};
    },
    [expandCart.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.message = '';
      state.cart = {};
    },
    [expandCart.fulfilled]: (state, { payload }) => {
      console.log('cartSliceJs156', payload);
      state.isError = false;
      state.loading = false;
      state.cart = payload.cart;
      state.message = payload.success;
    },
    [expandCart.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.message = payload;
      state.cart = {};
    },
    [reduceCart.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.message = '';
      state.cart = {};
    },
    [reduceCart.fulfilled]: (state, { payload }) => {
      console.log('cartSliceJs175', payload);
      state.isError = false;
      state.loading = false;
      state.cart = payload.cart;
      state.message = payload.message;
    },
    [reduceCart.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.message = payload;
      state.cart = {};
    },
    [clearCart.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.message = '';
      state.cart = {};
    },
    [clearCart.fulfilled]: (state, { payload }) => {
      state.isError = false;
      state.loading = false;
      state.cart = payload.cart;
      state.message = payload.message;
    },
    [clearCart.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.message = payload;
      state.cart = {};
    },
  },
});

// export const {} = cartSlice.actions;

export default cartSlice.reducer;
