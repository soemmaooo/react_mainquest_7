import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Spinner from './components/Spinner';

import axios from 'axios';
import MessageToast from './components/MessageToast';
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from './slice/messageSlice';

const { VITE_APP_API_BASE } = import.meta.env;

function App() {
  const navigate = useNavigate();
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${VITE_APP_API_BASE}/logout`);
      document.cookie = `emmaToken=""; expires= Thu, 01 Jan 1970 00:00:00 GMT;`;
      setIsAuth(false);
      dispatch(createAsyncMessage(res.data));
      navigate('/login');
    } catch (error) {
      dispatch(createAsyncMessage(error.res.data));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Spinner />}
      <MessageToast />

      <nav className="main-nav">
        <div className="container">
          <ul className="d-flex align-items-center mb-0">
            <li className="me-4">
              <NavLink className="link fw-light" to="/">
                拾光餐桌
              </NavLink>
            </li>
            <li className="me-4">
              <NavLink className="link fs-5" to="/products">
                商品列表
              </NavLink>
            </li>
            <li className="ms-auto">
              <NavLink className="link fs-6 text-primary" to="/adm/product">
                前往後台
              </NavLink>
            </li>
            <li className="ms-4">
              <NavLink className="fs-3 me-3" to="/carts" title="購物車">
                <i className="bi bi-cart-fill"></i>
              </NavLink>
            </li>
            <li>
              {isAuth ? (
                <button
                  onClick={handleLogout}
                  className="btn btn-link fs-3 p-0"
                  title="登出"
                >
                  <i className="bi bi-door-open-fill"></i>
                </button>
              ) : (
                <NavLink className="fs-3" to="/login" title="登入">
                  <i className="bi bi-person-fill"></i>
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}

export default App;
