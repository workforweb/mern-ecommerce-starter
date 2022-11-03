import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpService from '../helpers/axios';

const initialState = {
  isError: false,
  loading: false,
  products: [],
  categories: [],
  productsCount: '',
  filteredProductsCount: '',
  resultPerPage: '',
  pages: '',
  message: '',
  product: {
    name: '',
    description: '',
    price: '',
    category: '',
    images: [],
  },
  similarProduct: {},
  similarProducts: [],
};

const config = { headers: { 'Content-Type': 'multipart/form-data' } };

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData, thunkAPI) => {
    try {
      const response = await httpService.post(
        '/api/v1/products',
        formData,
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

export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (query, thunkAPI) => {
    try {
      let link;

      if (query.page) {
        link = `/api/v1/products?page=${query.page}`;
      }

      if (query.category) {
        link = `/api/v1/products?category=${query.category}`;
      }

      if (query.sort) {
        link = `/api/v1/products?sort=${query.sort}`;
      }

      if (query.search) {
        link = `/api/v1/products?name[regex]=${query.search}`;
      }

      if (query.keyword) {
        link = `/api/v1/products?keyword=${query.keyword}`;
      }

      const response = await httpService.get(link);

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

export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, thunkAPI) => {
    try {
      const response = await httpService.get(`/api/v1/products/categories`);
      return response.data;
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

// export const getProducts = createAsyncThunk(
//   'products/getProducts',
//   async ({ page, category, sort, search }, thunkAPI) => {
//     try {
//       const response = await httpService.get(
//         `/api/v1/products?limit=${page}&${category}&${sort}&title[regex]=${search}`
//       );

//       return await response?.data;
//     } catch (error) {
//       if (!error.response) throw error;
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async ({ id }, thunkAPI) => {
    try {
      const response = await httpService.delete(`/api/v1/products/${id}`);

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

export const getProduct = createAsyncThunk(
  'products/getProduct',
  async ({ id }, thunkAPI) => {
    try {
      const response = await httpService.get(`/api/v1/products/single/${id}`);

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

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await httpService.patch(
        `/api/v1/products/${id}`,
        formData,
        config
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

export const getSimilarProducts = createAsyncThunk(
  'products/getSimilarProducts',
  async ({ id }, thunkAPI) => {
    try {
      const response = await httpService.get(`/api/v1/products/${id}`);

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

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.isError = false;
      state.loading = false;
      state.products = [];
      state.message = '';
    },
  },
  extraReducers: {
    [createProduct.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.products = [];
      state.message = '';
    },
    [createProduct.fulfilled]: (state, { payload }) => {
      state.isError = false;
      state.loading = false;
      state.products = payload.products;
      state.message = payload.message;
    },
    [createProduct.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.products = [];
      state.message = payload;
    },
    [getProducts.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.products = [];
      state.message = '';
    },
    [getProducts.fulfilled]: (state, { payload }) => {
      state.isError = false;
      state.loading = false;
      state.products = payload.products;
      state.pages = payload.pages;
      state.resultPerPage = payload.resultPerPage;
      state.productsCount = payload.productsCount;
      state.filteredProductsCount = payload.filteredProductsCount;
      state.message = payload.success;
    },
    [getProducts.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.products = [];
      // state.message = payload.success;
    },
    [getCategories.fulfilled]: (state, { payload }) => {
      state.categories = payload.categories;
    },
    [deleteProduct.fulfilled]: (state, action) => {
      const id = action.meta.arg.id;
      state.isError = false;
      state.loading = false;
      state.products = state.products.filter((item) => item._id !== id);
      state.message = action.payload.message;
    },
    [getProduct.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.products = [];
      state.message = '';
    },
    [getProduct.fulfilled]: (state, { payload }) => {
      // const id = action.meta.arg.id;
      state.isError = false;
      state.loading = false;
      state.product = payload;
      state.message = payload.message;
    },
    [getProduct.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.products = [];
      state.message = payload;
    },
    [updateProduct.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.products = [];
      state.message = '';
    },
    [updateProduct.fulfilled]: (state, { payload }) => {
      // const id = action.meta.arg.id;
      // console.log('action', id);
      state.isError = false;
      state.loading = false;
      state.products = payload.products;
      // state.products?.map((element) =>
      //   element.id === payload?.id ? payload : element
      // );

      state.message = payload.message;
    },
    [updateProduct.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.products = [];
      state.message = payload;
    },
    [getSimilarProducts.pending]: (state) => {
      state.isError = false;
      state.loading = true;
      state.similarProduct = {};
      state.similarProducts = [];
      state.message = '';
    },
    [getSimilarProducts.fulfilled]: (state, { payload }) => {
      state.isError = false;
      state.loading = false;
      state.similarProduct = payload.product;
      state.similarProducts = payload.similar;
      state.message = payload.message;
    },
    [getSimilarProducts.rejected]: (state, { payload }) => {
      state.isError = true;
      state.loading = false;
      state.similarProduct = {};
      state.similarProducts = [];
      state.message = payload;
    },
  },
});
export const { clearProduct } = productSlice.actions;

export default productSlice.reducer;
