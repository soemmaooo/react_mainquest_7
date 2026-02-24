import { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useMessage from '../hooks/useMessage';

const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;

export default function Checkout() {
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();
  const { showError, showSuccess } = useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      tel: '',
      address: '',
      payment_method: '',
    },
    mode: 'onTouched',
  });

  const getCarts = async () => {
    try {
      const res = await axios.get(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/cart`,
      );
      setCartData(res.data.data.carts);
      //   console.log(res.data.data.carts);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  useEffect(() => {
    getCarts();
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      data: {
        user: {
          name: data.name,
          email: data.email,
          tel: data.tel,
          address: data.address,
        },
        message: data.message || '無備註',
      },
    };
    setIsLoading(true);
    try {
      await axios.post(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/order`,
        payload,
      );
      showSuccess(
        `訂單已送出！\n付款方式: ${data.payment_method}\n總金額: $${finalTotal}`,
      );
      reset();
      getCarts();
      navigate('/');
    } catch (error) {
      showError(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 計算金額
  const { baseTotal } = cartData.reduce(
    (acc, item) => {
      const itemBasePrice = item.product.price;
      acc.baseTotal += itemBasePrice * item.qty;
      return acc;
    },
    { baseTotal: 0 },
  );

  const finalTotal = baseTotal + 120;

  return (
    <div className="container-xl">
      {isLoading && <Spinner />}
      <h1 className="py-5 fw-light">訂單資訊</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-4">
        <div className="row g-5 pt-3">
          {/* 左側：客戶資料與付款 */}
          <div className="col-md-7 col-lg-8 mt-0">
            {/* 1. 取餐人資訊 */}
            <div className="mb-4 p-5 main-border">
              <h4 className="pb-4 text-primary">
                <i className="bi bi-person-lines-fill"></i> 付款人資訊
              </h4>
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="name" className="form-label">
                    姓名*
                  </label>
                  <input
                    {...register('name', { required: '姓名 為必填' })}
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    placeholder="請輸入真實姓名"
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name.message}
                    </div>
                  )}
                </div>

                <div className="col-12 mt-3">
                  <label htmlFor="email" className="form-label">
                    Email*
                  </label>
                  <input
                    {...register('email', {
                      required: 'Email 為必填',
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'Email 格式不正確',
                      },
                    })}
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    placeholder="example@gmail.com"
                  />

                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="col-12 mt-3">
                  <label htmlFor="tel" className="form-label">
                    手機號碼*
                  </label>
                  <input
                    {...register('tel', {
                      required: '電話為必填',
                      minLength: { value: 10, message: '電話長度不足' },
                      maxLength: { value: 10, message: '超過電話長度' },
                      pattern: {
                        value: /^(09)\d{8}$/,
                        message: '電話格式不正確（請輸入 09 開頭）',
                      },
                    })}
                    type="tel"
                    className={`form-control ${errors.tel ? 'is-invalid' : ''}`}
                    id="tel"
                    placeholder="0912345678"
                  />
                  {errors.tel && (
                    <div className="invalid-feedback">{errors.tel.message}</div>
                  )}
                </div>

                <div className="col-12">
                  <label htmlFor="address" className="form-label">
                    地址*
                  </label>
                  <input
                    {...register('address', { required: '地址為必填' })}
                    type="text"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    id="address"
                    placeholder="請輸入詳細地址"
                    required
                  />
                  {errors.address && (
                    <div className="invalid-feedback">
                      {errors.address.message}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label htmlFor="message" className="form-label">
                    留言
                  </label>
                  <input
                    {...register('message')}
                    type="text"
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    id="message"
                    placeholder="請輸入要給我們的留言..."
                  />
                  {errors.message && (
                    <span style={{ color: 'red' }}>
                      {errors.message.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. 付款方式 */}
            <div className="mb-4 p-5 main-border">
              <h4 className="pb-4 text-primary">
                <i className="bi bi-wallet2"></i> 付款方式
              </h4>

              <div className="d-grid gap-3">
                {/* 選項：信用卡 */}
                <div className="payment-option">
                  <input
                    {...register('payment_method', {
                      required: '請選擇一個付款方式',
                    })}
                    type="radio"
                    value="credit_card"
                    id="payment_credit"
                    className="form-check-input"
                  />
                  <label htmlFor="payment_credit" className="payment-card">
                    <i className="bi bi-credit-card-2-front"></i>
                    <div>
                      <div className="fw-bold">信用卡 / 金融卡</div>
                      <small className="text-muted">Visa, Master, JCB</small>
                    </div>
                    <i className="bi bi-check-circle-fill check-icon"></i>
                  </label>
                </div>

                {/* 選項：電子支付 */}
                <div className="payment-option">
                  <input
                    {...register('payment_method', {
                      required: '請選擇一個付款方式',
                    })}
                    type="radio"
                    value="e_payment"
                    id="payment_epay"
                    className="form-check-input"
                  />
                  <label htmlFor="payment_epay" className="payment-card">
                    <i className="bi bi-phone"></i>
                    <div>
                      <div className="fw-bold">電子支付</div>
                      <small className="text-muted">
                        LINE Pay, 街口支付, Apple Pay
                      </small>
                    </div>
                    <i className="bi bi-check-circle-fill check-icon"></i>
                  </label>
                </div>

                {errors.payment_method && (
                  <span className="text-danger mt-2">
                    {errors.payment_method.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 右側：訂單摘要 (Sticky Sidebar) */}
          <div className="col-md-5 col-lg-4 mt-0 main-border mb-4 ">
            <div className="order-summary-card p-4">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">購物車清單</span>
                <span className="badge bg-primary rounded-pill fw-normal py-2 px3">
                  {cartData.length}
                </span>
              </h4>

              {/* 商品列表 */}
              <ul className="list-group list-group-flush mb-3 px-2">
                {cartData.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-transparent"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="item-thumbnail me-3"
                      />
                      <div>
                        <h6 className="my-0">{item.product.title}</h6>
                        <small className="text-muted">數量 x {item.qty}</small>
                      </div>
                    </div>
                    <span className="text-muted">
                      $ {(item.product.price * item.qty).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>

              {/* 金額計算 */}
              <div className="d-flex justify-content-between mb-2">
                <span>小計</span>
                <span>$ {baseTotal.toLocaleString()}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>運費</span>
                <span>$ 120</span>
              </div>

              <div className="d-flex justify-content-between mt-3 pt-3 border-top border-gray-100">
                <span className="fs-5 fw-medium">總計</span>
                <span className="fs-5 fw-medium text-primary">
                  $ {finalTotal.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 mt-4"
                disabled={cartData.length <= 0}
              >
                送出訂單
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
