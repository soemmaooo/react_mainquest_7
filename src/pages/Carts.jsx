import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useMessage from '../hooks/useMessage';

const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;

export default function Carts() {
  const navigate = useNavigate();

  const [cartsData, setCartsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useMessage();

  const getCarts = async () => {
    try {
      const res = await axios.get(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/cart`,
      );
      setCartsData(res.data.data.carts);
    } catch (err) {
      showError(err.response.data.message);
    }
  };

  useEffect(() => {
    getCarts();
  }, []);

  const finalTotal = cartsData.reduce((acc, curr) => acc + curr.final_total, 0);

  const updateCartItem = async (cartId, productId, qty) => {
    try {
      if (qty < 1) return;
      const data = {
        data: {
          product_id: productId,
          qty: qty,
        },
      };
      setIsLoading(true);
      const res = await axios.put(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/cart/${cartId}`,
        data,
      );
      getCarts();
      showSuccess(res.data.message);
    } catch (err) {
      showError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCartItem = async (cartId) => {
    try {
      setIsLoading(true);
      const res = await axios.delete(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/cart/${cartId}`,
      );
      showSuccess(res.data.message);
      getCarts();
    } catch (err) {
      showError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAllCarts = async () => {
    if (!window.confirm('確定要清空購物車嗎？')) return;
    setIsLoading(true);

    try {
      const res = await axios.delete(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/carts`,
      );
      showSuccess(res.data.message);
      getCarts();
    } catch (err) {
      showError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}

      <h1 className="py-5 fw-light">購物車</h1>
      <div className="row">
        <div className="col-9">
          <div className="main-border px-3 h-100">
            {cartsData.length !== 0 ? (
              <table className="table cart-table">
                <thead>
                  <tr>
                    {cartsData.length !== 0 ? (
                      <>
                        <th scope="col"></th>
                        <th scope="col">商品名稱</th>
                        <th scope="col">數量</th>
                        <th scope="col">價格</th>
                        <th scope="col">總計</th>
                        <th scope="col">
                          {' '}
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              if (window.confirm('確定要刪除全部商品嗎？')) {
                                removeAllCarts();
                              }
                            }}
                          >
                            刪除全部
                          </button>
                        </th>
                      </>
                    ) : (
                      ''
                    )}
                  </tr>
                </thead>
                <tbody>
                  {cartsData.map((cart) => {
                    return (
                      <tr key={cart.id}>
                        <td width="150">
                          <img
                            src={cart.product.imageUrl}
                            alt={cart.product.title}
                            style={{
                              height: '86px',
                              width: '86px',
                              objectFit: 'cover',
                              borderRadius: '16px',
                            }}
                          />
                        </td>
                        <td>{cart.product.title}</td>
                        <td>
                          <div
                            className="input-group input-group-sm mx-auto"
                            style={{ width: '100px' }}
                          >
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() =>
                                updateCartItem(
                                  cart.id,
                                  cart.product_id,
                                  cart.qty - 1,
                                )
                              }
                              disabled={cart.qty <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>

                            <input
                              className="form-control text-center bg-white border-secondary"
                              type="text"
                              value={cart.qty}
                              readOnly
                            />

                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() =>
                                updateCartItem(
                                  cart.id,
                                  cart.product_id,
                                  cart.qty + 1,
                                )
                              }
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td>{`$${cart.product.price}`}</td>
                        <td>{`$${cart.final_total}`}</td>

                        <td>
                          <button
                            type="button"
                            className="btn"
                            onClick={() => {
                              if (window.confirm('確定要刪除這項商品嗎？')) {
                                removeCartItem(cart.id);
                              }
                            }}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <>
                <div className="text-center fs-4 pt-5">購物車目前是空的</div>
              </>
            )}
          </div>
        </div>
        <div className="col-3">
          <div className="main-border p-3">
            <h3 className="p-3 mb-0 border-bottom border-primary">購物詳情</h3>
            <div className="d-flex justify-content-between py-3">
              <p>小計</p>
              <p className="fw-bold">${finalTotal.toLocaleString()}</p>
            </div>
            <div className="d-flex justify-content-between py-3">
              <p>運費</p>
              <p>$120</p>
            </div>
            <div className="d-flex justify-content-between py-3">
              <p>總計</p>
              <p className="fw-bold">${[finalTotal + 120].toLocaleString()}</p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg w-100"
              disabled={cartsData.length <= 0}
              onClick={() => navigate('/checkout')}
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
