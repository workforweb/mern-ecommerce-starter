import { Button, Col, Row, Table } from 'react-bootstrap';

export default function OrderTable({ data, onClick }) {
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Cart total</th>
            <th>Tax price</th>
            <th>Shipping charge</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{data.bill}</td>
            <td>{data.taxPrice}</td>
            <td>{data.shippingCharges}</td>
          </tr>
        </tbody>
      </Table>
      <Row className="align-items-center">
        <Col md={4} className="align-right fw-bold text-dark">
          Bill (total amount)
        </Col>
        <Col md={4} className="align-right fw-bold pe-3">
          ₹ {data.totalBill}
        </Col>
        <Col md={4} className="align-right fw-bold pe-3">
          <Button variant="danger" onClick={onClick}>
            Delete order
          </Button>
        </Col>
      </Row>
    </>
  );
}
