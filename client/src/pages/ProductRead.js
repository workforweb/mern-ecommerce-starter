import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  // getProduct,
  clearProduct,
  getSimilarProducts,
} from '../features/productSlice';
import { Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function ProductsRead() {
  const { loading, similarProduct, similarProducts } = useSelector(
    (state) => state.products
  );
  // const product = useSelector(
  //   (state) => state.products?.product?.findProductById
  // );

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Getting Student
  useEffect(() => {
    // dispatch(getProduct({ id }))
    //   .unwrap()
    //   .then(() => dispatch(getSimilarProducts({ id })));
    dispatch(getSimilarProducts({ id }));

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  // useEffect(() => {
  //   dispatch(getSimilarProducts({ id }));
  // }, [dispatch, id]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {/* <div className="row">
        <div className="col-md-6 mt-4">
          <img className="img-fluid mx-3" src={product?.images[0]} alt={id} />
          <img className="img-fluid" src={product?.images[1]} alt={id} />
        </div>
        <div className="col-md-6">
          <h3 className="my-3">{product?.name}</h3>
          <h4>{product?.description}</h4>
          <h5 className="my-3">{product?.price}</h5>
          <h6 className="my-4">{product?.category}</h6>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </div> */}

      <div className="row">
        <div className="col-md-6 mt-4">
          {similarProduct?.images?.map((image, i) => (
            <img
              className="img-fluid mx-3 rounded"
              src={image}
              alt={id}
              key={i}
            />
          ))}
        </div>
        <div className="col-md-6  mt-4">
          <h3 className="product-title">{similarProduct?.name}</h3>
          <span className="product-title">{similarProduct?.description}</span>

          <div className="price">
            ₹ <span>{similarProduct?.price}</span>
          </div>
          <div className="description">
            <h4>{similarProduct?.category}</h4>
          </div>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go back
          </Button>
        </div>
      </div>

      <div className="mt-5 holder">
        <div className="text-center text-dark fw-bold fs-1 text-decoration-underline mb-4">
          Similar Products
        </div>
        <div className="box">
          {similarProducts.map((product) => (
            <Link
              to={`/product/${product._id}/read`}
              className="column-2"
              key={product._id}
            >
              <div className="card">
                <div className="box">
                  {product.images?.map((image, i) => (
                    <div className="column-2" key={i}>
                      <img className="card-img-top" src={image} alt={id} />
                    </div>
                  ))}
                </div>
                <div className="card-body d-flex justify-content-around">
                  <div className="badge bg-primary">{product.name}</div>
                  <div className="badge bg-primary">{product.category}</div>
                  <div className="badge bg-primary">{product.description}</div>
                  <div className="badge bg-primary">
                    ₹ <span>{product.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
