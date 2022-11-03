import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { getAdminOrders, patchShippedOrder } from '../features/orderSlice';
import { Badge, Button, Spinner } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

export default function AdminOrderTable() {
  const { orders, loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAdminOrders())
      .unwrap()
      .then((res) => {
        if (res.status === 200) navigate('/product');
      });
  }, [dispatch, navigate]);

  if (loading) {
    return <Spinner />;
  }

  if (orders.length === 0) {
    return (
      <Alert variant="info" className="align-center mt-4">
        No orders yet
      </Alert>
    );
  }

  return (
    <div className="mt-4">
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Images</th>
            <th>Order id</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Count</th>
            <th>Total</th>
            <th>Status</th>
            <th>View order</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((order) => (
              <tr key={order._id}>
                <td className="d-flex">
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
                <td>{order.owner?.name}</td>
                <td>
                  {order.customerDetails.address}, {order.customerDetails.city}
                </td>
                <td>{order.products?.length}</td>
                <td>{order.totalBill}</td>
                <td>
                  {order.status === 'pending' ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        dispatch(
                          patchShippedOrder({
                            orderId: order._id,
                            userId: order.owner?.id,
                          })
                        )
                      }
                    >
                      Pending
                    </Button>
                  ) : (
                    <Badge bg="success">Shipped</Badge>
                  )}
                </td>
                <td>
                  <span
                    className="cursor-pointer"
                    // onClick={() => showOrder(products)}
                  >
                    Order <i className="fa fa-eye"></i>
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
