import React from 'react';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';

export default function Login(){
    return(
    <login >
        <div className={styles.form}>
            <h1>Вход</h1>
            <form action="account.html">
                <div className={styles.input_form}>
                    <label htmlFor="username">логин</label>
                    <input type="text" id="username" placeholder=""/>
                </div>

                <div className={styles.input_form}>
                    <label htmlFor="password">пароль</label>
                    <input type="password" id="password" placeholder=""/>
                </div>

                <div className={`${styles.input_form} ${styles.button}`}>
                    <input type="submit" value="Войти"/>
                </div>
            </form>
            <p className={styles.text}>
                Нет аккаунта? <Link to="/signup" className={styles.reg_button}>Зарегистрироваться</Link>
            </p>
        </div>
    </login>
    );
}