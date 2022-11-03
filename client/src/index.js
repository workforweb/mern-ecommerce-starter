import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CustomRouter } from './helpers/customRouter';
import { Provider } from 'react-redux';
import store from './app/store';
import customHistory from './helpers/history';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './app/store';
import Spinner from './components/Spinner';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <CustomRouter history={customHistory}>
          <App />
        </CustomRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
