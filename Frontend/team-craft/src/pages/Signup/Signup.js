import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';


function Signup() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1); 
  };
  return (
    <signup>
    <div className={styles.wrapper}>

    <div className={styles.form}>
    <h1>Регистрация</h1>

    <form noValidate>
            <div className={styles.field}>
                <label htmlFor="login">логин</label>
                <input name="login" type="text" id="login" autoFocus required />
            </div>

            <div className={styles.field}>
                <label htmlFor="password">пароль</label>
                <input name="password" type="password" id="password" required />
            </div>

            <div className={styles.field}>
                <label htmlFor="confirmPassword">подтвердите пароль</label>
                <input type="password" id="confirmPassword" />
                <p id="passwordMatch"></p>

            </div>

            <div className={styles.field}>
                <label htmlFor="username">имя</label>
                <input type="text" id="username" />
            </div>

            <div className={styles.field}>
                <label htmlFor="surname">фамилия</label>
                <input type="text" id="surname" />
            </div>

            <div className={styles.field}>
                <label htmlFor="birth_date">дата рождения</label>
                <input type="date" id="birth_date" />
            </div>
        <div className={styles.field_dropdown}>
            <label htmlFor="optns">пол</label>
            <div className={styles.select_container}>
                    <select id="optns" name="gender">
                        <option value="male">мужской</option>
                        <option value="female">женский</option>
                        <option value="helicopter">боевой вертолет</option>
                    </select>
            </div>
        </div>

        <div className={styles.field_textarea}>
            <label htmlFor="user_contacts">контакты</label>
            <textarea
                id="user_contacts"
                name="multiline-text"
                rows="4"
                cols="50"
                required
                onInvalid={() => this.setCustomValidity('Нужно для связи участников команд с вами.')}
                onInput={() => this.setCustomValidity('')}
            ></textarea>
        </div>
        
    <div className={styles.btns}>
    <button className={`${styles.cancel}`} type="button" id="cancel" onClick={handleCancel}>Отмена</button>
    <button className={`${styles.confirm}`} type="button" id="confirm">Завершить</button>
    </div>

    </form>
    </div>
    </div>
    
    </signup>

  );
}

export default Signup;
