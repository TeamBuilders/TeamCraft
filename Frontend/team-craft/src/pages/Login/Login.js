import React, {useRef, useState, useEffect, useContext} from 'react';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
const LOGIN_URL = 'https://a25581-9d46.w.d-f.pw/api/login';

export default function Login(){
    const {setAuth} = useContext(AuthContext);
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
    }, [user,pwd])

    const handleSubmit = async (e) => {
      e.preventDefault();

      try{
        const response = await axios.post(LOGIN_URL, 
          JSON.stringify({login: user, password: pwd}),
          {
            headers: { 'Content-Type' : 'application/json'},
            // withCredentials: true
          });

        console.log(JSON.stringify(response?.data));
        const jwtToken = response?.data?.jwtToken;
        setAuth({ user, pwd, jwtToken });
        setUser('');
        setPwd('');
        
      }catch (err){

        if(!err.response){
          setErrMsg('No Server Response');
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized');
        } else {
            setErrMsg('Login Failed');
        }
        errRef.current.focus();

      }
    }

    return(
    <div>
        <div className={styles.login}>
            <div className={styles.form}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Вход</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.input_form}>
                        <label htmlFor="username">логин</label>
                        <input
                        type='text'
                        id='username'
                        ref={userRef}
                        autoComplete='off'
                        onChange={(e) => setUser(e.target.value)}
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
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        />
                    </div>

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