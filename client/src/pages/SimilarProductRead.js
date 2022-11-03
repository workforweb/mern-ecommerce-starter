import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSimilarProducts } from '../features/productSlice';

// import { useParams } from 'react-router-dom';

import Spinner from '../components/Spinner';

export default function SimilarProductsRead({ id }) {
  const { loading, similarProduct, similarProducts } = useSelector(
    (state) => state.products
  );

  // const { id } = useParams();
  const dispatch = useDispatch();

  // Getting Student
  useEffect(() => {
    dispatch(getSimilarProducts({ id }));
  }, [dispatch, id]);

  if (loading) {
    return <Spinner />;
  }

  console.log('similarProduct', similarProduct);
  console.log('similarProducts', similarProducts);

  return (
    <div className="row">
      <div className="col-md-6 mt-4">
        {similarProduct.images.map((image) => (
          <img className="img-fluid mx-3" src={image} alt={id} />
        ))}
      </div>
      <div className="col-md-6">
        <h3 className="my-3">{similarProduct?.name}</h3>
        <h4>{similarProduct?.description}</h4>
        <h5 className="my-3">{similarProduct?.price}</h5>
        <h6 className="my-4">{similarProduct?.category}</h6>
      </div>
    </div>
  );
}
