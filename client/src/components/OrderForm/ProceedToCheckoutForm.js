import { Button, Col, Form, Row } from 'react-bootstrap';

const ProceedToCheckoutForm = ({
  user,
  value,
  errors,
  onChange,
  onSubmit,
  disabled,
  onClick,
}) => {
  return (
    <Form onSubmit={onSubmit} noValidate>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={user.name}
              disabled
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Email"
              value={user.email}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              placeholder="Address"
              value={value.address}
              onChange={onChange}
              required
              className={`input ${errors.address && 'is-danger'}`}
            />
            {errors?.address && (
              <p className="form-text help is-danger">{errors.address}</p>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              placeholder="City"
              value={value.city}
              onChange={onChange}
              required
              className={`input ${errors.city && 'is-danger'}`}
            />
            {errors?.city && (
              <p className="form-text help is-danger">{errors.city}</p>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              placeholder="State"
              value={value.state}
              onChange={onChange}
              required
              className={`input ${errors.state && 'is-danger'}`}
            />
            {errors?.state && (
              <p className="form-text help is-danger">{errors.state}</p>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Pincode</Form.Label>
            <Form.Control
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={value.pincode}
              onChange={onChange}
              required
              className={`input ${errors.pincode && 'is-danger'}`}
            />
            {errors?.pincode && (
              <p className="form-text help is-danger">{errors.pincode}</p>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={value.phone}
              onChange={onChange}
              required
              className={`input ${errors.phone && 'is-danger'}`}
            />
            {errors?.phone && (
              <p className="form-text help is-danger">{errors.phone}</p>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              placeholder="Country"
              value={value.country}
              onChange={onChange}
              required
              className={`input ${errors.country && 'is-danger'}`}
            />
            {errors?.country && (
              <p className="form-text help is-danger">{errors.country}</p>
            )}
          </Form.Group>
        </Col>
        <Form.Group className="mb-3">
          <Button
            className="mt-3 me-3"
            variant="info"
            type="submit"
            disabled={disabled}
            onClick={onClick}
          >
            Proceed to checkout
          </Button>
        </Form.Group>
      </Row>
    </Form>
  );
};

export default ProceedToCheckoutForm;
