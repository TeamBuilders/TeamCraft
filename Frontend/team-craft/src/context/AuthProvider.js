import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    const checkTokenValidity = async (token) => {
      try {
        const response = await axios.get('https://a25715-5073.x.d-f.pw/api/data', {
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
      checkTokenValidity(token);
    } else { 
      setLoading(false); // Если токен отсутствует, сразу устанавливаем флаг загрузки в false
    }
  }, [token]);
  
  // Возвращаем контекст вместе с токеном
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, token, setToken }}> 
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
