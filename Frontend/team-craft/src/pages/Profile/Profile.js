import React, {useRef, useState, useEffect, useContext} from 'react';
import styles from './Profile.module.css'; // Подключите файл стилей
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AuthContext from '../../context/AuthProvider';
import { Link } from 'react-router-dom'; // Предполагается, что вы используете React Router
import axios from 'axios';

const TOKEN_URL = 'https://a25715-5073.x.d-f.pw/api/data';

export default function Account() {

  // Проверка аутентификации пользователя
  const { isAuth, setIsAuth } = useContext(AuthContext);

  // Получение данных пользователя из локального хранилища
  const userData = JSON.parse(localStorage.getItem('userData'));
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(userData);
  console.log(localStorage.getItem('user'));

  return (
    <div>
      <Header />
      <div className={styles.bgcolor}>
      <div className={styles.container}>
        <div className={styles.account}>
          <div className={styles.profile}>
            <h1>Аккаунт</h1>
          </div>

          <div className={styles.acc_panel}>
            <img src="../../images/avatar.jpg" alt="Аватар" className={styles.avatar} />

            <div className={styles.initials}>
              <p className={styles.nick}>{user}</p> 
              <p className={styles.init}>{userData.name} {userData.sureName}</p> {/* Отображаем имя и фамилию пользователя */}
            </div>
          </div>
        </div>
        <div className={styles.description}>
          <div className={styles.personal}>
            <h2>Личная информация</h2>
            <div className={styles.fields}>
              <div className={styles.field}>
                <h6>ИМЯ</h6>
                <p>{userData.name}</p>
              </div>
              <div className={styles.field}>
                <h6>ФАМИЛИЯ</h6>
                <p>{userData.sureName}</p>
              </div>
              <div className={styles.field}>
                <h6>ДАТА РОЖДЕНИЯ</h6>
                <p>{userData.databirthday}</p> {/* Предполагается, что у вас есть эта информация в формате, который можно отобразить */}
              </div>
              <div className={styles.field}>
                <h6>ПОЛ</h6>
                <p>{userData.gender}</p>
              </div>
              <div className={styles.field}>
                <h6>О СЕБЕ</h6>
                <p>{userData.descriptionUser}</p>
              </div>
              <div className={styles.field}>
                <h6>КОНТАКТЫ</h6>
                <p>{userData.urlContact}</p>
              </div>
            </div>

            <div className={styles.edit}>
              {/* Добавьте ссылку на страницу редактирования профиля */}
            </div>
          </div>
          <div className={styles.teams}>
            <h2>Команды</h2>
            {/* Добавьте отображение команд пользователя */}
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </div>
  );
}
