import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)emmaToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    if (token) {
      setIsAuth(true);
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
