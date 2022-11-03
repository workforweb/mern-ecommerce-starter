import { Alert, Col, Container, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { expandCart, reduceCart, clearCart } from '../features/cartSlice';
import OrderForm from '../components/OrderForm';
import Spinner from '../components/Spinner';

export default function Cart() {
  const { user } = useSelector((state) => state.user);
  const { loading, cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleDecrease(product) {
    dispatch(reduceCart(product))
      .unwrap()
      .then(() => {
        navigate('/cart');
      });
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container style={{ minHeight: '95vh' }} className="cart-container">
      <Row>
        <Col>
          <h1 className="pt-2 h3">Shopping cart</h1>
          {cart?.products?.length === 0 ? (
            <Alert variant="info">
              Shopping cart is empty. Add products to your cart
            </Alert>
          ) : (
            <OrderForm />
          )}
        </Col>
        {cart?.products?.length > 0 && (
          <Col md={5}>
            <>
              <Table responsive="sm" className="cart-table">
                <thead>
                  <tr>
                    <th>&nbsp;</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {/* loop through cart products */}
                  {cart?.products?.map((item) => (
                    <tr key={item._id}>
                      <td>&nbsp;</td>
                      {/* {console.log('itemInCart', item)} */}
                      <td>
                        {!loading && (
                          <i
                            className="fa fa-times"
                            style={{ marginRight: 10, cursor: 'pointer' }}
                            onClick={() =>
                              dispatch(
                                clearCart({
                                  productId: item.productId,
                                  userId: cart.owner,
                                })
                              )
                            }
                          ></i>
                        )}

                        <img
                          src={item.image}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                          }}
                          alt={item._id}
                        />
                      </td>
                      <td>₹{item.price}</td>
                      <td>
                        <span className="quantity-indicator">
                          <i
                            className="fa fa-minus-circle"
                            onClick={() => {
                              if (item.quantity === 1) {
                                dispatch(
                                  clearCart({
                                    productId: item.productId,
                                    userId: cart.owner,
                                  })
                                );
                                return;
                              }
                              handleDecrease({
                                productId: item.productId,
                                quantity: item.quantity - 1,
                                userId: user.id,
                              });
                            }}
                          ></i>
                          <span>{item.quantity}</span>
                          <i
                            className="fa fa-plus-circle"
                            onClick={() =>
                              dispatch(
                                expandCart({
                                  productId: item.productId,
                                  quantity: item.quantity + 1,
                                  userId: cart.owner,
                                })
                              )
                                .unwrap()
                                .then(() => {
                                  navigate('/cart');
                                })
                            }
                          ></i>
                        </span>
                      </td>
                      <td>₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <h3 className="h4 pt-4">Cart total: ₹{cart.bill}</h3>
              </div>
            </>
          </Col>
        )}
      </Row>
    </Container>
  );
}
