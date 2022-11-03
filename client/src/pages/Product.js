import { useSelector } from 'react-redux';
import { useState } from 'react';
import ProductCreate from './ProductCreate';
import ModalComponent from '../components/ModalComponent';
import AdminOrderTable from '../components/AdminOrderTable';

const Product = () => {
  const [productCreateModalShow, setProductCreateModalShow] = useState(false);
  const [adminOrderTableModalShow, setAdminOrderTableModalShow] =
    useState(false);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="align-right">
      {user?.role === 'admin' && (
        <>
          <ModalComponent
            show={productCreateModalShow}
            onHide={() => setProductCreateModalShow(false)}
            buttontitle="Create new product"
            title="Create new product"
            component={<ProductCreate />}
            btnclass="mt-5"
            onShow={() => setProductCreateModalShow(true)}
          />
          <ModalComponent
            show={adminOrderTableModalShow}
            onHide={() => setAdminOrderTableModalShow(false)}
            buttontitle="Admin Order Table"
            title="Admin Order Table"
            component={<AdminOrderTable />}
            btnclass="mt-5 mx-2"
            onShow={() => setAdminOrderTableModalShow(true)}
          />
        </>
      )}
    </div>
  );
};

export default Product;
