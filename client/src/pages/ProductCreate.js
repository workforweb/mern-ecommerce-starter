import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct } from '../features/productSlice';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// import Spinner from '../components/Spinner';

export default function ProductCreate() {
  const { loading, message, isError } = useSelector((state) => state.products);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const [image, setImage] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);

    Array.from(image).forEach((item) => {
      formData.append('images', item);
    });

    //    Object.values(image).forEach(file=>{
    //      formData.append("images", file);
    //    });

    dispatch(createProduct(formData))
      .unwrap()
      .then((res) => {
        // console.log('response', res);
        if (res.success === true) {
          navigate('/');
          setTimeout(() => toast.success(res.message), 1000);
        }
      });
  };

  useEffect(() => {
    if (isError) {
      console.log('Message', message);
      Array.isArray(message)
        ? message.forEach((el) =>
            toast.error(el, {
              position: 'top-right',
            })
          )
        : message === 'Unexpected field'
        ? toast.error('Only 2 images can upload!')
        : toast.error(message, {
            position: 'top-right',
          });
    }
  }, [dispatch, isError, message, loading]);

  // if (loading) {
  //   return <Spinner />;
  // }

  return (
    <Row>
      <Col>
        <Form onSubmit={handleSubmit} className="mx-5 my-5">
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicFile">
            <Form.Label>Images</Form.Label>
            <Form.Control
              type="file"
              placeholder="Image"
              accept="image/*"
              multiple
              onChange={(e) => setImage(e.target.files)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            Submit
          </Button>
        </Form>
      </Col>
      <Col>
        <Row>
          {Array.from(image).map((item, index) => {
            return (
              <Col key={index} className="mt-5">
                <div className="card cardBorder shadow">
                  <div className="card-body">
                    <img
                      width={150}
                      height={150}
                      src={item ? URL.createObjectURL(item) : null}
                      alt="product"
                    />
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
}
