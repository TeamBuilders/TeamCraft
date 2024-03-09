import React from 'react';
import styles from './Login.module.css';

export default function Login(){
    return(
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
        <p style={{textAlign: "center", marginTop: "20px", color: "#FFFFFF", fontWeight: 300, marginTop: "80px", marginBottom: 0, fontSize: "15px"}}>
            Нет аккаунта? <a href="registration.html">Зарегистрироваться</a>
        </p>
    </div>

    );
}