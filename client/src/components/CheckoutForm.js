import { PaymentElement } from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Alert, Button, Col, Form, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteCart } from '../features/orderSlice';

export default function CheckoutForm() {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/completion`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Delete cart after successful payment and go to home

      await dispatch(deleteCart({ userId: cart?.owner }))
        .unwrap()
        .then((res) => {
          if (res.success === true) {
            window.sessionStorage.removeItem('order');
            navigate('/completion', { replace: true });
            window.location.reload(false);
          }
        });
      setMessage(`Payment status: ${paymentIntent.status} ✅`);
    } else {
      setMessage('An unexpected error occured.');
    }

    setIsProcessing(false);
  };

  return cart ? (
    <Col>
      <Card bg="light" text="dark">
        <Card.Header>
          Proceed to checkout (fill the card details below to confirm order)
        </Card.Header>
        <Card.Body className="check-card-body">
          <Form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <Button
              disabled={isProcessing || !stripe || !elements}
              id="submit"
              className="my-3"
              type="submit"
            >
              {isProcessing ? 'Processing ... ' : 'Pay now'}
            </Button>
            {/* Show any error or success messages */}
            {message && <Alert id="payment-message">{message}</Alert>}
          </Form>
        </Card.Body>
      </Card>
    </Col>
  ) : (
    <Col>Payment Successful</Col>
  );
}
