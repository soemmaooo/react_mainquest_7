import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';

import useMessage from '../hooks/useMessage';

const { VITE_APP_API_BASE } = import.meta.env;

export default function Login() {
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const { showError, showSuccess } = useMessage();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const handleLogin = async (data) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${VITE_APP_API_BASE}/admin/signin`, data);
      const { token, expired } = res.data;
      document.cookie = `emmaToken=${token}; expires=${new Date(expired)};`;
      showSuccess(res.data.message);
      setIsAuth(true);
      reset();
      navigate('/');
    } catch (error) {
      showError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}

      <div className="container-lg">
        <div className="login-layout main-border p-5">
          <h2 className="text-center fw-light pb-3">登入</h2>
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="col-12 mt-3">
              <label htmlFor="email" className="form-label">
                帳號
              </label>

              <input
                {...register('username', {
                  required: '帳號 為必填',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email 格式不正確',
                  },
                })}
                type="username"
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                placeholder="example@gmail.com"
              />

              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username.message}
                </div>
              )}
            </div>
            <div className="col-12 mt-3">
              <label htmlFor="password" className="form-label">
                密碼
              </label>
              <input
                {...register('password', {
                  required: '密碼 為必填',
                  minLength: { value: 6, message: '請至少輸入六位數字' },
                })}
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                placeholder="請至少輸入六位數字"
              />

              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 mt-4">
              登入
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
