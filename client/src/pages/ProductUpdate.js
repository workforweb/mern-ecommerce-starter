import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';
import {
  updateProduct,
  getProduct,
  clearProduct,
} from '../features/productSlice';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function ProductUpdate() {
  const { loading, message, isError } = useSelector((state) => state.products);

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const dispatch = useDispatch();
  const { id } = useParams();

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const [image, setImage] = useState([]);

  // Getting Product
  useEffect(() => {
    dispatch(getProduct({ id }))
      .then((response) => {
        console.log('RESPO', response);
        const { name, description, price, category, images } =
          response?.payload?.findProductById;
        setName(name);
        setDescription(description);
        setPrice(price);
        setCategory(category);
        setImage(images);
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

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

    dispatch(updateProduct({ id, formData }))
      .unwrap()
      .then((res) => {
        if (res.success === true) {
          setTimeout(() => toast.success(res.message), 1000);
          dispatch(getProduct({ id }));
          navigate('/');
        }
      });
  };

  useEffect(() => {
    if (isError) {
      //! clear comment below on trial run
      //   console.log('Message', message);
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

  if (loading) {
    return <Spinner />;
  }

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

          <Form.Group className="parent" controlId="formBasicFile">
            <Form.Label>
              <Button
                variant="primary"
                className="btn-upload"
                onClick={handleClick}
              >
                Upload Image
              </Button>
            </Form.Label>
            <Form.Control
              className="file-crtl"
              type="file"
              placeholder="Image"
              accept="image/*"
              multiple
              onChange={(e) => setImage(e.target.files)}
              style={{ display: 'none' }}
              ref={hiddenFileInput}
            />
          </Form.Group>

          <Button
            variant="primary"
            className="d-flex"
            type="submit"
            disabled={loading}
          >
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
                      src={item?.name ? URL.createObjectURL(item) : item}
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

/* <input
  accept="image/*"
  onChange={onImageChange}
  className={classes.inputImage}
  id="contained-button-file"
  multiple
  name="image"
  type="file"
/>;

const onImageChange = (event) => {
  if (event.target.files && event.target.files[0]) {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      setData({
        ...mydata,
        imagePreview: reader.result,
        file: file,
      });
    };
    reader.readAsDataURL(file);
  }
}; 
*/

/*
import React from 'react';

const Multiple = () => {
    
    const upload = async (e) => {
        
        // Convert the FileList into an array and iterate
        let files = Array.from(e.target.files).map(file => {
            
            // Define a new file reader
            let reader = new FileReader();
            
            // Create a new promise
            return new Promise(resolve => {
                
                // Resolve the promise after reading file
                reader.onload = () => resolve(reader.result);
                
                // Reade the file as a text
                reader.readAsText(file);
                
            });
            
        });
        
        // At this point you'll have an array of results
        let res = await Promise.all(files);
        
    }
    
    return(
        <input onChange = {upload} type = 'file' multiple/>
    );
    
}

export default Multiple; */

// function isValidImageURL(str) {
//   if (typeof str !== 'string') return false;
//   return !!str.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi);
// }
