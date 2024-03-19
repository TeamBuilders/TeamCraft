import {createContext, useState} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});

    const [IsLogin, setIsLogin] = useState(true)

    return(
        <AuthContext.Provider value={{ auth, setAuth, IsLogin, setIsLogin }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;