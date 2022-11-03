import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from 'react-js-pagination';
// import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

import {
  getProducts,
  deleteProduct,
  getCategories,
} from '../features/productSlice';
import { addToCart } from '../features/cartSlice';
import Spinner from '../components/Spinner';
import ProductPreview from '../components/ProductPreview';
import SelectInput from '../components/SelectInput';
import SearchInput from '../components/SearchInput';

export default function ProductsReadAll() {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { loading, products, productsCount, categories, resultPerPage } =
    useSelector((state) => state.products);

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [quantity, setQuantity] = useState(1);

  // const { currentPage, category, sort, keyword, price } = products;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProducts({ page, category, sort, search, keyword }));
    // .unwrap()
    // .then((res) => console.log('res', res));
  }, [dispatch, page, category, sort, search, keyword]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tour ?')) {
      dispatch(deleteProduct({ id }))
        .unwrap()
        .then(() => {
          // .then((response) => {
          // setTimeout(() => toast.success(response.message), 1000);
          navigate('/');
        });
    }
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setPage(1);
    setSort('');
    setSearch('');
    setKeyword('');
  };

  const handlePagination = (e) => {
    setPage(e);
    setCategory('');
    setSort('');
    setSearch('');
    setKeyword('');
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    setCategory('');
    setPage(1);
    setSearch('');
    setKeyword('');
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    setSort('');
    setCategory('');
    setPage(1);
    setKeyword('');
  };

  const handleKeyword = (e) => {
    setKeyword(e.target.value.toLowerCase());
    setSort('');
    setCategory('');
    setPage(1);
    setSearch('');
  };

  if (loading) {
    return <Spinner />;
  }

  // const lastProducts = products.slice(0, 8);

  return (
    <div>
      <h2 className="d-flex justify-content-center flex-wrap flex-gap mb-4">
        All Products ({productsCount})
      </h2>
      <div className="d-flex justify-content-center flex-wrap flex-gap mb-4">
        <SelectInput
          label="Categories"
          options={categories}
          value={category}
          onChange={handleCategory}
        />

        <SearchInput
          value={search}
          placeholder={'Search product'}
          onChange={handleSearch}
          onMouseEnter={(e) => e.target.focus()}
        />

        <SearchInput
          value={keyword}
          placeholder={'Search description'}
          onChange={handleKeyword}
          onMouseEnter={(e) => e.target.focus()}
        />

        <div className="sort">
          <span>Sort By: </span>
          <Form.Select value={sort} onChange={handleSort}>
            <option value="">Newest</option>
            <option value="sort=oldest">Oldest</option>
            <option value="sort=-sold">Best sales</option>
            <option value="sort=-price">Price: Hight-Low</option>
            <option value="sort=price">Price: Low-Hight</option>
          </Form.Select>
        </div>

        <Pagination
          activePage={Number(page)}
          itemsCountPerPage={Number(resultPerPage)}
          totalItemsCount={Number(productsCount)}
          onChange={handlePagination}
          nextPageText="Next"
          prevPageText="Prev"
          firstPageText="1st"
          lastPageText="Last"
          itemClass="page-item"
          linkClass="page-link"
          activeClass="pageItemActive"
          activeLinkClass="pageLinkActive"
        />
      </div>
      <div className="d-flex justify-content-center flex-wrap flex-gap">
        {/* {lastProducts.map((product) => ( */}
        {products?.map((product) => (
          <ProductPreview
            key={product._id}
            onDelete={() => handleDelete(product._id)}
            onClick={() =>
              dispatch(
                addToCart({
                  userId: user.id,
                  productId: product._id,
                  quantity,
                })
              )
                .unwrap()
                .then(() => {
                  // setTimeout(() => toast.success('Added to cart'), 1000);
                  navigate('/');
                })
            }
            handleChange={(e) => setQuantity(e.target.value)}
            disabled={cart?.products?.some((p) => p.productId === product._id)}
            {...product}
          />
        ))}
      </div>
    </div>
  );
}
