import React, {useRef, useState, useEffect, useContext} from 'react';
import styles from './Profile.module.css'; // Подключите файл стилей
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom'; // Предполагается, что вы используете React Router
import axios from 'axios';

const TOKEN_URL = 'https://a25715-5073.x.d-f.pw/api/data';

export default function Account() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Функция для загрузки данных пользователя при монтировании компонента
        const fetchUserData = async () => {
        try {
            
            const token = localStorage.getItem('token'); // Получение токена из хранилища
            const response = await axios.get(TOKEN_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            setUserData(response.data); // Установка данных пользователя в состоянии
            console.log(response);
        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя:', error);
        }
        };

        fetchUserData(); // Вызов функции загрузки данных пользователя
    }, []); // Пустой массив зависимостей для вызова useEffect только один раз при монтировании

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
                <p className={styles.nick}>Никнейм</p>
                <p className={styles.init}>Имя Фамилия</p>
              </div>
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.personal}>
              <h2>Личная информация</h2>
              <div className={styles.fields}>
                <div className={styles.field}>
                  <h6>ИМЯ</h6>
                  <p>Костян</p>
                </div>
                <div className={styles.field}>
                  <h6>ФАМИЛИЯ</h6>
                  <p>Фабрикатор</p>
                </div>
                <div className={styles.field}>
                  <h6>ДАТА РОЖДЕНИЯ</h6>
                  <p>Календарь с датой рождения</p>
                </div>
                <div className={styles.field}>
                  <h6>ПОЛ</h6>
                  <p>Мужской</p>
                </div>
                <div className={styles.field}>
                  <h6>О СЕБЕ</h6>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </p>
                </div>
                <div className={styles.field}>
                  <h6>КОНТАКТЫ</h6>
                  <p>ссылка на вк и телегу</p>
                </div>
              </div>

              <div className={styles.edit}>
                <Link to="/account_edit">Редактировать профиль</Link>
              </div>
            </div>
            <div className={styles.teams}>
              <h2>Команды</h2>
              <div className={styles.blocks_teams}>
                <div className={styles.block_team}>
                  <img src="images/csgo.ico" alt="Иконка команды" className={styles.team_icon} />
                  <div className={styles.desc}>
                    <p className={styles.team_title}>Турнир по CS:GO</p>
                    <div className={styles.state}>
                      <div className={styles.circle} id="1"></div>
                      <p className={styles.fullness}>3 из 5</p>
                    </div>
                  </div>
                </div>
                <div className={styles.block_team}>
                  <img src="images/хакатон.jpg" alt="Иконка команды" className={styles.team_icon} />
                  <div className={styles.desc}>
                    <p className={styles.team_title}>Хакатончик</p>
                    <div className={styles.state}>
                      <div className={styles.circle} id="2"></div>
                      <p className={styles.fullness}>3 из 3</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.buttons}>
                <a href="#" className={styles.button} id="b1">
                  Найти
                </a>
                <a href="#" className={styles.button} id="b2">
                  Создать
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
