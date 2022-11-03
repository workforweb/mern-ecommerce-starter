import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/authSlice';
import userReducer from '../features/userSlice';
import productReducer from '../features/productSlice';
import cartReducer from '../features/cartSlice';
import orderReducer from '../features/orderSlice';

import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { persistStore } from 'redux-persist';

import { reset } from '../features/authSlice';

const persistConfig = {
  key: 'root',
  storage: storage,
  version: 1,
  blacklist: ['auth', 'products', 'cart', 'order'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  products: productReducer,
  cart: cartReducer,
  order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // immutableCheck: { warnAfter: 1000 },
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // warnAfter: 1000,
      },
    }),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export const resetStore = async () => {
  persistor.pause();
  await persistor.purge();
  await persistor.flush();
  store.dispatch(reset());
  await storage.removeItem('persist:root');
};

export default store;
