import { useState, useEffect } from 'react';
import axios from 'axios';

import Pagination from '../../components/Pagination';
import CustomModal from '../../components/Modal';
import ConfirmModal from '../../components/ConfirmModal';
import Spinner from '../../components/Spinner';

import { useNavigate } from 'react-router-dom';
import useMessage from '../../hooks/useMessage';

const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;

function AdmProduct() {
  const [productData, setProductData] = useState([]);
  const initialProductState = {
    title: '',
    category: '',
    origin_price: '',
    price: '',
    unit: '',
    description: '',
    content: '',
    is_enabled: 0,
    imageUrl: ' ',
    star: '',
  };
  const [newProductData, setNewProductData] = useState(initialProductState);
  const [modalMode, setModalMode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pagination, setPagination] = useState({});
  const [delProductId, setDelProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigator = useNavigate();
  const { showError, showSuccess } = useMessage();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    axios.defaults.headers.common.Authorization = token;
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${VITE_APP_API_BASE}/api/user/check`);
      getProduct();
    } catch (err) {
      showError(err.response.data.message);
      navigator('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, stateType) => {
    const { name, value, type, checked } = e.target;
    const setter = stateType === 'auth' ? setFormData : setNewProductData;

    let newValue = value;

    if (type === 'checkbox') {
      newValue = name === 'is_enabled' ? (checked ? 1 : 0) : checked;
    } else if (type === 'number') {
      newValue = Number(value);
    }

    setter((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const getProduct = async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/admin/products?page=${page}`,
      );
      setProductData(res.data.products);
      setPagination(res.data.pagination);
      showSuccess('讀取商品成功');
    } catch (error) {
      showError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openProductModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === 'add') {
      setNewProductData(initialProductState);
    } else {
      setNewProductData(product);
    }
    toggleModal();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openConfirmModal = (productId) => {
    setDelProductId(productId);
    setIsConfirmModalOpen(true);
  };

  const handleUpdateProduct = async () => {
    let api = `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/admin/product`;
    let method = 'post';

    if (modalMode === 'edit') {
      api = `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/admin/product/${newProductData.id}`;
      method = 'put';
    }
    setIsLoading(true);
    try {
      const res = await axios[method](api, { data: newProductData });
      showSuccess(res.data.message);
      setNewProductData(initialProductState);
      toggleModal();
      getProduct();
    } catch (error) {
      showError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/admin/product/${id}`,
      );
      showSuccess(res.data.message);
      setIsConfirmModalOpen(false);
      getProduct();
    } catch (error) {
      showError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file-to-upload', file);
      const res = await axios.post(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/admin/upload`,
        formData,
      );
      showSuccess('圖片上傳成功');
      setNewProductData((pre) => ({
        ...pre,
        imageUrl: res.data.imageUrl,
      }));
    } catch (error) {
      showError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner></Spinner>}
      <div>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h1 className="py-2 fw-light">商品管理</h1>
            <button
              className="btn btn-primary rounded-pill"
              onClick={() => openProductModal('add')}
            >
              建立新的產品
              <i className="bi bi-plus-lg ms-1"></i>
              <div className="hoverEffect">
                <div></div>
              </div>
            </button>
          </div>
          <table className="table mt-3 custom-table">
            <thead>
              <tr>
                <th width="60">圖片</th>
                <th width="120">分類</th>
                <th width="240">產品名稱</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="100">啟用狀態</th>
                <th width="120">操作</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((product) => {
                return (
                  <tr key={product.id}>
                    <td style={{ verticalAlign: 'middle' }}>
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="rounded"
                        style={{
                          height: '40px',
                          width: '40px',
                          objectFit: 'cover',
                        }}
                      />
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      {product.category}
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>{product.title}</td>
                    <td style={{ verticalAlign: 'middle' }}>
                      {product.origin_price}
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>{product.price}</td>
                    <td style={{ verticalAlign: 'middle' }}>
                      {product.is_enabled ? (
                        <span className="text-success">
                          <i className="bi bi-check-lg"></i>
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="bi bi-x-lg"></i>
                        </span>
                      )}
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <div className="btn-group">
                        <button
                          type="button"
                          className="btn btn-sm "
                          onClick={() => openProductModal('edit', product)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          type="button"
                          className="btn  btn-sm"
                          onClick={() => openConfirmModal(product.id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProduct} />
          <ConfirmModal
            setIsConfirmModalOpen={setIsConfirmModalOpen}
            isConfirmModalOpen={isConfirmModalOpen}
            deleteProduct={deleteProduct}
            delProductId={delProductId}
          />
        </div>
        <CustomModal
          toggleModal={toggleModal}
          handleInputChange={handleInputChange}
          newProductData={newProductData}
          isModalOpen={isModalOpen}
          modalMode={modalMode}
          handleUpdateProduct={handleUpdateProduct}
          uploadImage={uploadImage}
        />
      </div>
    </>
  );
}

export default AdmProduct;
