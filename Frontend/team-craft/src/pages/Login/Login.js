import React, {useRef, useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { Link, Router } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
// import { API_URL } from '../../api/apiConfig';
import axiosInstance from '../../api/axios';

const LOGIN_URL = '/login';

export default function Login(){

    const navigate = useNavigate();
    
    const [resErr, setResErr] = useState('');
    const {setIsAuth, setToken} = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [type, setType] = useState('password');
    //states for the eye icon
    const [icon, setIcon] = useState(eyeOff);
    const [isFocused, setIsFocused] = useState(false);

    //function for changing the type of password input field
    const handleToggle = () => {
      if (type==='password'){
         setIcon(eye);
         setType('text')
      } else {
         setIcon(eyeOff)
         setType('password')
      }
   }

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
        const response = await axiosInstance.post(LOGIN_URL, jsonData, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          const userData = response.data?.user?.dataUser;

          // delete userData.Id; // Удаляем Id из userData
          localStorage.setItem('userData', JSON.stringify(userData));
          localStorage.setItem('token', response.data?.jwtToken);
          localStorage.setItem('user', JSON.stringify(response.data?.user?.settingsUser?.login));
          localStorage.setItem('email', JSON.stringify(response.data?.user?.settingsUser?.email));
          localStorage.setItem('id', JSON.stringify(response.data?.user?.id));
          localStorage.setItem('dataUserId', JSON.stringify(response.data?.user?.dataUserId));
          localStorage.setItem('settingsUserId', JSON.stringify(response.data?.user?.settingsUserId));
          localStorage.setItem('isHiddeInResearch', JSON.stringify(response.data?.user?.settingsUser?.isHiddeInResearch));
          localStorage.setItem('isHiddenData', JSON.stringify(response.data?.user?.settingsUser?.isHiddenData));


          // Переходим на страницу профиля

          setToken(response.data?.jwtToken);
          navigate("/profile");
        }
      } catch (err) {
        console.error(err);
        console.error('Ошибка при отправке запроса:', err.response?.data.message);
    
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
                        className={styles.username}
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
                        <div className={isFocused ? styles.focus_input_form_password : styles.input_form_password }>
                          <input
                          type={type}
                          id='password'
                          ref={userRef}
                          onChange={(e) => {
                            setPwd(e.target.value);
                          }}
                          value={pwd}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          required
                          />
                          <span className={styles.icon} onClick={handleToggle}>
                            <Icon icon={icon} size={20} />
                          </span>
                        </div>
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