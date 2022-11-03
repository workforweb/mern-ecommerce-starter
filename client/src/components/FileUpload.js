import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from '../helpers/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const { isLoading } = useSelector((state) => state.auth);
  const [file, setFile] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('avatar', file);

    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    axios
      .post(
        'http://localhost:4000/api/v1/auth/set-profile-image',
        formData,
        config
      )
      .then((res) => {
        // console.log('response', res);
        if (res.statusText === 'OK') {
          setTimeout(() => toast.success(res.data.message), 1000);
          navigate('/');
        }
      })
      .catch((err) => {
        // console.log('Error', err);
        toast.error(err.response.data.error);
      });
  };

  const handleChange = (e) => {
    // console.log('files', e.target.files);
    setFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <Row>
      <Col>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicFile">
            <Form.Label>
              <b>Set profile image</b>
            </Form.Label>
            <Form.Control
              type="file"
              placeholder="Image"
              accept="image/*"
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isLoading}>
            Submit
          </Button>
        </Form>
      </Col>
      <Col>
        {image && (
          <div className="card border mx-auto shadow">
            <div className="card-body">
              <img
                className="img-fluid"
                src={image}
                alt="profile img"
                width="307"
                height="240"
              />
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default FileUpload;
