import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/all.scss';
import routes from './routes/index.jsx';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { Provider } from 'react-redux';
import store from './store/store.js';

const router = createHashRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
