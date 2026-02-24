import Layout from '../App';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Carts from '../pages/Carts';
import Checkout from '../pages/Checkout';
import NotFound404 from '../pages/NotFound404';
import AdmProduct from '../pages/admin/AdmProduct';

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
      },
      {
        path: 'carts',
        element: <Carts />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'adm/product',
        element: <AdmProduct />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound404 />,
  },
];

export default routes;
