import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
    const [isAuth, setIsAuth] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    const checkTokenValidity = async () => {
        try {
            const response = await axios.post('https://a25715-5073.x.d-f.pw/api/data', { token }); // Примерный маршрут на сервере для проверки токена
            if (response.data.success) {
                setIsAuth(true);
            } else {
                setIsAuth(false);
                setToken(''); // Очистить токен из localStorage, если он недействителен
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Ошибка при проверке токена:', error);
            setIsAuth(false);
        }
    };

    useEffect(() => {
        if (token) {
            checkTokenValidity();
        }
    }, [token]);

    return (
        <AuthContext.Provider   
            value={{
                isAuth,
                setIsAuth,
                token,
                setToken,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
