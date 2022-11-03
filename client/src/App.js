import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import './App.css';
import './bootstrap.min.css';
import Layout from './components/Layout';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Product from './pages/Product';
import ProductRead from './pages/ProductRead';
import ProductUpdate from './pages/ProductUpdate';
import ProductsReadAll from './pages/ProductsReadAll';
import Cart from './pages/Cart';
import Completion from './components/Completion';

import { meUser, refreshToken } from './features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';
import { addNotification } from './features/userSlice';

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(meUser());
  }, [dispatch, isLoggedIn, location.key]);

  useEffect(() => {
    // initial fetch
    const fetchRefreshToken = async () => dispatch(refreshToken());

    fetchRefreshToken();
    // fetch after 1 minute less then 500 (server access token expiry)
    const interval = setInterval(() => {
      console.log('fetchRefreshToken');
      isLoggedIn && fetchRefreshToken();
    }, 59000);

    return () => clearInterval(interval);
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const socket = io('ws://localhost:4000');
    // console.log('Socket', socket);
    const Id = user?.id;
    const Role = user?.role;

    socket.off('notification').on('notification', (msgObj, userId) => {
      // logic for notification
      if (user && userId === Id) {
        dispatch(addNotification(msgObj));
      }
    });

    socket.off('new-order').on('new-order', (msgObj) => {
      if (user && Role === 'admin') {
        dispatch(addNotification(msgObj));
      }
    });
  }, [dispatch, user]);

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route element={<Layout />}>
          {user && <Route index element={<Home />} />}
          {user && (
            <Route
              path="home"
              element={
                <PrivateRoute isAllowed={!!user}>
                  <Home />
                </PrivateRoute>
              }
            />
          )}
          {user && (
            <Route
              path="profile"
              element={
                <PrivateRoute isAllowed={!!user}>
                  <Profile />
                </PrivateRoute>
              }
            />
          )}

          <Route path="product">
            {user?.role === 'admin' && (
              <Route
                index
                element={
                  <PrivateRoute isAllowed={!!user}>
                    <Product />
                  </PrivateRoute>
                }
              />
            )}
            <Route path=":id/list" element={<ProductsReadAll />} />
            <Route path=":id/read" element={<ProductRead />} />
            {user?.role === 'admin' && (
              <Route
                path=":id/update"
                element={
                  <PrivateRoute isAllowed={!!user}>
                    <ProductUpdate />
                  </PrivateRoute>
                }
              />
            )}
          </Route>

          {user && user.role !== 'admin' && (
            <>
              <Route path="/cart" element={<Cart />} />
              <Route path="/completion" element={<Completion />} />
            </>
          )}
          {/* <Route path="/orders" element={<OrdersPage />} /> */}
          {!user && <Route path="/login" element={<Login />} />}
          {!user && <Route path="/register" element={<Register />} />}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

const PrivateRoute = ({ isAllowed, redirectPath = '/login', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
