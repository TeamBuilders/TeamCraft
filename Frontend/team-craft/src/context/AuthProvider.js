import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
// import { API_URL } from '../api/apiConfig';
import axiosInstance from '../api/axios';
const CHECK_URL = '/data';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const checkTokenValidity = async (token) => {
      try {
        const response = await axiosInstance.get(CHECK_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response?.status === 200) {
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
        setLoading(false); // Устанавливаем флаг загрузки в false после завершения проверки токена
      }
    };

    if (token) {
      // checkTokenValidity(token);
      setIsAuth(true);
      setLoading(false); // Устанавливаем флаг загрузки в false после завершения проверки токена

    } else { 
      setLoading(false); // Если токен отсутствует, сразу устанавливаем флаг загрузки в false
    }
  }, [token]);
  
  // Возвращаем контекст вместе с токеном
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, token, setToken }}> 
      {loading ? (
      <div style={{ backgroundColor: '#1d2125', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      Loading...
    </div>
    ) : (
      children
    )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
