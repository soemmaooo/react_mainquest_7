import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import useMessage from '../hooks/useMessage';

const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;

export default function ProductDetail() {
  const { id } = useParams();
  const [singleProductData, setSingleProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useMessage();

  const getSingleProduct = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/product/${id}`,
      );
      setSingleProductData(res.data.product);
      // console.log(res.data.product);
    } catch (err) {
      showError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  const addProduct = async () => {
    try {
      setIsLoading(true);
      const data = {
        data: {
          product_id: id,
          qty: 1,
        },
      };
      const res = await axios.post(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/cart`,
        data,
      );

      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response.data.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}

      <div className="product-detail-page">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <NavLink className="text-decoration-none text-muted" to="/">
              首頁
            </NavLink>
          </li>
          <li className="breadcrumb-item">
            <NavLink className="text-decoration-none text-muted" to="/products">
              商品列表
            </NavLink>
          </li>
          <li className="breadcrumb-item text-dark">
            {singleProductData.title}
          </li>
        </ol>
        <div className="row productD-content">
          <div className="col-4">
            <img src={singleProductData.imageUrl} alt="" />
          </div>

          <div className="col-6 ">
            <h3 className="h3 mb-3 fw-light">{singleProductData.title}</h3>
            <p className="h4 mb-3">{`$${singleProductData.price}`}</p>
            <p>商品說明：</p>
            <p className="mb-5">{singleProductData.description}</p>
            <button
              className="btn btn-lg btn-primary d-block ms-auto"
              type="button"
              onClick={addProduct}
            >
              加入購物車<i className="bi bi-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
