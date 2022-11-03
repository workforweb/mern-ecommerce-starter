import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser, reset } from '../features/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

export default function Login() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const { isError, message, isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleFormStateChange(event) {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  }

  function handleOnClick(event) {
    event.preventDefault();
    dispatch(loginUser(formState))
      .unwrap()
      .then(() => {
        navigate('/');
        setTimeout(() => toast.success('Logged in success'), 1000);
      });
  }

  useEffect(() => {
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
  }, [dispatch, isError, message, isLoading]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="page-login">
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email" style={{ display: 'block' }}>
            email:
          </label>
          <input
            id="email"
            name="email"
            required
            size="32"
            value={formState.email}
            onChange={handleFormStateChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" style={{ display: 'block' }}>
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            size="32"
            value={formState.password}
            onChange={handleFormStateChange}
          />
        </div>

        <button
          className="btn btn-primary btn-block mt-3"
          onClick={handleOnClick}
        >
          Login
        </button>
        <p className="pt-3 text-center">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
}
