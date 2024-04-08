import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api/apiConfig';
const DATA_URL = API_URL + '/data';
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const checkTokenValidity = async () => {
      try {
        if (token) {
          const response = await axios.post(DATA_URL, { token });
          if (response.data.success) {
            setAuth({ token });
          } else {
            localStorage.removeItem('token');
            setAuth({});
          }
        }
      } catch (error) {
        console.error('Ошибка при проверке токена:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTokenValidity();
  }, []);

  const value = { auth, setAuth };

  if (loading) {
    return <div>Проверка аутентификации...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
