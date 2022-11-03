import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, reset } from '../features/authSlice';
import { toast } from 'react-toastify';

import Spinner from '../components/Spinner';

export default function Register() {
  const [formState, setFormState] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const { isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => toast.success('Register success'), 0);
      navigate('/');
    }

    if (isError) {
      dispatch(reset());
      Array.isArray(message)
        ? message.forEach((el) =>
            toast.error(el, {
              position: 'top-right',
            })
          )
        : toast.error(message, {
            position: 'top-right',
          });
    }
  }, [dispatch, isError, navigate, isSuccess, message, isLoading]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page-login">
      <form className="login-form">
        <div className="form-group mb-2">
          <label htmlFor="name">name:</label>
          <input
            id="name"
            name="name"
            required
            size="32"
            value={formState.name}
            onChange={handleFormStateChange}
            className="form-control"
          />
        </div>
        <div className="form-group mb-2">
          <label htmlFor="username">username:</label>
          <input
            id="username"
            name="username"
            required
            size="32"
            value={formState.username}
            onChange={handleFormStateChange}
            className="form-control"
          />
        </div>
        <div className="form-group mb-2">
          <label htmlFor="email">email:</label>
          <input
            id="email"
            name="email"
            required
            size="32"
            value={formState.email}
            onChange={handleFormStateChange}
            className="form-control"
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            size="32"
            value={formState.password}
            onChange={handleFormStateChange}
            className="form-control"
          />
        </div>

        <button className="btn btn-primary btn-block" onClick={handleOnClick}>
          Register
        </button>
        <p className="pt-3 text-center">
          Don't have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );

  function handleFormStateChange(event) {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  }

  async function handleOnClick(event) {
    event.preventDefault();
    if (isError) {
      return;
    }
    !message && dispatch(registerUser(formState));
  }
}
