import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkTokenValidity(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkTokenValidity = async () => {
    try {
      const response = await axios.get('https://a25715-5073.x.d-f.pw/api/data', {
      headers: {
        Authorization: `Bearer ${token}` // Передача токена в заголовке Authorization
      }
    });
      console.log(token);
      console.log(response);
      if (response?.data?.success) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
        setToken('');
        localStorage.setItem('token', '');
      }
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      checkTokenValidity();
    } else {
      setLoading(false);
    }
  }, [token]);


  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
