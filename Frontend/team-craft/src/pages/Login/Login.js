import React, {useRef, useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { Link, Router } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

const LOGIN_URL = 'https://a25715-5073.x.d-f.pw/api/login';

export default function Login(){

    const navigate = useNavigate();
    
    const [resErr, setResErr] = useState('');
    const {setAuth} = useContext(AuthContext);
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

      try{
        const jsonData = JSON.stringify({
          login: user,
          password: pwd,
        });
        console.log(jsonData);
        const response = await axios.post(LOGIN_URL, jsonData, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(JSON.stringify(response?.data));
        if (response?.status === 200) {
          const token = response?.data?.jwtToken;
          // setAuth({ user, pwd, jwtToken });
          localStorage.setItem('token', token);
          navigate("/profile");
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
      }catch (err){

        console.log(err.response.data);
        if(!err?.response){
          setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
            if (err.response.data.message[0] === 'Inccorect password or login') {
              setResErr('Incorrect password or login');
            }
        } else {
            setErrMsg('Login Failed');
        }
        setErrMsg(err.response.data.message);
      }
    }
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