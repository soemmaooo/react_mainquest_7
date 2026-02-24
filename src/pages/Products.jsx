import { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;

export default function Products() {
  const [productsData, setProductData] = useState([]);

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/products/all`,
      );
      setProductData(res.data.products);
      // console.log(res.data.products);
    } catch (err) {
      toast('取得失敗: ' + err.response.data.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <h1 className="py-5 fw-light">商品列表</h1>
      <ul className="row list-unstyled d-flex flex-wrap">
        {productsData.map((product) => {
          return (
            <li className="col-3 mb-4" key={product.id}>
              <NavLink to={product.id}>
                <div className="card">
                  <div className="image">
                    <img src={product.imageUrl} alt={product.title} />
                  </div>
                  <span className="title">{product.title}</span>
                  <span className="price">{`$ ${product.price}`}</span>
                </div>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}
