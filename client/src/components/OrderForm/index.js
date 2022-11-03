import { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { newOrder, deleteOrder } from '../../features/orderSlice';
import validateForm from './OrderFormValidation';
import ProceedToCheckoutForm from './ProceedToCheckoutForm';
import OrderTable from './OrderTable';
import Payment from '../Payment';

export default function OrderForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.order);

  const [show, setShow] = useState(true);
  const [errors, setError] = useState({});

  const [value, setValue] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    phone: '',
  });

  useEffect(() => {
    validateForm(value);
  }, [value]);

  const handleChange = (event) => {
    setValue({ ...value, [event.target.name]: event.target.value });
    let allErrors = errors;
    delete allErrors[event.target.name];
    setError(allErrors);
    event.preventDefault();
  };

  // new "Order" stored in session storage
  const newOrderReceived = window.sessionStorage.getItem('order');
  let newOrderRec = JSON.parse(newOrderReceived);

  const removeOrder = () => {
    dispatch(deleteOrder({ orderId: newOrderRec?._id }))
      .unwrap()
      .then((res) => {
        if (res.success === true) {
          setShow(true);
          window.sessionStorage.removeItem('order');
          navigate('/');
          navigate(-1);
        }
      });
  };

  // const { address, city, state, country, pincode, phone } = value;

  const createOrder = (e) => {
    e.preventDefault();

    let errorsObj = validateForm(value);
    // console.log('errorsObj', errorsObj);
    setError(errorsObj);

    if (Object.keys(errorsObj).length === 0) {
      setError({});
    }

    dispatch(
      newOrder({
        userId: cart?.owner,
        customerDetails: value,
      })
    )
      .unwrap()
      .then((res) => {
        console.log('Response from order form', res);
        if (show && Object.keys(errors) <= 0) {
          setInterval(() => {
            setShow(false);
          }, 100);
        }
      });
  };

  useEffect(() => {
    if (newOrderRec && Object.keys(newOrderRec).length > 0) {
      setShow(false);
    }
  }, [newOrderRec]);

  return cart?.products?.length > 0 ? (
    <Col className="container">
      {show && (
        <ProceedToCheckoutForm
          user={user}
          value={user}
          errors={errors}
          onChange={handleChange}
          onSubmit={createOrder}
          disabled={loading}
          onClick={() => {
            if (Object.keys(errors) > 0) {
              setShow(true);
              return;
            }
          }}
        />
      )}

      {newOrderRec && newOrderRec?.products?.length > 0 && (
        <>
          {console.log('New Order from checkout form', newOrderRec)}
          <hr />
          <OrderTable data={newOrderRec} onClick={() => removeOrder()} />
          <hr />
          <Row className="align-items-center my-4">
            <Payment amount={newOrderRec} />
          </Row>
        </>
      )}
    </Col>
  ) : (
    navigate('/')
  );
}
