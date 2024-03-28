import React, {useRef, useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { Link, Router } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
const LOGIN_URL = 'https://a25715-5073.x.d-f.pw/api/login';

export default function Login(){

    const navigate = useNavigate();
    
    const [resErr, setResErr] = useState('');
    const {setIsAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
      userRef.current.focus();
    }, [])

    useEffect(() => {
      setErrMsg('');
      setResErr('');
    }, [user,pwd])

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const jsonData = JSON.stringify({
          login: user,
          password: pwd,
        });
    
        const response = await axios.post(LOGIN_URL, jsonData, {
          headers: { "Content-Type": "application/json" },
        });
    
        if (response.status === 200) {
          const userData = response.data?.user?.dataUser;
          const token = response.data?.jwtToken;
    
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setIsAuth(token);
    
          // Переходим на страницу профиля
          navigate("/profile");
        }
      } catch (err) {
        console.error('Ошибка при отправке запроса:', err);
    
        if (err.response) {
          if (err.response.status === 400) {
            if (err.response.data.message[0] === 'Inccorect password or login') {
              setResErr('Неправильный пароль или логин');
            }
          } else {
            setErrMsg('Ошибка входа');
          }
        } else {
          setErrMsg('Нет ответа от сервера');
        }
      }
    }
            // {"user": {
            //   "id":3,
            //   "dataUserId":3,
            //   "dataUser":{
            //     "Id":3,
            //     "name":"alex",
            //     "sureName":"uglov",
            //     "descriptionUser":null,
            //     "databirthday":"2000-12-31T00:00:00",
            //     "gender":"male",
            //     "hobbiesPerson":null,
            //     "skillsPerson":null,
            //     "goalsPerson":null,
            //     "urlContact":"vk",
            //     "inTeam":false
            //   },
            //   "settingsUserId":3,
            //   "settingsUser":{
            //     "id":3,
            //     "login":"ArteFomak",
            //     "isHiddeInResearch":false,
            //     "isHiddenData":false}
            //   },
            //   "jwtToken":
            //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBZG1pbjEiOiIxMjMxMnFXISIsImV4cCI6MTcxMTM5Mjk2NiwiaXNzIjoiTXlBdXRoU2VydmVyIiwiYXVkIjoiTXlBdXRoQ2xpZW50In0.TDzUBr-Bx1N7kX49tTFAQQOexr6mMXK2WEV1_QInLfw"
            // }
    return(
    <div>
        <div className={styles.login}>
            <div className={styles.form}>
                {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
                <h1>Вход</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.input_form}>
                        <label htmlFor="username">логин</label>
                        <input
                        type='text'
                        id='username'
                        ref={userRef}
                        autoComplete='off'
                        onChange={(e) => {
                          setUser(e.target.value);
                        }}
                        value={user}
                        required
                        />
                    </div>

                    <div className={styles.input_form}>
                        <label htmlFor="password">пароль</label>
                        <input
                        type='password'
                        id='password'
                        ref={userRef}
                        onChange={(e) => {
                          setPwd(e.target.value);
                        }}
                        value={pwd}
                        required
                        />
                    </div>
                
                    <p
                      className={resErr ? styles.errmsg : styles.offscreen}
                      aria-live="assertive"
                    >
                      {resErr}
                    </p>

                    <div className={`${styles.input_form} ${styles.button}`}>
                        <input type="submit" value="Войти"/>
                    </div>
                </form>
                <p className={styles.text}>
                    Нет аккаунта? <Link to="/signup" className={styles.reg_button}>Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    </div>
    );
}