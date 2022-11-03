import { Badge, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function ProductPreview({
  _id,
  category,
  name,
  images,
  price,
  onDelete,
  onClick,
  handleChange,
  disabled,
}) {
  const { user } = useSelector((state) => state.user);

  return (
    <Div className="relative">
      {user?.role === 'admin' && (
        <Div>
          <Link
            to={`product/${_id}`}
            className="tag-close-icon"
            onClick={onDelete}
          >
            X
          </Link>

          <Link to={`/product/${_id}/update`} className="update-btn">
            U
          </Link>
        </Div>
      )}

      {user && user?.role !== 'admin' && (
        <Form.Group
          className="btn-group btn-group-sm btn-group-product"
          onChange={handleChange}
        >
          <Form.Select style={{ width: '40%', borderRadius: 0 }}>
            <option defaultValue="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Form.Select>
          <Button
            className="addToCartBtn"
            style={{ borderRadius: 0 }}
            onClick={onClick}
            disabled={disabled}
          >
            Add to cart
          </Button>
        </Form.Group>
      )}

      <Link to={`/product/${_id}/read`} className="ml-5 relative">
        <Card>
          <Card.Img
            variant="top"
            className="product-preview-img"
            src={images[0]}
          />
          <Card.Body>
            <Card.Title>{capitalize(name)}</Card.Title>
            <Div>
              <Badge bg="warning" text="dark" className="float-left">
                {category}
              </Badge>
              <Badge bg="warning" text="dark" className="float-right">
                ₹ {price}
              </Badge>
            </Div>
          </Card.Body>
        </Card>
      </Link>
    </Div>
  );
}

export default ProductPreview;

const Div = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};
