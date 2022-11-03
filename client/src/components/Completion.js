import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Table from 'react-bootstrap/Table';
import { getUserOrders } from '../features/orderSlice';
import { Badge, Spinner } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

function Completion() {
  const { user } = useSelector((state) => state.user);
  const { orders, loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders({ userId: user.id }));
  }, [dispatch, user.id]);

  if (loading) {
    return <Spinner />;
  }

  if (orders.length === 0) {
    return <Alert variant="info">No orders yet</Alert>;
  }

  return (
    <div className="pt-3">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Images</th>
            <th>Order id</th>
            <th>Total bill</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {order.products.map((product) => (
                    <img
                      key={product._id}
                      src={product.image}
                      width="50"
                      alt={product.productId}
                      className="mx-1"
                    />
                  ))}
                </td>
                <td>{order._id}</td>
                <td>{order.totalBill}</td>
                <td>
                  {order.status === 'pending' ? (
                    <Badge bg="info">Pending</Badge>
                  ) : (
                    <Badge bg="success">Shipped</Badge>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Completion;
