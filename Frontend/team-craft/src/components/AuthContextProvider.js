import { useEffect, useState } from '';

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

    // Здесь вы должны отправить запрос на сервер, чтобы проверить токен
    // Если токен правильный, то вызвать setIsAuth(true) и сохранить новый токен в localStorage

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